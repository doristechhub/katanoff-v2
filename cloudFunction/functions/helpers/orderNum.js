const uid = require('uid');

const generateOrderId = async () => {
    return new Promise((resolve, reject) => {
        try {
            // Use the last 7 digits of the current timestamp
            const timestampPart = Date.now().toString().slice(-7);

            // Generate a unique identifier and take the first 6 characters
            const uniqueId = uid.uid().slice(0, 6);

            // Combine both parts to get a 13-digit order number
            const data =  `ORD${timestampPart}${uniqueId}`;
            resolve(data);
        } catch (e) {
             reject(e);
        }
    });
};

module.exports = { generateOrderId };