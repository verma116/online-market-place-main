const mongoose = require('mongoose');
const Product = require('../models/product.js');
const initData = require('./data');

const MONGO_URL = 'mongodb://127.0.0.1:27017/onlinemarketplace';

main().then(() => {
    console.log('Connected to DB');
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Product.deleteMany({});
    await Product.insertMany(initData.data);
    console.log('DB initialized succcessfully!');
};

initDB();
