const { TEST_DATABASE_URL } = require("../config");
// const { TEST_DATABASE_URL, JWT_SECRET  } = require('../config');
const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
// const jwt = require('jsonwebtoken');

// const User = require('../models/users');

const Order = require("../models/orders");
const Product = require("../models/products");

// const seedUsers = require('../db/seed/users.json');
const seedOrders = require("../db/seed/orders.json");
const seedProducts = require("../db/seed/products.json");

const app = require("../server");

chai.use(chaiHttp);
const expect = chai.expect;

describe("Orders API", function () {
  before(function () {
    return mongoose
      .connect(TEST_DATABASE_URL)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function () {
    return Promise.all([
      // User.insertMany(seedUsers),
      // User.createIndexes(),

      Order.insertMany(seedOrders),
      Order.createIndexes(),

      Product.insertMany(seedProducts),
      Product.createIndexes(),
    ]);
    // .then(([users]) => {
    //   user = users[0];
    //   token = jwt.sign({ user }, JWT_SECRET, { subject: user.username });
    // });
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe("GET /api/orders", function () {
    it("should return a list of Orders with the correct fields", function () {
      const dbPromise = Order.find();

      const apiPromise = chai.request(app).get("/api/orders");
      // .set("Authorization", `Bearer ${token}`);

      return Promise.all([dbPromise, apiPromise]).then(([data, res]) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a("array");
        expect(res.body).to.have.length(data.length);
        res.body.forEach(function (item, i) {
          expect(item).to.be.a("object");
          expect(item).to.include.all.keys(
            "_id",
            "name",
            "email",
            "address",
            "total",
            "cartItems",
            "createdAt",
            "updatedAt"
          );
          expect(item._id).to.equal(data[i]._id);
          expect(item.name).to.equal(data[i].name);
          expect(item.email).to.equal(data[i].email);
          expect(item.address).to.equal(data[i].address);
          expect(item.total).to.equal(data[i].total);
          // expect(item.cartItems).to.equal(data[i].cartItems);
          expect(new Date(item.createdAt)).to.eql(data[i].createdAt);
          expect(new Date(item.updatedAt)).to.eql(data[i].updatedAt);
        });
      });
    });
  });

  describe("GET /api/orders/:id", function () {
    it("should return correct orders", function () {
      let data;
      return Order.findOne()
        .then((_data) => {
          data = _data;
          return chai.request(app).get(`/api/orders/${data.id}`);
          // .set("Authorization", `Bearer ${token}`);
        })
        .then((res) => {
          const item = res.body;
          expect(item).to.be.a("object");
          expect(item).to.include.all.keys(
            "_id",
            "name",
            "email",
            "address",
            "total",
            "cartItems",
            "createdAt",
            "updatedAt"
          );
          expect(item._id).to.equal(data._id);
          expect(item.name).to.equal(data.name);
          expect(item.email).to.equal(data.email);
          expect(item.address).to.equal(data.address);
          expect(item.total).to.equal(data.total);
          // expect(item.cartItems).to.equal(data.cartItems);
          expect(new Date(item.createdAt)).to.eql(data.createdAt);
          expect(new Date(item.updatedAt)).to.eql(data.updatedAt);
        });
    });
  });

  describe("GET /api/orders/:id", function () {
    it("should respond with status 400 and an error message when `id` is not valid", function () {
      let data;
      return Order.findOne().then((_data) => {
        data = _data;
        return (
          chai
            .request(app)
            .get("/api/orders/NOT-A-VALID-ID")
            // .get('/api/orders/NOT-A-VALID-ID').set('Authorization', `Bearer ${token}`)
            .then((res) => {
              // console.log('Chai res.body:', res);
              expect(res).to.have.status(400);
              expect(res.body.message).to.equal("The `id` is not valid");
            })
        );
      });
    });
  });

  describe("POST /api/orders", function () {
    it("should create and return a new order when provided valid data", function () {
      const newItem = {
        name: "TestUser",
        email: "email@email.com",
        address: "123 Maple St.",
        cartItems: [
          { _id: 'flower2', title: 'Summer Breeze', price: 35, count: 1 }, 
          { _id: 'flower4', title: 'Pretty in Pink', price: 30, count: 1 },
          { _id: 'flower3', title: 'Amour', price: 50, count: 1 }
        ],
        total: 35
      };
      let res;
      return (
        chai
          .request(app)
          .post("/api/orders")
          // .set("Authorization", `Bearer ${token}`)
          .send(newItem)
          .then(function (_res) {
            res = _res;
            expect(res).to.have.status(201);
            expect(res).to.have.header("location");
            expect(res).to.be.json;
            expect(res.body).to.be.a("object");
            expect(res.body).to.have.all.keys(
              "_id",
              "name",
              "email",
              "address",
              "total",
              "cartItems",
              "createdAt",
              "updatedAt",
              "__v"
            );
            return Order.findById(res.body._id);
          })
          .then((data) => {
            // console.log('POST data.cartItems: ', data.cartItems);
            // console.log('newItem.cartItems: ', newItem.cartItems);
            // console.log(true ? newItem.cartItems.toString === data.cartItems.toString : false);
            expect(newItem.name).to.equal(data.name);
            expect(newItem.email).to.equal(data.email);
            expect(newItem.address).to.equal(data.address);
            expect(newItem.total).to.equal(data.total);
            expect(newItem.cartItems.toString).to.equal(data.cartItems.toString);
          })
      );
    });
  });
});
