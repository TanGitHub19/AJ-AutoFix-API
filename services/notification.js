const axios = require("axios");

const notification = async (message, userId) => {
  try {
    const response = await axios.post(
      "https://onesignal.com/api/v1/notifications",
      {
        app_id: "7adf71e0-29d4-45cc-be81-e3fd7d04a32d", 
        include_external_user_ids: userId, 
        contents: { en: message }, 
      },
      {
        headers: { 
          Authorization: "NDg5YzRiNmMtNWIxMC00ZDAwLTk1YTItZjRiOGM0MWZkZjBk", 
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Notification sent:", response.data);
  } catch (error) { 
    console.error("Error sending notification:", error);
  }
};

module.exports = { notification }; 
