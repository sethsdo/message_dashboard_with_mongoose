"use strict"

const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');
const moment = require('moment');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/quotes_mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new mongoose.Schema({
    author: { type: String, required: true, minlength: 4 },
    text: { type: String, required: true, minlength: 4 },
}, { timestamps: true });

var PostSchema = new mongoose.Schema({
    author: { type: String, required: true, minlength: 4 },
    text: { type: String, required: true, minlength: 4 },
    comments: [],
}, { timestamps: true });

mongoose.model('Post', PostSchema);
mongoose.model('Comment', CommentSchema);
mongoose.Promise = global.Promise;

const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');

app.use(bodyParser.urlencoded({ extended: true }))
app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'ejs');



app.get('/', function (req, res) {
    Post.find({}, function (err, post) {
        if (err) {
            console.log("something wen't wrong!")
        }
        const context = {
            "posts": post,
        }
        console.log(context)
        res.render('index', context);
    });
})

app.post('/post', function (req, res) {
    const post = new Post({ author: req.body.name, text: req.body.message })
    console.log(post);
    post.save(function (err) {
        if (err) {
            res.render("index", { errors: post.errors })
        }
         else {
            res.redirect('/');
        }
    })
})

app.post('/comment/:id', function (req, res) {
    Post.findOne({ _id: req.params.id }, function (err, post) {
        var comment = new Comment({ author: req.body.name, text: req.body.comment});
        console.log(comment)
        post.comments.push(comment);
        comment.save(function (err) {
            post.save(function (err) {
                if (err) { console.log('Error'); }
                else { res.redirect('/'); }
            });
        });
    });
});


app.listen(8000, function () {
    console.log("listening on port 8000")
})