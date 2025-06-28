import mongoose from 'mongoose';

const musicSchema = new mongoose.Schema(
  {
   
     title: {
      type: String,
      required: true,
     
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: 'https://i0.wp.com/woodwoon.com/wp-content/uploads/2023/01/SOS0002-sofa-set-sofa-design-furniture-store-in-pakistan.webp?fit=1024%2C787&ssl=1',
      required: true,
    },

    mainImage: {
      type: String,
    },

    category: {
      type: String,
      default: 'uncategorized',
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      default: function() {
        // Default function that will be overridden by pre-save if title exists
        return 'temp-slug-' + Math.random().toString(36).substring(2, 8);
      }
    },

   /* price: {
      type: Number,
      required: true,
    },*/

   /* isFeature: {
      type: Boolean,
      default: false,
    },*/

    music: {
      type: String, // Storing the file path or URL
      required: true,
    },
    favoriteCount: {
      type: Number,
      default: 0
    },
    favoritedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  { 
    timestamps: true,
    collation: { locale: 'en', strength: 2 }
  }
);

// handle slug generation
musicSchema.pre('save', async function(next) {
  // Only generate slug if title is modified or document is new
  if (this.isModified('title') || this.isNew) {
    try {
      let slug = this.title
        .split(' ')
        .join('-')
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, '');
      
      // If slug is empty after processing
      if (!slug) {
        slug = 'music-' + Math.random().toString(36).substring(2, 8);
      }
      
      // Check for existing documents with same slug
      let counter = 1;
      const originalSlug = slug;
      while (await this.constructor.findOne({ slug, _id: { $ne: this._id } })) {
        slug = `${originalSlug}-${counter}`;
        counter++;
      }
      
      this.slug = slug;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

const Music = mongoose.model('Music', musicSchema);

export default Music;
