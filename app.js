const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _ = require("lodash");

app.set('view engine', "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://shivamnegi2424:to-doList24@cluster0.dmlx2bw.mongodb.net/toDoListDB");

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Leetcode"
});
const item2 = new Item({
    name: "Open-source contribution"
});
const item3 = new Item({
    name: "Freelancing"
});

const defaultItems = [item1, item2, item3];
const listSchema={
    name: String,
    items:[itemsSchema]
}
const List = mongoose.model("List",listSchema);

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running all good");
})

// var items=[];
var day="";
app.get("/", function (req, res) {

    day = date();

    Item.find({}).then(function (foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems).then(function () {
                console.log("Successfully added to DB");
            }).catch(function (err) {
                console.log(err);
            });
            res.redirect("/");
        }
        else
            res.render("list", { keyDay: day, newListItems: foundItems });
    }).catch(function (err) {
        console.log("error in reading from database: " + err);
    });
})

app.get("/:customListName",function(req,res){
    const customListName=_.capitalize(req.params.customListName);

    List.findOne({name:customListName}).then(function(foundList){
        if(!foundList){
            const list = new List({
                name:customListName,
                items: []
            });
            list.save();
            res.redirect("/"+customListName);
        }
        else{
            res.render("list",{ keyDay: foundList.name, newListItems: foundList.items })
        }
    }).catch(function(err){
        console.log("Error visiting customList url: "+err);
    });
    
});

app.post("/", function (req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.customList;
    console.log(listName);
    const item = new Item({
        name: itemName
    });

    if(listName===day){
        item.save();
        res.redirect("/");
    }
    else{
        List.findOne({name: listName}).then(function(foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
        }).catch(function(err){
            console.log("Error in findOne: "+err);
        })
    }
    
    
})

app.post("/delete", function (req, res) {
    const itemIdChecked = req.body.itemToDelete;
    const listName = req.body.listName;
    console.log(itemIdChecked);
    
    if(listName===day){
    // if (itemId.match(/^[0-9a-fA-F]{24}$/)) {
        Item.findByIdAndDelete(itemIdChecked)
        .then(function () {
            console.log("Successfully deleted the checked Item");
            res.redirect("/");
        })
        .catch(function (err) {
            console.log("error in deleting the checkbox item: " + err);
        });
    // }
    // else {
    //     console.log("Id is not valid");
    // }
    }
    else{
        List.findOneAndUpdate({name: listName},{$pull : {items: {_id: itemIdChecked}}}).then(function(){
            res.redirect("/"+listName);
        }).catch(function(err){
            console.log("error in finding and updating the custom list checked item: "+err);
        });
    }
}); 
