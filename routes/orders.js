const express = require("express");
const mongoose = require("mongoose");
// const passport = require('passport');

const Order = require("../models/orders");
const router = express.Router();

/* ===============USE PASSPORT AUTH JWT ============= */
// router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

/* ========== GET/READ ALL ITEMS ========== */

router.get("/", (req, res, next) => {
  const { searchTerm } = req.query;
  let filter = {};

  if (searchTerm) {
    filter.orderNumber = searchTerm;
  }

  Order.find(filter)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      next(err);
    });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  Order.findOne({ _id: id })
    .then((result) => {
      if (result !== null) {
        return res.status(200).json(result);
      } else {
        return (
          res
            .status(400)
            // .json(result)
            .send({ message: "The `id` is not valid" })
        );
      }
    })
    .catch((err) => {
      next(err);
    });
});

/* ========== POST/CREATE AN ITEM ========== */

router.post("/", (req, res, next) => {
  const { name, email, address, total, cartItems } = req.body;
  /***** Never trust users - validate input *****/
  if (!req.body.name) {
    const err = new Error("Missing `name` in request body");
    err.status = 400;
    return next(err);
  }

  if (!req.body.email) {
    const err = new Error("Missing `email` in request body");
    err.status = 400;
    return next(err);
  }

  if (!req.body.address) {
    const err = new Error("Missing `address` in request body");
    err.status = 400;
    return next(err);
  }

  if (!req.body.total) {
    const err = new Error("Missing `total` in request body");
    err.status = 400;
    return next(err);
  }

  if (!req.body.cartItems) {
    const err = new Error("Missing `cartItems` in request body");
    err.status = 400;
    return next(err);
  }

  const newOrder = { name, email, address, total, cartItems };

  Order.create(newOrder)
    .then((result) => {
      res.location(`${req.originalUrl}/${result._id}`).status(201).json(result);
    })
    .catch((err) => {
      next(err);
    });
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put("/:id", (req, res, next) => {
  // const { id } = req.params;
  const id = req.params.id;
  const updateOrder = {};
  const updateFields = ["name", "email", "address", "total", "cartItems"];
  updateFields.forEach((field) => {
    if (field in req.body) {
      updateOrder[field] = req.body[field];
    }
  });

  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   const err = new Error('The `id` is not valid');
  //   err.status = 400;
  //   return next(err);
  // }
  Order.findByIdAndUpdate({ _id: id }, updateOrder, {
    $push: { order: updateOrder },
  })
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch((err) => {
      next(err);
    });
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  Order.findOneAndDelete({ _id: id })
    .then((result) => {
      if (result) {
        res.sendStatus(204);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      next(err);
    });
});
module.exports = router;
