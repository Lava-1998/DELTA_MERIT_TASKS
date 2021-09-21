var express=require("express");
var app=express();
const{MongoClient,ObjectId}=require("mongodb");
var url="mongodb://127.0.0.1:27017";
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const multer = require("multer");
var path = require("path");
app.use(express.static('uploads'));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname+'/uploads')
    },
    filename: function (req, file, cb) {
        console.log("file in filename function::",file)
        var filetext = path.extname(file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) //used for unique id purpose (unique filename)
      cb(null, file.fieldname + '-' + uniqueSuffix+filetext)
    }
})
const upload = multer({ storage: storage })
app.get("/user",function(req,res){
    MongoClient.connect(url,(err,conn)=>{
        var db=conn.db("festi")
        db.collection("profile").find().toArray((err,data)=>{
            console.log(data)
            res.send(data)
        })
    })
})
app.post("/info",upload.single("profilepic"),function(req,res){
    console.log("req.body",req.body);
    req.body.profilepic=req.file.filename
    MongoClient.connect(url,function(err,conn){
        var db = conn.db("festi");
        db.collection("profile").insertOne(req.body,function(err,data){
            //res.send(data)
            console.log(data)
            res.send(data)
        })
    })
})
app.post("/user2/:id",function(req,res){
    MongoClient.connect(url,(err,conn)=>{
        var db=conn.db("festi")
        db.collection('profile').deleteOne({_id: ObjectId(req.params.id)},function(err,data){
            res.redirect("/user")
        })
    })
})
app.post("/update1/:id",upload.single("profilepic"),function(req,res){
    console.log("req.file",req.file);   
    req.body.profilepic = req.file.filename;
    MongoClient.connect(url,function(err,conn){
        console.log(req.body)
        var db = conn.db("festi");
        db.collection("profile")
        .updateOne(
            {_id:ObjectId(req.params.id)},{
                $set:req.body
                },
            function(err,data){
                console.log(data)
                res.redirect("/user")
            }
        )
    })
})

app.listen(8000,function(){console.log("Listening on 8000!")})
