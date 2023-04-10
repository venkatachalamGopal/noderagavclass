// const express=require('express');
import express from 'express';
const app=express();

// const {MongoClient}=require('mongodb');
import { MongoClient } from 'mongodb';

import dotenv from "dotenv";
dotenv.config()

const PORT=5000;

// Inbuilt Middleware by express
app.use(express.json())

// MongoDB connection.......
const MONGO_URL=process.env.MONGO_URL;

async function createConnection(){
    const client=new MongoClient(MONGO_URL);
           await client.connect();
           console.log("Mongodb Coonnected"); 
           return client;
}
const client= await createConnection();


// 1.Home page Api Get Call method  ....

app.get("",(req,res)=>{
    res.send("Home Page !!!")
})

// 2.Get call - All movies Data,,,,,,
app.get("/movies", async (req,res)=>{
    const movies=await client.db("B32WE").collection("movies").find({}).toArray();
    res.send(movies)

    // const dbmovies=await client.db("B32WE").collection("movies").find({});
    // res.send(dbmovies)
})

// 2.Get call - All movies By Id,,,,,,

app.get('/movies/:id',async (req,res)=>{
    // console.log(req.params);
    const{id}=req.params;
    const dbMovie=await client.db("B32WE").collection("movies").findOne({id:id});
    dbMovie?res.send(dbMovie):res.send("No such movie Found")

    // const movie=movies.find((obj=>obj.id==id));
    // movie?res.send(movie):res.status(404).send("No such Movies Found ?")
})

// POST -call Method API,,,
// Need to use middleware (express.json()) compulsoary

app.post("/movies",async (req,res)=>{
    // console.log(req.body);
    const data=req.body;
    // DB queries
    const dbData=await client.db("B32WE").collection("movies").insertMany(data);
    res.send(dbData)
    // async need to Add in Arrow function Melaaa
    // res.send(data)
})

// DELETE - Movie call

app.delete("/movies/:id",async(req,res)=>{
    const {id}=req.params;
   const delData=await client.db("B32WE").collection("movies").deleteOne({id:id});
//    check Here where object is or Not
   delData.deletedCount>0?res.send(delData):res.send("No Movie Found");
})

// Update Movie By Id.....

app.put("/movies/:id",async(req,res)=>{
    const{id}=req.params;
    const data=req.body;
    const edited_Data=await client.db("B32WE").collection("movies").updateOne({id:id},{$set:data})
    res.send(edited_Data)
})



app.listen(PORT,()=>{
    console.log("App started *****");
})
