import Contact from "../models/contact.model.js";
import { contactSubmissionEmail } from "../utils/emailTemplates.js";
import { errorHandler } from "../utils/error.js";
import { sendEmail } from "../utils/sendEmail.js";

// Create a new contact form submission
export const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

   
    if (!name || !email || !message) {
      return next(errorHandler(400, 'Please provide all required fields'));
    }

    // Create a new contact document
    const newContact = new Contact({
      name,
      email,
      message, 
    });

    // Save the new contact to the database
    const savedContact = await newContact.save();
 
    // Send confirmation email
    const emailContent = contactSubmissionEmail(name, message);
    await sendEmail(email, 'Thank you for contacting us!', 'We have received your message.', emailContent);

    // Respond with the created contact data
    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: savedContact,
    });
  } catch (error) {
    next(error);
  }
};

// Get all contact form submissions
// Get all contact form submissions
export const getAllContacts = async (req, res, next) => {
    try {
        const { searchTerm = '', page = 1, limit = 10 } = req.query;

        const query = searchTerm ? { name: { $regex: searchTerm, $options: 'i' } } : {};

        // Total contact count
        const totalContacts = await Contact.countDocuments(query);
        const totalPages = Math.ceil(totalContacts / limit);

        // Skip and limit for pagination
        const contacts = await Contact.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Respond with contacts, total pages, and total count
        res.status(200).json({
            messages: contacts,
            totalPages,
            totalContacts,  // Changed this to totalContacts
        });
    } catch (error) {
        next(error);
    }
};

  


