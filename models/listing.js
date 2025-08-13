

const { ref } = require("joi");
const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
 title :{
 type :String,
 required : true
},
 description :String,
 image : {
    url: String,
    filename: String,
    },
 price : {
type:Number
},
 location : String,
 country : String,
 reviews : [{
   type : Schema.Types.ObjectId,
   ref: "Review",
 }
 ],
 category: {
        type: String,
        enum: ["Trending", "Rooms", "Iconic cities", "Mountain", "Castles", "Amazing pool","Camping"], // sample categories
        default: "Other"
    },
 owner : {
  type : Schema.Types.ObjectId,
  ref: "User",
 }

});

listingSchema.post("findOneAndDelete",async(listing)=>{
      if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
      }
  
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing ;