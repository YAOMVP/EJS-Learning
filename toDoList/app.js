const express = require("express");
const app = express();
const port = 3000;

//register view engine we want to use ejs as our view engine of choicefor this application
app.set("view engine", "ejs");


app.get("/", (req, res) => {
    // res.send("<h1>Hello lafeiki</h1>");
    let day = "";
    switch (new Date().getDay()) {
        case 0:
            day = "Sunday"
            break;
        case 1:
            day = "Monday"
            break;
        case 2:
            day = "Tuesday"
            break;
        case 3:
            day = "Wednesday"
            break;
        case 4:
            day = "Thursday"
            break;
        case 5:
            day = "Friday"
            break;
        case 6:
            day = "Saturday"
            break;

    }
    res.render("list", { kindOfDay: day });
});

app.listen(port, () => {
    console.log("Serve has started on port 3000");
});