require('dotenv').config(); 
const mongoose = require('mongoose');
const User = require("./models/user.model")
const bcrypt = require('bcrypt');

const adminDetails = {
  fullname: 'Admin User',
  username: 'admin',
  email: 'admin@gmail.com',
  contactNumber: '1234567890',
  password: '123456789', 
  role: 'admin', 
};

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(adminDetails.password, 10);
    adminDetails.password = hashedPassword;

    const newAdmin = new User(adminDetails);
    await newAdmin.save();

    console.log('Admin account created successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating admin account:', error.message);
    mongoose.connection.close();
  }
};

createAdmin();
