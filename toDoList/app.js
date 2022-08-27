const express = require("express");
const app = express();
const port = 3000;
let inputs = ["I want to eat", "Eat hot pot", "Eat lamb skewer"];

//register view engine we want to use ejs as our view engine of choicefor this application
app.set("view engine", "ejs");


app.get("/", (req, res) => {
    // res.send("<h1>Hello lafeiki</h1>");
    let options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    let today = new Date();
    let day = today.toLocaleDateString("en-US", options);
    res.render("list", { kindOfDay: day, newListItems: inputs });
});

app.use(express.urlencoded({ extended: true }));

app.post("/", (req, res) => {
    let input = req.body.newItem;
    // res.send(input);

    inputs.push(input);

    res.redirect("/"); //When a post request is triggered on home route, we save the user's input text box to a let input, and it will redirect to a home route. It will triggered the app.get for the home route. It will res.render the list template passsing in both the kindOfDay as well as the newListItem.
})

app.listen(port, () => {
    console.log("Serve has started on port 3000");
});