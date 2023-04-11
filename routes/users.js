import express from "express";
const app=express();
const router=express.Router();
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import {client} from "../index.js"

// Signup Codes .......

async function genHashPassword(password){
    const rounds=10;
    const saltValue=await bcrypt.genSalt(rounds)
    // console.log(saltValue);$2b$10$kdNvWmz3yJgoOf8/Vioai.
    const hashPassword=await bcrypt.hash(password,saltValue)
    // console.log(hashPassword);$2b$10$kdNvWmz3yJgoOf8/Vioai.WAO8c0bp5k4qWJbWq4fhBcUf0HeArFe
    return hashPassword

}

// points 1.genHashed password using Bcrypt
// 2.send username and hashedpassword details to dataBase

async function createuser(data){
    const dbobj=await client.db("B32WE").collection("users").insertOne(data);
    return dbobj;

}

    async function getuserByName(username){
        const result=await client.db("B32WE").collection("users").findOne({username:username})
        return result;
    }

router.post("/signup",async (req,res)=>{
    const {username,password}=req.body;
    const getPassword=await genHashPassword(password);

        const getresult=await getuserByName(username);  
        // if object iruntha error Message or else call createuser function ,,,,
        if(getresult){
            res.status(400).send({msg:"Username Already Exist try another name"})
        }
        else{
            const db_obj=await createuser({
                username:username,
                password:getPassword
            })
            res.send(db_obj)

        }

})
// login Code end ......

router.post("/login",async(req,res)=>{
    const{username,password}=req.body;
    const user_fromDB=await getuserByName(username)
    // console.log(user_fromDB);
    // res.send(user_fromDB)
    if(!user_fromDB){
        res.status(401).send({msg:"Invalid credentials!"})
    }else{
        const dbPassword=user_fromDB.password;
        const ispassword_Match=await bcrypt.compare(password,dbPassword);
        // here ispassword_Match return true or else false- Boolean value 
        if(ispassword_Match){
            // here JWT token generate
            const token=jwt.sign({id:user_fromDB._id},process.env.SECRET_KEY)
            res.send({msg:"Login success",token:token})

        }else{
            res.status(401).send({msg:"Invalid credentials"})
        }
    }
})


export const usersRouter=router;