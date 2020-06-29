const { TEST_DATABASE_URL } = require("../config");
// const { TEST_DATABASE_URL, JWT_SECRET  } = require('../config');
const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
// const jwt = require('jsonwebtoken');

// const User = require('../models/users');

const Product = require("../models/products");

// const seedUsers = require('../db/seed/users.json');
const seedProducts = require("../db/seed/products.json");

const app = require("../server");

chai.use(chaiHttp);
const expect = chai.expect;

describe("Products API", function () {
  before(function () {
    return mongoose
      .connect(TEST_DATABASE_URL)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function () {
    return Promise.all([
      // User.insertMany(seedUsers),
      // User.createIndexes(),

      Product.insertMany(seedProducts),
      Product.createIndexes(),
    ]);
    // .then(([users]) => {
    //   user = users[0];
    //   token = jwt.sign({ user }, JWT_SECRET, { subject: user.usertitle });
    // });
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe("GET /api/products", function () {
    it("should return a list of Products with the correct fields", function () {
      const dbPromise = Product.find();

      const apiPromise = chai.request(app).get("/api/products");
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
            "title",
            "description",
            "image",
            "price",
            "availableSizes"
          );
          expect(item._id).to.equal(data[i]._id);
          expect(item.title).to.equal(data[i].title);
          expect(item.description).to.equal(data[i].description);
          expect(item.image).to.equal(data[i].image);
          expect(item.price).to.equal(data[i].price);
          expect(item.availableSizes.toString()).to.equal(data[i].availableSizes.toString());
          expect(new Date(item.createdAt)).to.eql(data[i].createdAt);
          expect(new Date(item.updatedAt)).to.eql(data[i].updatedAt);
        });
      });
    });
  });

  describe("GET /api/products/:id", function () {
    it("should return correct products", function () {
      let data;
      return Product.findOne()
        .then((_data) => {
          data = _data;
          return chai.request(app).get(`/api/products/${data.id}`);
          // .set("Authorization", `Bearer ${token}`);
        })
        .then((res) => {
          const item = res.body;
          expect(item).to.be.a("object");
          expect(item).to.include.all.keys(
            "_id",
            "title",
            "description",
            "image",
            "price",
            "availableSizes",
            "createdAt",
            "updatedAt"
          );
          expect(item._id).to.equal(data._id);
          expect(item.title).to.equal(data.title);
          expect(item.description).to.equal(data.description);
          expect(item.image).to.equal(data.image);
          expect(item.price).to.equal(data.price);
          // expect(item.availableSizes).to.equal(data.availableSizes);
          expect(new Date(item.createdAt)).to.eql(data.createdAt);
          expect(new Date(item.updatedAt)).to.eql(data.updatedAt);
        });
    });
  });

  describe("GET /api/products/:id", function () {
    it("should respond with status 400 and an error message when `id` is not valid", function () {
      let data;
      return Product.findOne().then((_data) => {
        data = _data;
        return (
          chai
            .request(app)
            .get("/api/products/NOT-A-VALID-ID")
            // .get('/api/products/NOT-A-VALID-ID').set('Authorization', `Bearer ${token}`)
            .then((res) => {
              // console.log('Chai res.body:', res);
              expect(res).to.have.status(400);
              expect(res.body.message).to.equal("The `id` is not valid");
            })
        );
      });
    });
  });
  
  describe("POST /api/products", function () {
    it("should create and return a new product when provided valid data", function () {
      const newItem = {
        "image": "/images/flower4.jpg",
        "title": "New Model",
        "description": "Flowers full of joy",
        "availableSizes": ["Standard", "Deluxe", "Premium"],
        "price": 55.00
      };
      let res;
      return (
        chai
          .request(app)
          .post("/api/products")
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
              "title",
              "description",
              "image",
              "price",
              "availableSizes",
              "createdAt",
              "updatedAt",
              "__v"
            );
            return Product.findById(res.body._id);
          })
          .then((data) => {
            expect(newItem.title).to.equal(data.title);
            expect(newItem.description).to.equal(data.description);
            expect(newItem.image).to.equal(data.image);
            expect(newItem.price).to.equal(data.price);
            expect(newItem.availableSizes.toString).to.equal(
              data.availableSizes.toString
            );
          })
      );
    });
  });
  describe("PUT api/products", function () {
    it("should update products you send over", function () {
      let updatedProduct = {
        "_id": "flower2",
        "image": "/images/flower2.jpg",
        "title": "Summer Breeze II",
        "description": "Flowers full of summertime happiness/joy",
        "availableSizes": ["Standard", "Deluxe", "Premium"],
        "price": 45.00
      };
  
      let data;
      let _res;
      return Product.findOne()
        .then((_data) => {
          data = _data;
          return chai
            .request(app)
            .put(`/api/products/${data.id}`)
            .send(updatedProduct);
        })
        .then((res) => {
          _res = res;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.keys(
            "_id",
            "title",
            "description",
            "image",
            "price",
            "availableSizes",
            "createdAt",
            "updatedAt"          );
          return Product.findById(data.id);
        })
        .then((data) => {
          expect(updatedProduct.title).to.equal(data.title);
          expect(updatedProduct.description).to.equal(data.description);
          expect(updatedProduct.image).to.equal(data.image);
          expect(updatedProduct.price).to.equal(data.price);
          expect(updatedProduct.availableSizes.toString).to.equal(data.availableSizes.toString);
        });
    });
  });
  describe('DELETE api/products/:id', function() {

    it('should delete a product by id ', function() {
      let data;
      return Product.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app).delete(`/api/products/${data.id}`);
          // return chai.request(app).delete(`/api/products/${data.id}`).set('Authorization', `Bearer ${token}`);
        })
        .then((res) => {
          expect(res).to.have.status(204);
          return Product.find({id : data.id});
        })
        .then(res => {
          expect(res).to.be.a('array');
          expect(res.length).to.equal(0);
          return Product.find({id: data.id});
        })
        .then(res => {
          expect(res).to.be.a('array');
          expect(res.length).to.equal(0);
        });
    });

    it('should respond with a 404 if you attempt to delete a product that does not exist', function () {

      let data;
      return Product.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app).delete(`/api/products/${data.id}`);
          // return chai.request(app).delete(`/api/products/${data.id}`).set('Authorization', `Bearer ${token}`);
        })
        .then((res) => {
          expect(res).to.have.status(204);
          return chai.request(app).delete(`/api/products/${data.id}`);
          // return chai.request(app).delete(`/api/products/${data.id}`).set('Authorization', `Bearer ${token}`);
        })
        .then(res => {
          expect(res.status).to.equal(404);
        });
 
    });
  });

});

