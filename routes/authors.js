let Poem = require("../models/poems")
let Author = require("../models/authors")
let express = require('express');
let router = express.Router();

router.findAllAuthors = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');
    Author.find(function(err, author) {
        if (err)
            res.send(err);
        res.send(JSON.stringify(author,null,5));
    });
};

router.findOneAuthor = (req, res) => {
    res.setHeader('Content-Type','application/json');

    Author.find({ "_id" : req.params.id },function(err, author) {
        if (err)
            res.json({ message: 'Author NOT Found!', errmsg : err } );
        else
            res.send(JSON.stringify(author,null,5));
    });
}

router.addAuthor = (req, res) => {
    //Add a new donation to our list
    var author = new Author();

    author.name = req.body.name;
    author.introduction = req.body.introduction;

    author.save(function(err) {
        if (err)
            res.json({ message: 'Author NOT Added!', errmsg : err } );
        else
            res.json({ message: 'Author Successfully Added!', data: author });
    });
}


router.incrementLikes = (req, res) => {
    Author.findById(req.params.id, function(err,author) {
        if (err)
            res.json({ message: 'Author NOT Found!', errmsg : err } );
        else {
            author.likes.push(req.session.userId);
            author.save(function (err) {
                if (err)
                    res.json({ message: 'Author NOT liked!', errmsg : err } );
                else
                    res.json({ message: 'Author Successfully Liked!', data: author });
            });
        }
    });
};

router.decreaseLikes = (req, res) => {
    Author.findById(req.params.id, function(err,author) {
        if (err)
            res.json({ message: 'Author NOT Found!', errmsg : err } );
        else {
            author.likes.remove(req.session.userId);
            author.save(function (err) {
                if (err)
                    res.json({ message: 'Author NOT liked!', errmsg : err } );
                else
                    res.json({ message: 'Author Successfully Unliked!', data: author });
            });
        }
    });
};


router.incrementWorks = (req, res) => {
    Author.findById(req.params.id, function(err,author) {
        if (err)
            res.json({ message: 'Author NOT Found!', errmsg : err } );
        else {
            author.works.push(req.body.poemId);
            author.save(function (err) {
                if (err)
                    res.json({ message: 'Work NOT Added!', errmsg : err } );
                else
                    res.json({ message: 'Work Successfully Added!', data: author });
            });
        }
    });
};

router.deleteWorks = (req, res) => {
    Author.findById(req.params.id, function(err,author) {
        if (err)
            res.json({ message: 'Author NOT Found!', errmsg : err } );
        else {
            author.works.remove(req.body.poemId);
            author.save(function (err) {
                if (err)
                    res.json({ message: 'Author NOT liked!', errmsg : err } );
                else
                    res.json({ message: 'Work Successfully deleted!', data: author });
            });
        }
    });
};

router.deleteAuthor = (req, res) => {
    Author.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.json({ message: 'Author NOT DELETED!', errmsg : err } );
        else
            res.json({ message: 'Author Successfully Deleted!'});
    });
}


module.exports = router;