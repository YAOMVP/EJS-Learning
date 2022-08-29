const express = require("express");
const getDate = require("./date");
const app = express();
const port = 3000;
const items = ["I want to eat", "Eat hot pot", "Eat lamb skewer"];
let workItems = [];
const date = require(__dirname + "/date.js");

//register view engine we want to use ejs as our view engine of choicefor this application
app.set("view engine", "ejs");


app.get("/", (req, res) => {
    // res.send("<h1>Hello lafeiki</h1>");
    const day = date.getDate();
    res.render("list", { listTitle: day, newListItems: items });
});

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public")); //Tell Express to serve up this public folder as a static resource.

app.post("/", (req, res) => {

    const item = req.body.newItem;
    if (req.body.list === "WORK LIST") {
        workItems.push(item);
        // console.log(workItems);
        res.redirect("/work");
    } else {
        items.push(item);
        console.log(items);
        res.redirect("/"); //When a post request is triggered on home route, we save the user's item text box to a let item, and it will redirect to a home route. It will triggered the app.get for the home route. It will res.render the list template passsing in both the kindOfDay as well as the newListItem.
    }
});


app.get("/work", (req, res) => {
    //We are going to pass in list.ejs.
    res.render("list", { listTitle: "WORK LIST", newListItems: workItems });
});

app.post("/work", (req, res) => {
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");

});

app.get("/about", (req, res) => {
    res.render("/about");
});



app.post("/deleteItem", (req, res) => {
    let item = req.body.newItem;
    if (req.body.list === "WORK LIST") {
        workItems.splice(workItems.indexOf(item), 1);
        res.redirect("/work");
    } else {
        items.splice(items.indexOf(item), 1);
        res.redirect("/");
    }
});

app.listen(port, () => {
    console.log("Serve has started on port 3000");
});