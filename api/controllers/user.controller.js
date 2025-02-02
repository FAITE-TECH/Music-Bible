import  jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import { validatePhoneNumber } from "../utils/phoneValidator.js";

export const test = (req, res) => {
  res.json({
    message: 'API is working'
  });
};

const transporter = nodemailer.createTransport({
  service:"gmail",
  auth:{
      user:"projecttest088@gmail.com",
      pass:"vyzl bowj hshd apbo"
  }
}) 

export const updateUser = async (req,res,next) => {
   

    try {
        const { mobile , country} = req.body;
       
      if (req.body.password) {
       
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{5,}$/;
        if (!passwordRegex.test(req.body.password)) {
            return next(errorHandler(400, 'Password should be at least 5 characters long and contain at least one uppercase letter, one digit, and one symbol (!@#$%^&*()_+).'));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
        if (req.body.username) {
            if (req.body.username.length < 7 || req.body.username.length > 20) {
              return next(
                errorHandler(400, 'Username must be between 7 and 20 characters')
              );
            }
         
          }


       const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
            $set : {
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                profilePicture:req.body.profilePicture,
                address:req.body.address,
                mobile:req.body.mobile,
                country:req.body.country,
                state:req.body.state,
                city:req.body.city,
                postalcode:req.body.postalcode,
            }
        },
        {new:true}
       );
       const {password , ...rest} = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }

}
export const deleteUser = async(req,res,next)=>{
 

  try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been Deleted...")
  } catch (error) {
      next(error)
  }
}
export const signout = (req, res, next) => {
  try {
    res.clearCookie('access_token').status(200).json('User has been signed out');
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const searchTerm = req.query.searchTerm || '';

    const usersQuery = User.find({

      $or: [
        { username: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
       
      ]
     
    });

    const users = await usersQuery

      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });


    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ isAdmin: true });
    const totalCustomers = await User.countDocuments({ isAdmin: false });

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    const lastMonthCustomers = await User.countDocuments({
      isAdmin: false ,
      createdAt: { $gte: oneMonthAgo },
    });
    const lastMonthAdmin = await User.countDocuments({
      isAdmin: true ,
      createdAt: { $gte: oneMonthAgo },
    });


    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthCustomers,
      totalAdmins,
      totalCustomers,
      lastMonthAdmin,
      lastMonthUsers

    });
  } catch (error) {
    next(error);
  }
};


export const forgetpassword = async (req, res, next) => {
  const { email } = req.body;
  try {
   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: 401, message: "User not found" });
    }

    
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

  
    user.verifytoken = token;
    
    await user.save();
    

   
    const mailOptions = {
      from: "sanjana.nim2001@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `Use the following link to reset your password: https://amusicbible.com/resetpassword/${user._id}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ status: 500, message: "Email not sent" });
      }
      
      res.status(201).json({ status: 201, message: "Email sent successfully" });
    });
  } catch (error) {
    console.error("Forget password error:", error);
    next(error);
  }
};

export const resetpassword = async (req, res, next) => {
  const { id } = req.params;

  try {
    const validuser = await User.findOne({_id: id});
   
    if (validuser) {
      res.status(201).json({ status: 201, validuser });
    } else {
      res.status(401).json({ status: 401, message: "User does not exist" });
    }
  } catch (error) {
    console.error("Error in resetpassword controller:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

export const updateResetPassword = async (req, res, next) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
      const validuser = await User.findOne({ _id: id});
      

      if (validuser) {
          const newpassword = await bcryptjs.hash(password, 10);

          await User.findByIdAndUpdate(id, { password: newpassword });

          res.status(201).json({ status: 201, message: "Password updated successfully" });
      } else {
          res.status(401).json({ status: 401, message: "User does not exist or invalid token" });
      }
  } catch (error) {
      res.status(500).json({ status: 500, error: error.message });
  }

};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const getAdmins = async (req, res, next) => {
  try {
    
    const admins = await User.find({ isAdmin: true });
    res.status(200).json({ admins });
  } catch (error) {
    console.error("Error in getAdmins controller:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
export const getCustomers = async (req, res, next) => {
  try {
    
    const admins = await User.find({ isAdmin: false });
    res.status(200).json({ admins });
  } catch (error) {
    console.error("Error in getAdmins controller:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
export const assignAdmin = async (req, res, next) =>{
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    user.isAdmin = true;
    await user.save();
    res.status(200).json({ message: 'User assigned admin privileges successfully' });
  } catch (error) {
    next(error);
  }

};
export const resignAdmin = async (req, res, next) =>{

  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    user.isAdmin = false;
    await user.save();
    res.status(200).json({ message: 'User resigned admin privileges successfully' });
  } catch (error) {
    next(error);
  }
  
};