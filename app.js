var express = require("express"),
    methodOverride=require("method-override"),
    bodyParser=require("body-parser"),
    expressSanitizer=require("express-sanitizer"),
    mongoose=require("mongoose"),
    app=express();

//APP config    
mongoose.connect("mongodb://localhost/blog_app",{ useNewUrlParser: true });
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

mongoose.set("useFindAndModify", false);


//Mongoose config
var blogSchema=new mongoose.Schema({
    title:String,
    body:String,
    image:String,
    created:{type:Date ,default:Date.now}               //when created
});

var Blog = mongoose.model("Blog", blogSchema);

//ROUTES

app.get("/",function(req, res) {
    res.redirect("/blog");
});

//Index Route
app.get("/blog",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }
        else{
           res.render("index",{blogs:blogs});     
        }
    })

})

//New Route
app.get("/blog/new",function(req, res) {
    res.render("new.ejs");
});

//Create Route
app.post("/blog",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,blog){
        if(err){
            res.render("new.ejs")
        }
        else{
            res.redirect("/blog");
        }
    })
})

//Show route
app.get("/blog/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundblog){
        if(err){
            res.redirect("/blog");
        }
        else{
            res.render("show.ejs",{blog:foundblog});
        }
    });
});

//Edit blog
app.get("/blog/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundblog){
        if(err){
            res.redirect("/blog");
        }
        else{
            res.render("edit.ejs",{blog:foundblog});
        }
    })
})

//Update blog
app.put("/blog/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
        if(err){
            res.redirect("/blog");
        }
        else{
            res.redirect("/blog/"+req.params.id);
        }
    })
})

//Delete route
app.delete("/blog/:id",function(req,res){
   Blog.findByIdAndRemove(req.params.id,function(err, foundblog) {
        if(err){
        console.log(err);
    }
    else{
        res.redirect("/blog");
    }       
   })

})


//about Us
app.get("/about",function(req, res) {
    res.render("about.ejs");
})


app.listen(process.env.PORT,process.env.IP,function(req,res){
    console.log("Serve has started");
})