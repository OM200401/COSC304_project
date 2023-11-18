const express = require('express');
const router = express.Router();

// Rendering the main page
router.get('/', function (req, res) {
    let username = false;
    
    // TODO: Display user name that is logged in (or nothing if not logged in)	
    res.render('index', {
        title: "YOUR NAME Grocery Main Page"
        // HINT: Look at the /views/index.handlebars file
        // to get an idea of how the index page is being rendered
    });

    res.write("<h1 align = \"center\"><font face = \"cursive\" color = \"black\">Welcome to T MART </font></h1>");
    res.write("<h2 align = \"center\"><a href=\"/listprod\">Begin Shopping</a></h2>");
    res.write("<h2 align = \"center\"><a href=\"/listorder\">List All Orders</a></h2>");
    res.end();
})

module.exports = router;
