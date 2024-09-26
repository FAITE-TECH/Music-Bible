
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
        title: { type: String, required: true },
        image: { type: String, required: true }, 
    }],
    first_name:{
        type:String,
        required:true,
    },
    last_name:{
        type:String,
        required:true,
    },
    email:{
        type:String,  
        lowercase:true, 
    },
    phone:{
        type:Number,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    zip:{
        type:Number,
        required:true,
    },
    subtotal:{
        type: Number,
        default:0.00,
    },
    
    totalcost:{
       type: Number,
       required:true,
    },
    }, {timestamps: true}

);

const Order = mongoose.model('Order',orderSchema);

export default Order;