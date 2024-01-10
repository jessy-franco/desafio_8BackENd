import express from "express";

const app = express(); 

app.get("/saludo", (req, res)=>
{
    res.send("hola a todos desde express")
});

app.listen(8080, ()=> console.log ("servidor 8080!"));  