var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var middleware = require('../middleware') //index is a special name, is the reason why we dont require it

//INDEX* -- all * are in the RESTFUL.txt file.
router.get("/", function(req, res){
    console.log(req.user);
    
    Campground.find({}, function(err, allcampgrounds){ //DB
        if(err){
            console.log(err);
        } else {
        res.render("campgrounds/index", {campgrounds: allcampgrounds/*, currentUser: req.user*/});
        }
    });
});
//CREATE*
router.post("/", middleware.isLoggedIn, function(req, res){ //router.post from the form
    //get data from form and add to campground arrray
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: description, author: author}; //this is all coming from the form
    
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds")
        }
    });
});
//NEW*
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//SHOW*
router.get("/:id", function(req, res){
   //find the campground with provided id
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){ //this line has big change with populate comments and execute the function
    if(err){
        console.log(err);
    } else{
        res.render("campgrounds/show", {campground: foundCampground});
    }
   });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds/"+ req.params.id)
        }
    })
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds");
        }
    })
})



module.exports = router;