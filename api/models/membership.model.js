import mongoose from 'mongoose';

const MembershipSchema = new mongoose.Schema({
    name: {
         type: String,
          required: true 
        },
    email: {
         type: String, 
         required: true
         },
    address: {
         type: String, 
         required: true 
        },
    mobile: { 
        type: String,
        required: true 
    },
    country: {
         type: String,
          required: true 
        }, 
    city: { 
        type: String, 
        required: true 
    },    
    subscriptionPeriod: { 
        type: String,
         required: true
    },
    isMember: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const Membership = mongoose.model('Membership', MembershipSchema);
export default Membership;
