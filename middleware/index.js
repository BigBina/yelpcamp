var Campground = require('../models/campground');
var Comment = require('../models/comment');


var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back")
            }  else {
                //did user create the campground?
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You dont have access to this content")
                    res.redirect("back");
                }
            }
        });
            } else {
                req.flash("error", "Please Login First");
                res.redirect("back")
            }
}
middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error" ,"Comment not found")
                res.redirect("back")
            }  else {
                //did user create the campground?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You dont have access to this content")
                    res.redirect("back");
                }
            }
        });
            } else {
            req.flash("error", "Please Login First");
            res.redirect("back")
            }


}

middlewareObj.isLoggedIn = function(req, res, next){ //this is the bread and butter. this locks access from a user if they are not logged in
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First");
    res.redirect('/login');
}







module.exports = middlewareObj;