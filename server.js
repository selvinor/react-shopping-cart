const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Product = require('./models/products');
// const Order = require('./models/orders');
const orderRouter = require('./routes/orders');

const { PORT, CLIENT_ORIGIN, MONGODB_URL } = require('./config');

// const data = require ("./build/data.json");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(__dirname + "/build"));
app.get("/", (req, res) => res.sendFile(__dirname + "/build/index.html"));
mongoose.connect(
  MONGODB_URL,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
);

app.get("/api/products", async (req, res) => {
  const products = await Product.find({});
  res.send(products);
});

app.post("/api/products", async (req, res) => {
  const newProduct = new Product(req.body);
  const savedProduct = await newProduct.save();
  res.send(savedProduct);
});

app.delete("/api/products/:id", async (req, res) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  res.send(deletedProduct);
});

app.use('/api/orders', orderRouter);
// app.post("/api/orders", async (req, res) => {
//   if (
//     !req.body.name ||
//     !req.body.email ||
//     !req.body.address ||
//     !req.body.total ||
//     !req.body.cartItems
//   ) {
//     return res.send({ message: "Data is required." });
//   }
//   const order = await Order(req.body).save();
//   res
//   .location(`${req.originalUrl}/${order._id}`)
//   .status(201)
//   .send(order);
// });
// app.get("/api/orders", async (req, res) => {
//   const orders = await Order.find({});
//   res.send(orders);
// });
// app.get("/api/orders/:id", async (req, res) => {
//   const orders = await Order.findById(req.params.id);
//   res.send(orders);
// });
// app.delete("/api/orders/:id", async (req, res) => {
//   const order = await Order.findByIdAndDelete(req.params.id);
//   res.send(order);
// });
const port = PORT;
app.listen(port, () => console.log("server at ", port));

module.exports = app;