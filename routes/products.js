const express = require("express");
const mongoose = require("mongoose");
// const passport = require('passport');

const Product = require("../models/products");
const router = express.Router();

/* ===============USE PASSPORT AUTH JWT ============= */
// router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

/* ========== GET/READ ALL ITEMS ========== */

// router.get("/", (req, res, next) => {
  // const { searchTerm } = req.query;
  // let filter = {};

  // if (searchTerm) {
  //   filter.productNumber = searchTerm;
  // }
router.get("/", async (req,res) => {
  try {
    const products =  await Product.find({});
    return res.status(200).json(products); 
  } catch(err) {
      return err;
    };
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get("/:id", (req, res, next) => {
  console.log("***req.params.id: ", req.params.id);
  const id = req.params.id;
  Product.findOne({ _id: id })
    .then((result) => {
      console.log("***DA RESULT IS: ", result);
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
  const { title, description, image, price, availableSizes } = req.body;
  console.log("req.body: ", req.body);

  /***** Never trust users - validate input *****/
  if (!req.body.title) {
    const err = new Error("Missing `title` in request body");
    err.status = 400;
    return next(err);
  }

  if (!req.body.description) {
    const err = new Error("Missing `description` in request body");
    err.status = 400;
    return next(err);
  }

  if (!req.body.image) {
    const err = new Error("Missing `image` in request body");
    err.status = 400;
    return next(err);
  }

  if (!req.body.price) {
    const err = new Error("Missing `price` in request body");
    err.status = 400;
    return next(err);
  }

  if (!req.body.availableSizes) {
    const err = new Error("Missing `availableSizes` in request body");
    err.status = 400;
    return next(err);
  }

  const newProduct = { title, description, image, price, availableSizes };

  Product.create(newProduct)
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
  const updateProduct = {};
  const updateFields = ["title", "description", "image", "price", "availableSizes"];
  console.log("req.body: ", req.body);
  updateFields.forEach((field) => {
    if (field in req.body) {
      updateProduct[field] = req.body[field];
    }
  });
  console.log("updateProduct: ", updateProduct);

  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   const err = new Error('The `id` is not valid');
  //   err.status = 400;
  //   return next(err);
  // }
  Product.findByIdAndUpdate({ _id: id }, updateProduct, {
    $push: { product: updateProduct },
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
  Product.findOneAndDelete({ _id: id })
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
