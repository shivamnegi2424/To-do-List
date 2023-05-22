const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const date=require(__dirname + "/views/date.js");

app.set('view engine', "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.listen(process.env.PORT || 3001, function () {
    console.log("Server is running all good");
})

var items=[];

app.get("/", function (req, res) {

    var day=date();
    
    res.render("list", { keyDay: day, newListItems:items });
    
})

app.post("/",function(req,res){
    var item=req.body.newItem;
    items.push(item);
    res.redirect("/")
})
