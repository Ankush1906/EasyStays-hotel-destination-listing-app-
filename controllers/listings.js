const Listing = require("../models/listing")


module.exports.index = async (req, res) => {
    let query = req.query.q?.trim();
    let category = req.query.category?.trim(); // NEW: read category from query string
    console.log("Search query:", query); 
    console.log("Category filter:", category); 

    let filter = {};

    // If search query exists
    if (query && query.length > 0) {
        filter.$or = [
            { location: { $regex: query, $options: "i" } },
            { country: { $regex: query, $options: "i" } }
        ];
    }

    // If category filter exists
    if (category && category.length > 0) {
        filter.category = category;
    }

    let allListings = await Listing.find(filter);

    let noResults = allListings.length === 0;

    res.render("listings/index.ejs", {
        allListings,
        noResults,
        q: query || "",
        category: category || ""
    });
};

    module.exports.renderNewForm = (req,res)=>{
    console.log(req.user)
    res.render("listings/new.ejs");
}

    module. exports.showListing =  async(req,res)=>{
     
     let {id} = req.params;
      const listing = await Listing.findById(id)
      .populate({path :"reviews",
        populate :{
        path :"author",
      },
    }).populate("owner");
      if(!listing){
        req.flash("error","Listing you requested for does not Exist!");
        return res.redirect("/listings")
      }
      console.log(listing);
      res.render("listings/show.ejs",{listing})
}


    module.exports.createListing = async(req,res,next)=>{
     // let{title,description,image,price,country,location} = req.body;
     let url = req.file.path;
     let filename = req.file.filename;
     
     const newlisting = new Listing(req.body.Listing);
     newlisting.owner = req.user._id;
     newlisting.image = {url,filename};
     await newlisting.save();
     req.flash("success","New listing created!");
     res.redirect("/listings");
      
}


    module.exports.renderEditForm = async(req,res)=>{
    
          let {id} = req.params;
          const listing = await Listing.findById(id);
          if(!listing){
          req.flash("error","Listing you requested for does not Exist!");
          return res.redirect("/listings")
          }

          let originalImageUrl = listing.image.url;
         originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250")
          res.render("listings/edit.ejs",{listing ,originalImageUrl});
    }

    
    
    
    module.exports.updateListing =  async(req,res)=>{ 
    let{id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.Listing});
    if(typeof req.file !== "undefined"){
     let url = req.file.path;
     let filename = req.file.filename;
     listing.image = {url,filename};
     await listing.save();
    }
   
    req.flash("success","Listing Updated!");
    return res.redirect(`/listings/${id}`);
}

   
 module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
 
    let deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    req.flash("success","Listing deleted!");
   res.redirect("/listings");
}