const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const path = require('path');
const Product = require('./models/product.js');

const port = 8080;
const MONGO_URL = 'mongodb://127.0.0.1:27017/onlinemarketplace';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

main()
    .then(() => {
        console.log('Connected to DB');
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get('/', (req, res) => {
    res.send('Home');
});
app.get('/products', async (req, res) => {
    const allProducts = await Product.find({});
    res.render('listings/index.ejs', {allProducts});
});
app.get('/products/new', async(req, res) => {
    res.render('listings/new.ejs');
});
app.post('/products', async(req, res) => {
    let listing = req.body.listing;
    const newListing = new Product(listing);
    // console.log(newListing);
    await newListing.save();
    res.redirect('/products');
});

app.get("/products/:id", async (req, res) => {
    let {id} = req.params;
    const listing = await Product.findById(id);
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
});

app.get('/products/:id/edit', async (req, res) => {
    let {id} = req.params;
    let listing = await Product.findById(id);
    res.render('listings/edit.ejs', {listing});
})
app.put('/products/:id', async (req, res) => {
    let {id} = req.params;
    await Product.findByIdAndUpdate(id, {...req.body.listing});    //destruct and create new listing
    res.redirect(`/products/${id}`);
});

app.delete('/products/:id', async (req, res) => {
    let {id} = req.params;
    // console.log(id);
    await Product.findByIdAndDelete(id);
    res.redirect('/products');
});
// app.get('/products/:id', async(req, res) => {
//     res.render('listings/new.ejs');
// })

app.listen(port, () => {
    console.log(`app is listening on port ${port}`);
});