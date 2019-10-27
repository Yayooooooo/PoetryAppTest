let Poem = require("../models/poems")
let User = require("../models/users")
let express = require('express');
let router = express.Router();

router.findAllPoems = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');
    Poem.find(function(err, poems) {
        if (err)
            res.send(err);
        res.send(JSON.stringify(poems,null,5));
    });
};

function getByValue(array, id) {
    var result  = array.filter(function(obj){return obj.id == id;} );
    return result ? result[0] : null; // or undefined
}

router.findOnePoem = (req, res) => {
    res.setHeader('Content-Type','application/json');

    Poem.find({ "_id" : req.params.id },function(err, poem) {
        if (err)
            res.json({ message: 'Poem NOT Found!', errmsg : err } );
        else
            res.send(JSON.stringify(poem,null,5));
    });
};

router.addPoem = (req, res) => {
    //Add a new donation to our list
    var poem = new Poem();

    poem.title = req.body.title;
    poem.author = req.body.author;

    poem.save(function(err) {
        if (err)
            res.json({ message: 'Poem NOT Added!', errmsg : err } );
        else
            res.json({ message: 'Poem Successfully Added!', data: poem });
    });
};


router.incrementLikes = (req, res) => {
    Poem.findById(req.params.id, function(err,poem) {
        if (err)
            res.json({ message: 'Poem NOT Found!', errmsg : err } );
        else {
            poem.likes.push(req.session.userId);
            /*if(poem.find( { likes: req.session.userId} )){
                res.json({ message: 'You have already liked this poem!', errmsg : err } );
            }
            else {
                poem.likes.push(req.session.userId);
                //record which poem user liked, but didn't work. So users don't know what poems they have liked
                User.findById(req.session.userId, function(err,user){
                    if (err)
                        res.json({ message: 'User NOT Found!', errmsg : err } );
                    else {
                        user.likes.push(poem._id);
                    }
                })*/
            poem.save(function (err) {
                if (err)
                    res.json({ message: 'Poem NOT liked!', errmsg : err } );
                else
                    res.json({ message: 'Poem Successfully Liked!', data: poem });
            });
        }
    });
};

router.decreaseLikes = (req, res) => {
    Poem.findById(req.params.id, function(err,poem) {
        if (err)
            res.json({ message: 'Poem NOT Found!', errmsg : err } );
        else {
            poem.likes.remove(req.session.userId);
            poem.save(function (err) {
                if (err)
                    res.json({ message: 'Poem NOT liked!', errmsg : err } );
                else
                    res.json({ message: 'Poem Successfully Unliked!', data: poem });
            });
        }
    });
};

router.deletePoem = (req, res) => {
    Poem.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.json({ message: 'Poem NOT DELETED!', errmsg : err } );
        else
            res.json({ message: 'Poem Successfully Deleted!'});
    });
}

/*
function getTotalLikes(array) {
    let totalLikes = 0;
    array.forEach(function(obj) { totalLikes += obj.likes; });
    return totalLikes;
}

router.findTotalLikes = (req, res) => {
    Poem.find(function(err, poem) {
        if (err)
            res.send(err);
        else
            res.json({ totalLikes : getTotalLikes(poem) });
    });
}*/

module.exports = router;