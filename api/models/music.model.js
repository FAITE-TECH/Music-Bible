import mongoose from 'mongoose';

const musicSchema = new mongoose.Schema(
  {
   
     title: {
      type: String,
      required: true,
      unique: true,
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
    }
  },
  { timestamps: true }
);

const Music = mongoose.model('Music', musicSchema);

export default Music;
