import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },

    albumName: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default: 'https://i0.wp.com/woodwoon.com/wp-content/uploads/2023/01/SOS0002-sofa-set-sofa-design-furniture-store-in-pakistan.webp?fit=1024%2C787&ssl=1',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

   
  },
  { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);

export default Category;
