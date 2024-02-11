import express from 'express'

const router = express.Router()

router.get('/chat',async (req,res) => {
    try{
        res.render('chat', {
            styles: chat.css, 
        }) 
    }
    catch(error){
        console.log("El chat esta obsoleto:", error);
        res.status(500).send("Error interno del servidor chat Manager");

    }
})

export default router