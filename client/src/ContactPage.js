import React from 'react';

function ContactPage() {
    return (
        <div className="p-8">
            <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-md text-center">
                <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
                <p className="text-gray-600 mb-6">
                    For any questions or support, please reach out to us via email. We'll get back to you as soon as possible.
                </p>
                <a
                    href="mailto:arneshpal000@gmail.com"
                    className="inline-block bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                    arneshpal000@gmail.com
                </a>
            </div>
        </div>
    );
}

export default ContactPage;