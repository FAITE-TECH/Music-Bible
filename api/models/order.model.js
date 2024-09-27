
import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type:String,
        required : true,
    },
    musicId: [{
        musicId: { type: String, required: true },
        title: { type: String, required: true },
        image: { type: String, required: true }, 
    }],
    
    email:{
        type:String,  
        lowercase:true, 
    },
    phone:{
        type:Number,
        required:true,
    },  
    totalcost:{
       type: Number,
       required:true,
    },
  
    }, {timestamps: true}

);

const Order = mongoose.model('Order',orderSchema);

export default Order;