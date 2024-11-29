import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { validatePhoneNumber } from '../utils/phoneValidator.js';

export const signup = async (req, res, next) => {
    const { username, email, password, mobile, address, country, state, city, postalcode } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{5,}$/;

    if (!username || !email || !password || !mobile || !address || !country || !state || !city || !postalcode ||
        username === "" || email === "" || password === "" || mobile === "" || address === "" || country === "" || state === "" || city === "" || postalcode === "") {
        return next(errorHandler(400, 'All fields are required'));
    } else if (!emailRegex.test(email)) {
        return next(errorHandler(400, 'Invalid email format'));
    } else if (!validatePhoneNumber(mobile, country)) {
        return next(errorHandler(400, 'Invalid mobile number format for the given country'));
    } else if (!passwordRegex.test(password)) {
        return next(errorHandler(400, 'Password should be at least 5 characters long and contain at least one uppercase letter, one digit, and one symbol (!@#$%^&*()_+).'));
    } else if (username.length < 7 || username.length > 30) {
        return next(errorHandler(400, 'Username should be between 7 and 30 characters'));
    } else if (password.length < 8) {
        return next(errorHandler(400, 'Password should be at least 8 characters'));
    } 
    
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        mobile,
        address,
        country,
        state,
        city,
        postalcode
    });
        try {
            await newUser.save();
            res.status(201).json({ message: "User created successfully" });
        } catch (error) {
          next(error);
        }
    
};
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }
  
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));
    
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(400, 'Invalid credentials!'));
    
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    const { password: hashedPassword, ...rest } = validUser._doc;
    
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      expires: new Date(Date.now() + 3600000), 
    }).status(200).json(rest);
  } catch (error) {
    next(error);
  }
};


  export const google = async (req, res, next) => {
    try {
     
      const user = await User.findOne({ email: req.body.email });
  
      if (user) {
        
        const token = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin },
          process.env.JWT_SECRET,
          { expiresIn: '1h' } 
        );
        console.log(token);
  
        
        const { password: hashedPassword, ...rest } = user._doc;
  
        
        res.cookie('access_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict', 
          expires: new Date(Date.now() + 3600000),
        }).status(200).json(rest);
      } else {
   
        const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        
        const newUser = new User({
          username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-8),
          email: req.body.email,
          password: hashedPassword,
          profilePicture: req.body.photo,
        });
  
        
        await newUser.save();
  
       
        const token = jwt.sign(
          { id: newUser._id, isAdmin: newUser.isAdmin },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
        console.log(token);
  
        
        const { password: hashedPassword2, ...rest } = newUser._doc;
  
       
        res.cookie('access_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict', 
          expires: new Date(Date.now() + 3600000), 
        }).status(200).json(rest);
      }
    } catch (error) {
      next(error);
    }
  };
  
  
