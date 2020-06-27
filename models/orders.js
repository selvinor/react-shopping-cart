const mongoose = require("mongoose");
const shortid = require("shortid");

const orderSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: shortid.generate,
    },
    email: String,
    name: String,
    address: String,
    total: Number,
    cartItems: [
      {
        _id: String,
        name: String,
        title: String,
        price: Number,
        count: Number,
      },
    ],
  }
);

orderSchema.methods.serialize = function () {
  return {
    email: this.email || "",
    name: this.name || "",
    address: this.address || "",
    total: this.total || 0,
    cartItems: this.cartItems || []
  };
};

orderSchema.set("timestamps", true);

// Customize output for `res.json(data)`, `console.log(data)` etc.
orderSchema.set("toObject", {
  virtuals: true, // include built-in virtual `id`
  versionKey: false, // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`,
    delete ret.__v; // delete `__v`
  },
});
module.exports = mongoose.model("Order", orderSchema);
