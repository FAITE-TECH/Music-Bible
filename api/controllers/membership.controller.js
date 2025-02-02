import Membership from "../models/membership.model.js";
import { membershipAcceptedEmail, membershipRejectedEmail } from "../utils/emailTemplates.js";
import { errorHandler } from "../utils/error.js";
import { sendEmail } from "../utils/sendEmail.js";

export const createMembership = async (req, res, next) => {
    try {
        
        const { name, email, address, mobile, country, city, subscriptionPeriod } = req.body;
        console.log(name)
        console.log(email)
        console.log(address)
        console.log(mobile)
        console.log(country)
        console.log(city)
        console.log(subscriptionPeriod)

        
        if (!name || !email || !address || !mobile || !country || !city || !subscriptionPeriod) {
            return next(errorHandler(400, 'Please provide all required fields'));
        }

     
        const newMembership = new Membership({
            name,
            email,
            address,
            mobile,
            country,            
            city,               
            subscriptionPeriod,
       
        });

        // Save the new membership to the database
        const savedMembership = await newMembership.save();

        // Respond with the created membership data
        res.status(201).json({
            success: true,
            message: 'Membership created successfully',
            data: savedMembership,
        });
    } catch (error) {
        next(error); 
    }
};

export const getAllMembership = async (req, res, next) => {
    try {
      const { searchTerm = '' } = req.query;
      const query = searchTerm ? { name: { $regex: searchTerm, $options: 'i' } } : {};
  
     
      const totalMembership = await Membership.countDocuments(query);
  
   
      const firstDayLastMonth = new Date();
      firstDayLastMonth.setDate(1);
      firstDayLastMonth.setMonth(firstDayLastMonth.getMonth() - 1);
      firstDayLastMonth.setHours(0, 0, 0, 0);
      
      const lastDayLastMonth = new Date();
      lastDayLastMonth.setDate(0); 
      lastDayLastMonth.setHours(23, 59, 59, 999);
  
      
      const lastMonthMembership = await Membership.countDocuments({
        ...query,
        updatedAt: { $gte: firstDayLastMonth, $lte: lastDayLastMonth }
      });
  
      const membership = await Membership.find(query);
  
      res.status(200).json({
        membership,
        totalMembership,
        lastMonthMembership,
      });
    } catch (error) {
      next(error);
    }
  };

  // In membership.controller.js
  export const acceptMembership = async (req, res, next) => {
    try {
        const { membershipId } = req.params;
        const updatedMembership = await Membership.findByIdAndUpdate(membershipId, { isMember: true }, { new: true });

        if (!updatedMembership) {
            return next({ status: 404, message: 'Membership not found' });
        }

        
        const emailContent = membershipAcceptedEmail(updatedMembership.name);
        await sendEmail(updatedMembership.email, 'Welcome to amusic Bible!', 'Your membership has been accepted.', emailContent);

        res.status(200).json({
            success: true,
            message: 'Membership accepted successfully, email sent.',
            data: updatedMembership,
        });
    } catch (error) {
        next(error);
    }
};

export const rejectMembership = async (req, res, next) => {
    try {
        const { membershipId } = req.params;
        const deletedMembership = await Membership.findByIdAndDelete(membershipId);

        if (!deletedMembership) {
            return next({ status: 404, message: 'Membership not found' });
        }

        // Send rejection email
        const emailContent = membershipRejectedEmail(deletedMembership.name);
        await sendEmail(deletedMembership.email, 'Membership Rejection Notice', 'Your membership request has been rejected.', emailContent);

        res.status(200).json({
            success: true,
            message: 'Membership rejected successfully, email sent.',
        });
    } catch (error) {
        next(error);
    }
};