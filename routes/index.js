const express = require('express');
const router = express.Router();
const path = require('path');

//Allows to read and display the md file 
router.use(express.static(path.join(__dirname, '/')));

// Rendering the main page
router.get('/', function (req, res) {
    
    // TODO: Display user name that is logged in (or nothing if not logged in)	
    // res.render('index', {
    //     title: "YOUR NAME Grocery Main Page"
    //     // HINT: Look at the /views/index.handlebars file
    //     // to get an idea of how the index page is being rendered
    // });

    res.write("<title>T MART</title>");
    res.write(`<style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #aef280; 
                }
                header {
                    background-color: #58a641;
                    padding: 10px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                header nav a {
                    text-decoration: none;
                    color: #333;
                    margin: 0 10px;
                }
                h1{
                    text-align: center;
                    color: #333;
                    margin-top: 20px;
                    font-family: 'Arial Black', sans-serif;
                }
                .contributors {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-wrap: wrap;
                    margin-top: 20px;
                }
                .contributor {
                    text-align: center;
                    margin: 20px;
                }
                .contributor img {
                    width: 200px;
                    height: auto;
                    border-radius: 50%; /* Make the images circular */
                    margin-bottom: 10px; /* Spacing between image and text */
                }
                .contributor h3 {
                    margin-bottom: 5px;
                }
                .contributor p {
                    font-size: 14px;
                    color: #666;
                }
                .markdown-files {
                    text-align: center;
                    margin-top: 20px;
                }
                .markdown-files a button {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    background-color: #58a641; 
                    color: white;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.3s ease; /* Smooth color transition on hover */
                }
                .markdown-files a button:hover {
                    background-color: #17591e; /* Darker blue on hover */
                }
            </style>`);

    
    res.write("<header>");
    res.write("<h1>T MART</h1>");
    res.write("<nav>");
    res.write("<a href=\"/\">HOME</a>");
    res.write("<a href = '/listprod'>SHOP PRODUCTS</a>");
    res.write("<a href=\"/showcart\">CART</a>");
    res.write("<a href=\"/listorder\">ORDERS</a>");
    res.write("<a href=\"/admin\">ADMIN</a>");
    res.write("<a href=\"/customer\">CUSTOMERS</a>");

    if(req.session.authenticatedUser && req.session.userid) {
        res.write("<span>Welcome, " + req.session.userid + "!</span>");
        res.write("<a href=\"/logout\">Logout</a>");
    } else {
        res.write("<a href=\"/login\">LOGIN</a>");
    }
    res.write("</nav>");
    res.write("</header>");
    res.write("</div>");
    
    res.write("<h2 align = 'center'>Contributors</h2>");
    res.write("<div class='contributors'>");
    // Display images of contributors

    res.write("<div class='contributor'>");
    res.write("<img src='img/image.jpg'>");
    res.write("<h3>Om Mistry</h3>");
    res.write("<p>3rd Year Computer Science Major</p>");
    res.write("</div>");

    res.write("<div class='contributor'>");
    res.write("<img src='img/aamir.jpg'>");
    res.write("<h3>Syed Aamir Ahmed</h3>");
    res.write("<p>3rd Year Computer Science Major</p>");
    res.write("</div>");

    res.write("</div>");

    res.write("<h2 align = 'center'>Executive Summary</h2>");
    res.write("<div class='markdown-files'>");
    // Display buttons to show markdown files
    res.write("<a href='/execsummary.md' target='_blank'><button>Executive Summary</button></a>");
    res.write("</div>");

    res.end();
})

module.exports = router;
