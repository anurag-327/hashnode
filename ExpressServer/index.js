const express=require('express');
const app=express();

app.get("/",(req,res) =>
{
    return res.status(200).json("Server Running Successfully");
})

app.listen(5000, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", 5000);
 });