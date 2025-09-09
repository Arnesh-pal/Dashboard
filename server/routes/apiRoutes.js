const db = require('../models');
const { Op } = require('sequelize');
const requireJWT = require('../middlewares/authJWT');

module.exports = app => {
    // --- HEALTH CHECK ---
    app.get('/api/health', (req, res) => {
        res.status(200).send({ status: 'ok' });
    });

    // --- DASHBOARD & CHARTS ---
    app.get('/api/dashboard_stats', requireJWT, async (req, res) => {
        try {
            const userId = req.user.id;
            const [income, expense, transactionCount, userCount] = await Promise.all([
                db.Transaction.sum('amount', { where: { userId, type: 'income' } }),
                db.Transaction.sum('amount', { where: { userId, type: 'expense' } }),
                db.Transaction.count({ where: { userId } }),
                db.Profile.count({ where: { userId } })
            ]);
            res.status(200).json({
                totalRevenues: (income || 0) - (expense || 0),
                totalTransactions: transactionCount || 0,
                totalUsers: userCount || 0,
            });
        } catch (err) {
            console.error("Error in /api/dashboard_stats:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    app.get('/api/activities_chart', requireJWT, async (req, res) => {
        // ... (This route was already correct and is kept as is)
        const { view } = req.query;
        const userId = req.user.id;
        try {
            if (view === 'year') {
                const oneYearAgo = new Date(); oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                const transactions = await db.Transaction.findAll({ where: { userId, date: { [Op.gte]: oneYearAgo } }, attributes: [[db.sequelize.fn('date_trunc', 'month', db.sequelize.col('date')), 'group'], [db.sequelize.fn('sum', db.sequelize.literal(`CASE WHEN type = 'expense' THEN amount ELSE 0 END`)), 'expenseTotal'], [db.sequelize.fn('sum', db.sequelize.literal(`CASE WHEN type = 'income' THEN amount ELSE 0 END`)), 'incomeTotal']], group: ['group'], order: [['group', 'ASC']] });
                res.send({ transactions, view: 'year' });
            } else {
                const now = new Date(); const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                const transactions = await db.Transaction.findAll({ where: { userId, date: { [Op.between]: [startOfMonth, endOfMonth] } }, order: [['date', 'ASC']] });
                res.send({ transactions, view: 'month' });
            }
        } catch (error) {
            console.error("Chart data error:", error);
            res.status(500).send({ error: "Failed to fetch chart data" });
        }
    });

    // --- SALES ---
    app.get('/api/top_products', requireJWT, async (req, res) => {
        const topProducts = await db.Sale.findAll({ where: { userId: req.user.id }, attributes: ['productName', [db.sequelize.fn('sum', db.sequelize.col('quantity')), 'totalQuantity']], group: ['productName'], order: [[db.sequelize.fn('sum', db.sequelize.col('quantity')), 'DESC']], limit: 3 });
        res.send(topProducts);
    });
    app.get('/api/sales', requireJWT, async (req, res) => {
        const sales = await db.Sale.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] });
        res.send(sales);
    });
    app.post('/api/sales', requireJWT, async (req, res) => {
        const sale = await db.Sale.create({ ...req.body, userId: req.user.id });
        res.status(201).send(sale);
    });
    app.put('/api/sales/:id', requireJWT, async (req, res) => {
        await db.Sale.update(req.body, { where: { id: req.params.id, userId: req.user.id } });
        res.status(200).send({ message: 'Sale updated.' });
    });
    app.delete('/api/sales/:id', requireJWT, async (req, res) => {
        await db.Sale.destroy({ where: { id: req.params.id, userId: req.user.id } });
        res.status(200).send({ message: 'Sale deleted.' });
    });

    // server/routes/apiRoutes.js

    // --- TRANSACTIONS ---
    app.get('/api/transactions/summary', requireJWT, async (req, res) => {
        // ✅ FIX: Correctly define the start and end of the current month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const [income, expense] = await Promise.all([
            db.Transaction.sum('amount', { where: { userId: req.user.id, type: 'income', date: { [Op.between]: [startOfMonth, endOfMonth] } } }),
            db.Transaction.sum('amount', { where: { userId: req.user.id, type: 'expense', date: { [Op.between]: [startOfMonth, endOfMonth] } } })
        ]);
        res.send({
            monthlyIncome: income || 0,
            monthlyExpense: expense || 0,
            net: (income || 0) - (expense || 0)
        });
    });

    app.get('/api/transactions', requireJWT, async (req, res) => {
        const transactions = await db.Transaction.findAll({ where: { userId: req.user.id }, order: [['date', 'DESC']] });
        res.send(transactions);
    });

    app.post('/api/transactions', requireJWT, async (req, res) => {
        // ✅ FIX: Explicitly get all fields from the request body
        const { description, amount, type, date } = req.body;
        const transaction = await db.Transaction.create({ description, amount, type, date, userId: req.user.id });
        res.status(201).send(transaction);
    });

    app.put('/api/transactions/:id', requireJWT, async (req, res) => {
        // ✅ FIX: Find the transaction first, then update it to ensure data integrity
        const { id } = req.params;
        const transaction = await db.Transaction.findOne({ where: { id, userId: req.user.id } });
        if (transaction) {
            await transaction.update(req.body);
            return res.status(200).send(transaction);
        }
        return res.status(404).send({ error: "Transaction not found" });
    });

    app.delete('/api/transactions/:id', requireJWT, async (req, res) => {
        await db.Transaction.destroy({ where: { id: req.params.id, userId: req.user.id } });
        res.status(204).send();
    });

    // --- PROFILE / SETTINGS ---
    app.get('/api/profile', requireJWT, async (req, res) => {
        const user = await db.User.findByPk(req.user.id);
        res.send(user);
    });
    app.post('/api/profile', requireJWT, async (req, res) => {
        await db.User.update(req.body, { where: { id: req.user.id } });
        const updatedUser = await db.User.findByPk(req.user.id);
        res.send(updatedUser);
    });

    // --- SCHEDULES ---
    app.get('/api/schedules', requireJWT, async (req, res) => {
        const schedules = await db.Schedule.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'ASC']] });
        res.send(schedules);
    });
    app.post('/api/schedules', requireJWT, async (req, res) => {
        const { title, location, time, date } = req.body;
        const schedule = await db.Schedule.create({ title, location, time, date, userId: req.user.id });
        res.status(201).send(schedule);
    });
    app.put('/api/schedules/:id', requireJWT, async (req, res) => {
        const { id } = req.params;
        const schedule = await db.Schedule.findOne({ where: { id, userId: req.user.id } });
        if (schedule) {
            await schedule.update(req.body);
            return res.status(200).send(schedule);
        }
        return res.status(404).send({ error: "Schedule not found" });
    });
    app.delete('/api/schedules/:id', requireJWT, async (req, res) => {
        const { id } = req.params;
        await db.Schedule.destroy({ where: { id: id, userId: req.user.id } });
        res.status(204).send();
    });

    // --- USER PROFILES ---
    app.get('/api/users', requireJWT, async (req, res) => {
        const profiles = await db.Profile.findAll({ where: { userId: req.user.id } });
        res.send(profiles);
    });
    app.post('/api/profiles', requireJWT, async (req, res) => {
        const profile = await db.Profile.create({ ...req.body, userId: req.user.id });
        res.status(201).send(profile);
    });
    app.put('/api/profiles/:id', requireJWT, async (req, res) => {
        const { id } = req.params;
        const profile = await db.Profile.findOne({ where: { id: id, userId: req.user.id } });
        if (profile) {
            await profile.update(req.body);
            return res.status(200).send(profile);
        }
        return res.status(404).send({ error: "Profile not found" });
    });
    app.delete('/api/profiles/:id', requireJWT, async (req, res) => {
        const { id } = req.params;
        await db.Profile.destroy({ where: { id: id, userId: req.user.id } });
        res.status(204).send();
    });
};
