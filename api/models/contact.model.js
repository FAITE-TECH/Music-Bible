import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    
    responded: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Contact = mongoose.model('Contact', ContactSchema);
export default Contact;
