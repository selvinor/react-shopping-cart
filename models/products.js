const mongoose = require('mongoose');
const shortid = require("shortid");

const productSchema = new mongoose.Schema({
  _id: { type: String, default: shortid.generate },
  title: String,
  description: String,
  image: String,
  price: Number,
  availableSizes: [String],
});

productSchema.methods.serialize = function() {
  return {
    title: this.title || '',
    description: this.description || '',
    image: this.image|| '',
    price: this.price || [],
    availableSizes: this.availableSizes || []                         
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
