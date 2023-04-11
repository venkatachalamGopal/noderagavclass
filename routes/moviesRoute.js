import express from "express";
const app=express();
const router=express.Router();
import{ client }from "../index.js"
import {auth} from "../middleware/auth.js"



// 2.Get call - All movies Data,,,,,,
router.get("",async (req,res)=>{
    const movies=await client.db("B32WE").collection("movies").find({}).toArray();
    res.send(movies)

    // const dbmovies=await client.db("B32WE").collection("movies").find({});
    // res.send(dbmovies)
})


router.get('/:id',async (req,res)=>{
    // console.log(req.params);
    const{id}=req.params;
    const dbMovie=await client.db("B32WE").collection("movies").findOne({id:id});
    dbMovie?res.send(dbMovie):res.send("No such movie Found")

    // const movie=movies.find((obj=>obj.id==id));
    // movie?res.send(movie):res.status(404).send("No such Movies Found ?")
})

router.post("",async (req,res)=>{
    // console.log(req.body);
    const data=req.body;
    // DB queries
    const dbData=await client.db("B32WE").collection("movies").insertMany(data);
    res.send(dbData)
    // async need to Add in Arrow function Melaaa
    // res.send(data)
})

router.put("/:id",async(req,res)=>{
    const{id}=req.params;
    const data=req.body;
    const edited_Data=await client.db("B32WE").collection("movies").updateOne({id:id},{$set:data})
    res.send(edited_Data)
})

router.delete("/:id",async(req,res)=>{
    const {id}=req.params;
   const delData=await client.db("B32WE").collection("movies").deleteOne({id:id});
//    check Here where object is or Not
   delData.deletedCount>0?res.send(delData):res.send("No Movie Found");
})

export const moviesRouters=router;