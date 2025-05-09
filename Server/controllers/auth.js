import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE, REGISTERATION_TEMPLATE } from '../config/emailTemplate.js';


export const register = async (req, res) =>{
    // axios.defaults.withCredentials = true;

    const {name, email, password} = req.body;
    const { JsonWebTokenError } = jwt;

    if(!name || !email || !password){
        return res.json({success: false, message: 'missing Details'})
    }

    try{

        const existinguser = await userModel.findOne({email});

        if(existinguser){
            return res.json({success: false, message: 'user already exists'})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({name, email, password: hashedPassword});
        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly : true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', 
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        
         // Sending email
         const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: `Welcome ${name}`,
            // text: `Welcome to Priyank company your account email id: ${email} and password is: ${password}`
            html: REGISTERATION_TEMPLATE.replace("{{email}}",user.email)
        }
        
        await transporter.sendMail(mailOptions);     

        return res.json({success: true, message: "user registered successfully"});

    }catch(error){
        res.json({success: false, message: error.message})
    }
}

export const login = async (req, res) =>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.json({success: false, message: 'Missing Credentials'})
    }

    try{
        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success: false, message: "Invalid email"}) 
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.json({success: false, message: "Invalid Password"})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        

        res.cookie('token', token, {
            httpOnly : true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', 
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        
       return res.json({success: true, message: "login successfull"});
    

    }catch(error){
        return res.json({success: false, message: error.message})
    }
}

export const logout = async (req, res) =>{
    try{

        res.clearCookie('token', {
            httpOnly : true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', 
        })

        return res.json({success: true, message: 'Logged out successfully'})
    }catch(error){
        return res.json({success: false, message: error.message})
    }
}

// Send verify otp mail 
export const sendVerifyOtp = async (req,res) =>{
    try{
        const userId = req.userId;

        const user = await userModel.findById(userId);

        if(user.isAccountVerified){
            return res.json({success: false, message: "account already verified"})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: `Account verification Otp`,
            // text: `Your Otp is ${otp}.`
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}",user.email)
        }

        await transporter.sendMail(mailOptions);

        res.json({success: true, message: 'Otp sent to your email'});

    }catch(error){
        res.json({success: false, message: error.message})
    }
}

export const verifyEmail = async(req, res) =>{
    const userId = req.userId;
    const {otp} = req.body;
    if(!userId || !otp){
        return res.json({success: false, message: 'missing details'})
    }

    try{
        const user = await userModel.findById(userId);

        if(!user){
            return res.json({success: false, message: 'User not found!'})
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({success: false, message: 'Invalid Otp'})
        }

        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success: false, message: 'Otp Expired'})
        }

        user.isAccountVerified = true;

        user.verifyOtp = '';

        user.verifyOtpExpireAt = 0;

        user.save();

        return res.json({success: true, message: 'Email verified successfully'});

    }catch(error){
        res.json({success: false, message: error.message})
    }
    
}

export const isAuthenticated = async (req, res) =>{

    try{
    
        return res.json({success: true})

    }catch(error){
        res.json({success: false, message: error.message})
    }
}

export const sendResetOtp = async (req, res) =>{
    const {email} = req.body;

    if(!email){
        return res.json({success: false, message:"email is required"})
    }

    try{
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success: false, message: 'User not found!'})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: `Reset password Otp`,
            // text: `Your Otp is ${otp}.`
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }

        await transporter.sendMail(mailOptions);

        res.json({success: true, message: 'Otp sent to your email'});

    }catch(error){
        res.json({success: false, message: error.message})
    }
}

//Reset password

export const resetPassword = async (req, res) =>{
    const {email, otp, newPassword} = req.body;

    if(!email || !otp || !newPassword){
        return res.json({success: false, message:"email, otp, newPassword are required"})
    }

    try{
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success: false, message: 'User not found!'})
        }
        if(user.resetOtp === '' || user.resetOtp !== otp){
            return res.json({success: false, message: 'Invalid otp for password reset'})
        }
        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success: false, message: 'Otp Expired'})
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        res.json({success: true, message: 'Password is reset'});
    }catch(error){
        res.json({success: false, message: error.message})
    }

}