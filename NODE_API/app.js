var express=require("express");
var app=express();
const{MongoClient,ObjectId}=require("mongodb");
var url="mongodb://127.0.0.1:27017";
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.set('view engine','pug');
app.set('views','./views');
app.get("/user",function(req,res){
    MongoClient.connect(url,(err,conn)=>{
        var db=conn.db("lafesti")
        db.collection("userprofile").find().toArray((err,data)=>{
            console.log(data)
            res.send(data)
        })
    })
})
app.post("/user1",function(req,res){
    MongoClient.connect(url,(err,conn)=>{
        var db=conn.db("lafesti")
        db.collection('userprofile').insertOne(req.body,function(err,data){
            console.log(data)
            res.send(data)
        })
    })
})
app.post("/user2/:id",function(req,res){
    MongoClient.connect(url,(err,conn)=>{
        var db=conn.db("lafesti")
        db.collection('userprofile').deleteOne({_id: ObjectId(req.params.id)},function(err,data){
            res.redirect("/user")
        })
    })
})
app.post("/update/:id",function(req,res){
    MongoClient.connect(url,function(err,conn){
        console.log(req.body)
        var db = conn.db("lafesti");
        db.collection("userprofile")
        .updateOne(
            {_id:ObjectId(req.params.id)},
            {$set:req.body},
            function(err,data){
                console.log(data)
                res.send(data)
            }
        )
    })
})
app.listen(8000,function(){console.log("Listening on 9080!")})
