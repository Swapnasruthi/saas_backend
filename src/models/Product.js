const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
},
  description: {
    type: String
  },
  image: {
    
    type: String,
  },
  features: {
    type: [String],
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
}
});

module.exports = mongoose.model('Product', ProductSchema);
