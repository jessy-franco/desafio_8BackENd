import {Router} from "express";

const router = Router();

let USERS = [];

router.get("/",(req, res)=>{
    res.status(200).send(USERS)
});

router.post("/", (req, res)=>{

    let body = res.body;
    USERS.push(body.user);
    res.status(201).send({status:201})
})




export default router