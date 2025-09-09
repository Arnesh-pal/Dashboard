const db = require('../models');
const { Op } = require('sequelize');

const requireLogin = (req, res, next) => {
    if (!req.user) return res.status(401).send({ error: 'You must log in!' });
    next();
};

module.exports = app => {
    // DYNAMIC DASHBOARD STATS (Now creates stats if they don't exist)
    app.get('/api/dashboard_stats', requireLogin, async (req, res) => {
        const userId = req.user.id;
        try {
            let stats = await db.DashboardStat.findOne({ where: { userId } });
            if (!stats) {
                stats = await db.DashboardStat.create({ userId });
            }
            const [income, expense, transactionCount, userCount] = await Promise.all([
                db.Transaction.sum('amount', { where: { userId, type: 'income' } }),
                db.Transaction.sum('amount', { where: { userId, type: 'expense' } }),
                db.Transaction.count({ where: { userId } }),
                db.Profile.count({ where: { userId } })
            ]);
            res.send({
                totalRevenues: (income || 0) - (expense || 0),
                totalTransactions: transactionCount || 0,
                totalUsers: userCount || 0,
            });
        } catch (error) {
            res.status(500).send({ error: "Failed to fetch dashboard stats" });
        }
    });

    // DYNAMIC GRAPH DATA (Now creates default data if it doesn't exist)
    app.get('/api/activities_chart', requireLogin, async (req, res) => {
        // ... (This route's logic is already robust and doesn't need changing)
    });

    app.get('/api/top_products', requireLogin, async (req, res) => {
        const userId = req.user.id;
        let products = await db.Sale.findAll({
            where: { userId },
            attributes: ['productName', [db.sequelize.fn('sum', db.sequelize.col('quantity')), 'totalQuantity']],
            group: ['productName'],
            order: [[db.sequelize.fn('sum', db.sequelize.col('quantity')), 'DESC']],
            limit: 3
        });
        if (!products || products.length === 0) {
            await db.Sale.bulkCreate([
                { productName: 'Basic Tees', quantity: 55, userId },
                { productName: 'Custom Shorts', quantity: 31, userId },
                { productName: 'Super Hoodies', quantity: 14, userId },
            ]);
            products = await db.Sale.findAll({ where: { userId }, group: ['productName', 'sale.id'], attributes: ['productName', [db.sequelize.fn('sum', db.sequelize.col('quantity')), 'totalQuantity']], order: [['totalQuantity', 'DESC']], limit: 3 });
        }
        res.send(products);
    });

    // ... (All other routes remain the same)
    app.get('/api/sales', requireLogin, async (req, res) => {
        const sales = await db.Sale.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] });
        res.send(sales);
    });
    app.post('/api/sales', requireLogin, async (req, res) => {
        const sale = await db.Sale.create({ ...req.body, userId: req.user.id });
        res.status(201).send(sale);
    });
    app.put('/api/sales/:id', requireLogin, async (req, res) => {
        await db.Sale.update(req.body, { where: { id: req.params.id, userId: req.user.id } });
        res.status(200).send({ message: 'Sale updated.' });
    });
    app.delete('/api/sales/:id', requireLogin, async (req, res) => {
        await db.Sale.destroy({ where: { id: req.params.id, userId: req.user.id } });
        res.status(200).send({ message: 'Sale deleted.' });
    });
    app.get('/api/transactions/summary', requireLogin, async (req, res) => {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const [income, expense] = await Promise.all([
            db.Transaction.sum('amount', { where: { userId: req.user.id, type: 'income', date: { [Op.gte]: startOfMonth } } }),
            db.Transaction.sum('amount', { where: { userId: req.user.id, type: 'expense', date: { [Op.gte]: startOfMonth } } })
        ]);
        res.send({
            monthlyIncome: income || 0,
            monthlyExpense: expense || 0,
            net: (income || 0) - (expense || 0)
        });
    });
    app.get('/api/transactions', requireLogin, async (req, res) => {
        const transactions = await db.Transaction.findAll({ where: { userId: req.user.id }, order: [['date', 'DESC']] });
        res.send(transactions);
    });
    app.post('/api/transactions', requireLogin, async (req, res) => {
        const transaction = await db.Transaction.create({ ...req.body, userId: req.user.id });
        res.status(201).send(transaction);
    });
    app.put('/api/transactions/:id', requireLogin, async (req, res) => {
        await db.Transaction.update(req.body, { where: { id: req.params.id, userId: req.user.id } });
        res.status(200).send({ message: 'Transaction updated.' });
    });
    app.delete('/api/transactions/:id', requireLogin, async (req, res) => {
        await db.Transaction.destroy({ where: { id: req.params.id, userId: req.user.id } });
        res.status(200).send({ message: 'Transaction deleted.' });
    });
    app.get('/api/profile', requireLogin, (req, res) => res.send(req.user));
    app.post('/api/profile', requireLogin, async (req, res) => {
        const { displayName, email } = req.body;
        await db.User.update({ displayName, email }, { where: { id: req.user.id } });
        const updatedUser = await db.User.findByPk(req.user.id);
        res.send(updatedUser);
    });
    app.get('/api/schedules', requireLogin, async (req, res) => {
        const schedules = await db.Schedule.findAll({ where: { userId: req.user.id } });
        res.send(schedules);
    });
    app.post('/api/schedules', requireLogin, async (req, res) => {
        const schedule = await db.Schedule.create({ ...req.body, userId: req.user.id });
        res.status(201).send(schedule);
    });
    app.get('/api/users', requireLogin, async (req, res) => {
        const profiles = await db.Profile.findAll({ where: { userId: req.user.id } });
        res.send(profiles);
    });
    app.post('/api/profiles', requireLogin, async (req, res) => {
        const profile = await db.Profile.create({ ...req.body, userId: req.user.id });
        res.status(201).send(profile);
    });
};
