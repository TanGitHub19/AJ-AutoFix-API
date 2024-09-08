
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const authRoute = require("./routes/authRoutes");
const userRoute = require("./routes/userRoutes");
const bookingRoute = require("./routes/bookingRoutes");
const reviewsRoute = require("./routes/reviewsRoute");
const contactRoutes = require('./routes/contactRoutes');

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/reviews", reviewsRoute);
app.use("/api/contacts", contactRoutes);

app.get("/", (req, res) => {
    res.redirect("/api/");
});

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Connected to Database!");
    app.listen(process.env.PORT, () => {
        console.log(`Server is listening to ${process.env.PORT}`);
    });
}).catch((err) => {
    console.log("Connection Failed", err);
});
