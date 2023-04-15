const dotenv=require("dotenv").config();
const express=require("express");
const app=express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const ConnectMongoDb=require("./config/mongoose")

app.use("/auth",require("./routes/auth"));
app.listen(5000,(err) =>
{
    if(err)
    console.log("Error in runing server")
    console.log("Server running at PORT",process.env.PORT)
})