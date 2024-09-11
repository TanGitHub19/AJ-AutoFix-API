
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/user.model'); 

mongoose.connect('mongodb+srv://admin:aj-autofix@cluster0.cxt0r.mongodb.net/User-api?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

const fixProfilePicturePaths = async () => {
    try {
      const users = await User.find({});
      for (const user of users) {
        if (user.profilePicture) {
          let newPath = user.profilePicture.replace(/\\/g, '/'); 
          newPath = newPath.replace(/\/uploads\/uploads\//g, '/uploads/'); 
          await User.updateOne({ _id: user._id }, { profilePicture: newPath });
        }
      }
      console.log('Profile picture paths updated successfully.');
    } catch (error) {
      console.error('Error updating profile picture paths:', error.message);
    }
  };

fixProfilePicturePaths();
