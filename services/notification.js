const axios = require("axios");

const getUserSubscriptionStatus = async (userId) => {
  try {
    const response = await axios.get(
      `https://onesignal.com/api/v1/players/${userId}`,
      {
        headers: {
          Authorization: "Basic NDg5YzRiNmMtNWIxMC00ZDAwLTk1YTItZjRiOGM0MWZkZjBk",
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.is_subscribed; 
  } catch (error) {
    console.error("Error fetching subscription status:", error.message);
    return false; 
  }
};

const notification = async (message, userId) => {
  const isSubscribed = await getUserSubscriptionStatus(userId);

  if (!isSubscribed) {
    console.log(`User ${userId} is not subscribed to notifications.`);
    return; 
  }

  try {
    const response = await axios.post(
      "https://onesignal.com/api/v1/notifications",
      {
        app_id: "7adf71e0-29d4-45cc-be81-e3fd7d04a32d",
        include_external_user_ids: Array.isArray(userId) ? userId : [userId],
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
    console.error("Error sending notification:", error.response ? error.response.data : error.message);
  }
};

module.exports = { notification };
