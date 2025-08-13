const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js")

const listingContoller = require("../controllers/listings.js")
const multer  = require('multer')
const {storage} = require("../cloudconfig.js")
const upload = multer({storage})





router.route("/")
.get(wrapAsync(listingContoller.index)) //index route
.post(                                 //create route
    isLoggedIn,
    validateListing,
    upload.single('image'),
    wrapAsync (listingContoller.createListing))
   
    



//New Route
router.get("/new",
    isLoggedIn,
    listingContoller.renderNewForm);



router.route("/:id")
.get(wrapAsync(listingContoller.showListing))     //show route
.put(                                            // update route
    isLoggedIn,
    isOwner,
    upload.single('image'),
    validateListing,
    wrapAsync(listingContoller.updateListing))
.delete(                                           //delte route
    isLoggedIn,
    isOwner,
    wrapAsync(listingContoller.destroyListing))

 //Edit Route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingContoller.renderEditForm));

module.exports = router ;