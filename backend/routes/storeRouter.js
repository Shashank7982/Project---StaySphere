// EXTERNAL MODULES
const express = require('express');
const storeRouter = express.Router();
//LOCAL MODULES
const storeController = require('../controllers/storeController');

storeRouter.get("/", storeController.getIndex);
storeRouter.get("/homes", storeController.getHomes);
storeRouter.get("/search", storeController.searchHomes);
storeRouter.get("/bookings", storeController.getBookings);
storeRouter.get("/favourites", storeController.getFavouriteList);
storeRouter.get("/homes/:homeId", storeController.getHomeDetails);
storeRouter.get("/rulesPdf/:homeId", storeController.getRulesPdf);
storeRouter.post("/favourites", storeController.AddToFavourites);
storeRouter.post("/favourites/delete/:homeId", storeController.DeleteFromFavourites);
storeRouter.post("/bookings", storeController.postBooking);

exports.storeRouter = storeRouter;