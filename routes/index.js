const express = require('express');
const router = express.Router();

// Rendering the main page
router.get('/', function (req, res) {
    let username = false;
    
    // TODO: Display user name that is logged in (or nothing if not logged in)	
    // res.render('index', {
    //     title: "YOUR NAME Grocery Main Page"
    //     // HINT: Look at the /views/index.handlebars file
    //     // to get an idea of how the index page is being rendered
    // });

    res.write("<div style='text-align: center; padding-top: 50px;'>");
    res.write("<h1 style='font-family: 'Segoe UI', sans-serif; color: #00aaff;'>T MART</h1>");
    res.write("<div style='display: flex; flex-direction: column; gap: 15px; align-items: center;'>");
    res.write("<button style='border: none; padding: 8px 15px; background-color: #00aaff; color: white; border-radius: 5px; font-family: 'Roboto', sans-serif; font-size: 16px; cursor: pointer; outline: none;'><a href=\"/login\" style='text-decoration: none; color: white;'>Login</a></button>");
    res.write("<button style='border: none; padding: 8px 15px; background-color: #00aaff; color: white; border-radius: 5px; font-family: 'Roboto', sans-serif; font-size: 16px; cursor: pointer; outline: none;'><a href=\"/listprod\" style='text-decoration: none; color: white;'>Begin Shopping</a></button>");
    res.write("<button style='border: none; padding: 8px 15px; background-color: #00aaff; color: white; border-radius: 5px; font-family: 'Roboto', sans-serif; font-size: 16px; cursor: pointer; outline: none;'><a href=\"/listorder\" style='text-decoration: none; color: white;'>List Orders</a></button>");
    res.write("<button style='border: none; padding: 8px 15px; background-color: #00aaff; color: white; border-radius: 5px; font-family: 'Roboto', sans-serif; font-size: 16px; cursor: pointer; outline: none;'><a href=\"/customer\" style='text-decoration: none; color: white;'>Customer Info</a></button>");
    res.write("<button style='border: none; padding: 8px 15px; background-color: #00aaff; color: white; border-radius: 5px; font-family: 'Roboto', sans-serif; font-size: 16px; cursor: pointer; outline: none;'><a href=\"/admin\" style='text-decoration: none; color: white;'>Admin</a></button>");
    res.write("</div>");
    if(req.session.authenticatedUser)
        res.write("<p style='font-family: 'Segoe UI', sans-serif; font-size: 14px; color: #00aaff;'>Signed in as: " + req.session.userid + "</p>");
    res.write("</div>");
    res.end();
})

module.exports = router;
