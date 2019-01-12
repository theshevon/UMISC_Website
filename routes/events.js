var express = require("express");
var router = express.Router();
var Event = require("../models/event");
var date = new Date();

// REDIRECTION TO MONTHLY EVENTS
router.get("/events", function(req, res){
    res.redirect("/events/" + date.getFullYear() + "/" + date.getMonth());
});

// EVENT CREATION PAGE
router.get("/events/new", isLoggedIn, function(req, res){
    res.render("add-event");
});

// EVENT ALTERING PAGE
router.get("/events/:id/edit", isLoggedIn, function(req, res){
    Event.findById(req.params.id, function(err, event){
        if (err || !event){
            req.flash("error", "The event does not exist!")
            res.redirect("/events/" + date.getFullYear() + "/" + date.getMonth());
        } else{
            res.render("edit-event", {event:event});
        }
    });
});

// MONTHLY EVENTS PAGE
router.get("/events/:year/:month", function(req, res){

    var month = Number(req.params.month),
        year  = Number(req.params.year);

    // retrieve all events from db
    Event.find({}, function(err, events){
        if (err){
            req.flash("error", "Oops, something went wrong!");
            // redirect to home page
            res.redirect("/home");
        }
        events = getEventsForSpecificTime(events, month, year);
        res.render("events", {
                                month: month, 
                                year: year, 
                                events: events, 
                                prev: getUpdateTimeString(month, year, "prev"), 
                                next: getUpdateTimeString(month, year, "next")
                            });
    });
});

// CREATE AN EVENT
router.post("/events", isLoggedIn, function(req, res){
    
    var creator = {
                    id: req.user._id,
                    username: req.user.username
                  };

    req.body.event.created_by = creator;
    req.body.event.last_edited_by = creator;

    Event.create(req.body.event, function(err, event){
      if (err){
        req.flash("error", "Sorry, your request couldn't be completed at this time.")
        res.redirect("/events/" + event.date.getFullYear() + "/" + event.date.getMonth());
      }

      req.flash("success", "Event Successfully Added");
      res.redirect("/events/" + event.date.getFullYear() + "/" + event.date.getMonth());
    });
});

// SHOW A SPECIFIC EVENT
router.get("/events/:id", function(req, res){

    // find event by its ID
    Event.findById(req.params.id, function(err, event){
          if (err || !event){
            req.flash("error", "The event does not exist!")
            res.redirect("/events/" + date.getFullYear() + "/" + date.getMonth());
          }
          res.render("show-event", {event:event});
    });
});

// UPDATE AN EVENT
router.put("/events/:id", isLoggedIn, function(req, res){
    
    var editor = {
                    id: req.user._id,
                    username: req.user.username
                 };

    req.body.event.last_edited_by = editor;
    req.body.event.last_edited_on = Date();

    // find event by its ID and update it
    Event.findByIdAndUpdate(req.params.id, req.body.event, function(err, event){
        if (err){
            req.flash("error", "Error: Sorry, your request could not be completed at this time");
            res.redirect("/events");
        } else{
            req.flash("success", "Event Successfully Updated");
            res.redirect("/events/" + req.params.id);
        }
    });
});

// DELETE A SPECIFIC EVENT
router.delete("/events/:id", isLoggedIn, function(req, res){

    // find event by its ID and delete it
    Event.findByIdAndDelete(req.params.id, function(err){
        if (err){
            req.flash("error", "Error: Sorry, your request could not be completed at this time");
            res.redirect("back");
        } else{
            req.flash("success", "Event Successfully Deleted")
            res.redirect("/events");
        }
    });
});

/*==================================helper functions================================*/

/**
 * Finds the events corresponding to a specified month and year, orders them 
 * chronologically and returns an array of Event objects
 */
function getEventsForSpecificTime(allEvents, month, year){
    
    var events = [];

    // find the events 
    allEvents.forEach(function(event){
        if (event.date.getMonth() === month && event.date.getFullYear() === year){
            events.push(event);
        }
    });

    // sort them in ascending order of date
    events.sort((event1, event2) => event1.date - event2.date);

    return events;
}

/**
 * Provides the substring to complete the hrefs for the next and prev month buttons
 */
function getUpdateTimeString(month, year, dir){
    if (dir === "prev"){
        if (month === 0){
            month = 11;
            year--;
        }else{
            month--;
        }
    }else{
        if (month === 11){
            month = 0;
            year++;
        }else{
            month++;
        }
    }
    return "/" + year + "/" + month + "/";
}

/**
 * Middleware to check if a user has logged in.
 */
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
      return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/admin");
}
  
module.exports = router;


