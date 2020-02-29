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
  created: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: [
      {
        type: Number,
        required: 'You must supply coordinates!',
      },
    ],
    address: {
      type: String,
      required: 'You must supply an address',
    },
  },
  photo: String,
});

storeSchema.pre('save', async function(next) {
  if (!this.isModified('name')) {
    next(); // skip this
    return; // don't run the function
  }
  this.slug = slug(this.name);

  const slugRegExp = new RegExp(`^(${this.slug})((-[0-9]*$)?)`, 'i');

  const storesWithSlug = await this.constructor.find({ slug: slugRegExp });
  if (storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
  }
  next();
  // TODO work on unique slugs
});

module.exports = mongoose.model('Store', storeSchema);
