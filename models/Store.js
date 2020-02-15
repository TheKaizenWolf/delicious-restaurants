const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const slug = require('slugs');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name!',
  },
  slug: String,
  description: {
    type: String,
    trim: true,
  },
  tags: [String],
});

storeSchema.pre('save', function(next) {
  if (!this.isModified('name')) {
    next(); // skip this
    return; // don't run the function
  }
  this.slug = slug(this.name);
  next();
  // TODO work on unique slugs
});

module.exports = mongoose.model('Store', storeSchema);
