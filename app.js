const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/tasklistDB", {useNewUrlParser: true});


const defaultSchema = {
  name: String,
};
const Default = mongoose.model("Default", defaultSchema);
const item1 = new Default ({
  name:"Add Your Task.."
});
const defaultItems = [item1];


app.get("/",function(req,res){
  Default.find({},function(err,foundtask){
    if(foundtask.length === 0){
    Default.insertMany(defaultItems,function(err){
      if(err){ console.log(err);}
      else{console.log("Successfully saved to DB.");}
    });
    res.redirect("/");
  } else {
      res.render("list",{itemsName:foundtask});
  }
  });
});


app.post("/",function(req,res){
  const taskName = req.body.newTask;
  const item = new Default ({
    name: taskName
  });
  item.save();
  res.redirect("/");
});


app.post("/delete",function(req,res){
  const checkedId = req.body.trashit;

  Default.findByIdAndRemove (checkedId, function(err){
    if(err){
      console.log(err);
    } else {
      console.log("Successfully deleted Task..");
      res.redirect("/");
    }
  });
});


app.get("/about",function(req,res){
  res.render("about");
});


app.listen(3000,function(){
  console.log("Server started on port 3000");
});
