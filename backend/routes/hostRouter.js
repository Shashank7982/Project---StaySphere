// EXTERNAL MODULES
const express=require('express');
const hostRouter=express.Router();
//LOCAL MODULES
const hostController=require('../controllers/hostController');

hostRouter.get("/addHome",hostController.getAddHome);
hostRouter.get("/editHome/:homeId",hostController.getEditHome);
hostRouter.post("/addHome",hostController.postAddHome);
hostRouter.post("/editHome",hostController.postEditHome);
hostRouter.get("/hostHomeList",hostController.getHostHomes);
hostRouter.post("/deleteHome/:homeId",hostController.postDeleteHome);

exports.hostRouter=hostRouter;


