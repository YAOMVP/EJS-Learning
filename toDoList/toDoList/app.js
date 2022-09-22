const express = require("express");
const getDate = require("./date");
const app = express();
const port = process.env.PORT;
const items = [];
let workItems = [];
const date = require(__dirname + "/date.js");

//register view engine we want to use ejs as our view engine of choice for this application
app.set("view engine", "ejs");


// getting-started with mongoose
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/MyThingsDB');

    // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}

const toDoListSchema = new mongoose.Schema({
    name: "String"
});

const List = mongoose.model("List", toDoListSchema);

const dumplings = new List({
    name: "Eat dumplings!! yes"
});

const hotpot = new List({
    name: "Hotpot is my favourite food!!!"
});

const gedaSoup = new List({
    name: "GedaSoup is delicious!!"
});

const defaultThings = [dumplings, hotpot, gedaSoup];

List.insertMany(defaultThings, (error, docs) => {
    if (error) {
        console.log(error);
    } else {
        // console.log(defaultThings);
        console.log("Successfully inserted in the database!!");
    }
});



app.get("/", (req, res) => {
    // res.send("<h1>Hello lafeiki</h1>");
    const day = date.getDate();

    res.render("list", { listTitle: day, newListItems: defaultThings });
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
    res.render("about");
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

app.listen(port || 3000, () => {
    console.log("Serve has started on port 3000");
});