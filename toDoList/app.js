const express = require("express");
const getDate = require("./date");
const app = express();
const port = process.env.PORT;
// const items = ["I want to eat", "Eat hot pot", "Eat lamb skewer"];
// let workItems = [];
const date = require(__dirname + "/date.js");
const _ = require('lodash');

// 15/09/2022:
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/todolistDB');

    // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}

const itemsSchema = new mongoose.Schema({
    name: String,
});

const listSchema = new mongoose.Schema({
    //The list gonna have a name. and it's going to have an array of item documents associated with itemsSchema as well.
    name: String,
    items: [itemsSchema]
});

//Parameter the collections will comply with this schema.
const Item = mongoose.model("Item", itemsSchema);

//We have created a List model from listSchema,then we created a list document based off this model.
const List = mongoose.model("List", listSchema);

const eat = new Item({
    name: "I want to eat!"
});

const hotpot = new Item({
    name: "I want to eat hotpot!"
});

const lamb = new Item({
    name: "I want to eat lamb skewer!"
});

const defaultItems = [eat, hotpot, lamb];





//register view engine we want to use ejs as our view engine of choice for this application
app.set("view engine", "ejs");


app.get("/", (req, res) => {
    Item.find({}, (error, docs) => {
        if (docs.length === 0) {
            Item.insertMany(defaultItems, (error, results) => {
                if (error) {
                    console.log(error);

                } else {
                    console.log(results);
                    console.log("Successfully saved default database!");
                }
            });
            res.redirect("/");
        } else {
            const day = date.getDate();
            res.render("list", { listTitle: day, newListItems: docs });
        }
    });

    // res.send("<h1>Hello lafeiki</h1>");

});

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public")); //Tell Express to serve up this public folder as a static resource.

app.post("/", (req, res) => {
    // console.log(req.body);
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });


    if (listName === date.getDate()) {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, (error, foundList) => {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);

            // foundList.items.forEach(list => {
            //     console.log("数组对象：" + list.name);
            // });

            // console.log("!!!!!!!!!!!!!!");
            // console.log(foundList.name);
            // console.log("----------");
            // console.log(foundList);
        });
    }



    // if (req.body.list === "WORK LIST") {
    //     workItems.push(item);
    //     // console.log(workItems);
    //     res.redirect("/work");
    // } else {
    //     items.push(item);
    //     console.log(items);
    //     res.redirect("/"); //When a post request is triggered on home route, we save the user's item text box to a let item, and it will redirect to a home route. It will triggered the app.get for the home route. It will res.render the list template passsing in both the kindOfDay as well as the newListItem.
    // }
});

app.post("/delete", (req, res) => {
    const checkedItemeId = (req.body.checkbox);
    const listName = req.body.listName;

    if (listName === date.getDate()) {
        Item.findByIdAndRemove(checkedItemeId, (error, docs) => {
            if (error) {
                console.log(error);
            } else {
                console.log("Successfully deleted!!!");
                res.redirect("/");
            }
        });
    } else {
        List.findOne({ name: listName }, function(error, results) {
            // console.log(results);
            results.items.pull({ _id: checkedItemeId });
            results.save();
            res.redirect("/" + listName);
        });
    }



});



// app.get("/work", (req, res) => {
//     //We are going to pass in list.ejs.
//     res.render("list", { listTitle: "WORK LIST", newListItems: workItems });
// });


app.get("/:paraName", (req, res) => {
    const paraName = _.capitalize(req.params.paraName);


    List.findOne({ name: paraName }, (error, results) => {
        if (error) {
            console.log(error);
        } else {
            if (!results) { //if results does not exist
                //console.log("does no exist");
                const list = new List({
                    name: paraName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + paraName);
            } else {
                console.log("---");
                console.log(results);
                res.render("list", { listTitle: results.name, newListItems: results.items });
            }
        }
    });

    // list.save();
});




app.post("/work", (req, res) => {
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");

});

app.get("/about", (req, res) => {
    res.render("about");
});





app.listen(port || 3000, () => {
    console.log("Serve has started on port 3000");
});