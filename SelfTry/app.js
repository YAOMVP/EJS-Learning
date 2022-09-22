const express = require("express");
const app = express();
const port = 3000;
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
let things = [];
const tomThings = [];


// getting-started.js
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/selfListDB');

    // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}

const thingSchema = new mongoose.Schema({
    name: String,
});

const Part = mongoose.model("Part", thingSchema);
const Follow = mongoose.model("Follow", thingSchema);

const one = new Part({
    name: "Want to eat malatang!!"
});

const two = new Part({
    name: "Want to eat hotpot!!"
});

const defaultItems = [one, two];

app.get("/", (req, res) => {

    Part.find({}, (error, docs) => {
        if (error) {
            console.log(error);
        } else {
            if (docs.length === 0) {
                Part.insertMany(defaultItems, (error, result) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Add successfully!!!");
                        res.redirect("/");
                    }
                });

            } else {
                // console.log(docs);
                res.render("thing", { thingItems: docs });
            }
        }
    });


});

app.post("/", (req, res) => {
    const item = req.body.thingToDo;
    things.push(item);
    console.log(things);
    const itemDB = new Part({
        name: item
    });
    itemDB.save();
    res.redirect("/");
});


app.post("/delete", (req, res) => {
    const del = req.body.del
    console.log(del);
    Part.findByIdAndRemove(del.trim(), (error, docs) => {
        if (error) {
            console.log(error);
        } else {
            console.log(docs);
            res.redirect("/");
        }
    });

});


app.get("/tomorrow", (req, res) => {

    Follow.find({}, (error, results) => {
        if (error) {
            console.log(error);
        } else {
            // console.log(results);
            res.render("tomorrow", { thingItems: results });
        }
    });

});


app.post("/tomorrow", (req, res) => {
    const future = req.body.thingToDo;
    tomThings.push(future);
    // console.log(tomThings);

    const plan = new Follow({
        name: future
    });
    plan.save();
    res.redirect("/tomorrow");
});

app.post("/deleteTom", (req, res) => {
    const btndel = req.body.del;
    console.log(btndel);
    Follow.findByIdAndRemove(btndel.trim(), (error, results) => {
        if (error) {
            console.log(error);
        } else {
            console.log(results);
            res.redirect("/tomorrow");
        }
    });

});




app.listen(port, (req, res) => {
    console.log("The server is successfully on port 3000!");
});