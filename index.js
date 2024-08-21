require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose")
const app = express();
const userRoute = require("./routes/userRoutes")

app.use(express.json());
app.use("/api/user", userRoute);

app.get("/", (req, res) => {
    console.log("Hello World");
});

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connected to Database!");
    app.listen(process.env.PORT, () => {
        console.log(`Server is listening to ${process.env.PORT}`);
    });
}).catch((err) => {
    console.log("Connection Failed", err);
});