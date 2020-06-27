const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  date: { type: Date},
  status : {type: Number, default: 0},
  destination : {
    recipient : {type: String, default: ''},
    recipientPhone :  {type: String, default: ''},  
    businessName :  {type: String, default: ''},
    streetAddress :  {type: String, default: ''},
    city: {type: String, default: ''},
    state: {type: String, default: ''},
    zipcode: {type: String, default: ''},
    geocode: {
      type: { type: String },
      coordinates: []
    },
    instructions:{type: String, default: ''}
  },
  vendor: { type: mongoose.Schema.Types.Object, ref: 'Vendor' },
  pickup: { type: mongoose.Schema.Types.Object, ref: 'Pickup' },
  delivery: { type: mongoose.Schema.Types.Object, ref: 'Delivery' }
});

deliverySchema.methods.serialize = function() {
  return {
    date: this.date || '',
    status: this.status || '',
    destination: this.destination|| '',
    vendor: this.vendor || {},
    pickup: this.pickup || {},
    delivery: this.delivery || {}                                      
  };
};

deliverySchema.set('timestamps', true);

// Customize output for `res.json(data)`, `console.log(data)` etc.
deliverySchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`,
    delete ret.__v; // delete `__v`
  }
});
module.exports = mongoose.model('Order', deliverySchema);
