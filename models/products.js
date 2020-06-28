const mongoose = require('mongoose');
const shortid = require("shortid");

const productSchema = new mongoose.Schema({
  _id: { type: String, default: shortid.generate },
  title: String,
  description: String,
  image: String,
  price: String,
  availableSizes: [String],
});

productSchema.methods.serialize = function() {
  return {
    date: this.date || '',
    status: this.status || '',
    destination: this.destination|| '',
    vendor: this.vendor || {},
    pickup: this.pickup || {},
    delivery: this.delivery || {}                                      
  };
};

productSchema.set('timestamps', true);

// Customize output for `res.json(data)`, `console.log(data)` etc.
productSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`,
    delete ret.__v; // delete `__v`
  }
});
module.exports = mongoose.model('Product', productSchema);
