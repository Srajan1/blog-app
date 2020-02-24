var express = require('express');
var app = express();
var expressSanitizer = require('express-sanitizer');
var bodyParser = require('body-parser');
var  mongoose = require ('mongoose');
var methodOverride = require('method-override');
mongoose.connect('mongodb://localhost:27017/restful_blog_app', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
var blogSchema = new mongoose.Schema({
        title: String,
        image: String,
        body: String,
        created: {type: Date, default: Date.now}
});
var Blog = mongoose.model('Blog', blogSchema);

app.get('/blogs', function(req, res){
        Blog.find({}, function(err, blogs){
                if(err)
                console.log(err);
                else
                res.render('index.ejs', {blogs: blogs});
        })
})
app.get('/', function(req, res){
        res.redirect('/blogs')
})


app.get('/blogs/new', function(req, res){
        res.render('new.ejs')
})
app.post('/blogs', function(req, res){
        req.params.blog.body = req.sanitize(req.params.blog.body);

        Blog.create(req.body.blog, function(err, newBlog){
                if(err)
                console.log(err);
                else
                res.redirect('/blogs')
        })
});

app.get('/blogs/:id', function(req, res){
        Blog.findById(req.params.id, function(err, foundBlog){
                if(err)
                res.redirect('/blogs');
                else res.render('show.ejs', {blog: foundBlog});
        })
});

app.get('/blogs/:id/edit', function(req, res){
        req.params.blog.body = req.sanitize(req.params.blog.body);
        Blog.findById(req.params.id, function(err, foundBlog){
                if(err)
                console.log(err);
                else res.render('edit.ejs', {blog: foundBlog});
        })
})

app.put('/blogs/:id', function(req, res){
        Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
                if(err)
                res.redirect('/index');
                else
                res.redirect('/blogs/'+req.params.id);
        })
})

app.delete('/blogs/:id', function(req, res){
        Blog.findByIdAndRemove(req.params.id, function(err){
                if(err)
                res.redirect('/blogs');
                else
                res.redirect('/blogs');
        })
})

app.listen(3000, function(){
        console.log('server started');
});