
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const querystring = require('querystring');


router.get('/', async function(req, res, next) {
    /** $name now contains the search string the user entered
     Use it to build a query and print out the results. **/

    /** Create and validate connection **/

    /** Print out the ResultSet **/

    /** 
    For each product create a link of the form
    addcart?id=<productId>&name=<productName>&price=<productPrice>
    **/

    /**
        Useful code for formatting currency:
        let num = 2.89999;
        num = num.toFixed(2);
    **/

    res.setHeader('Content-Type', 'text/html');
    res.write("<title>T MART</title>");
    res.write(`<style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
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
        .search-bar {
            text-align: center;
            margin-top: 20px;
        }
        h1{
            text-align: center;
            color: #333;
            margin-top: 20px;
            font-family: 'Arial Black', sans-serif;
        }
        .search-bar select, .search-bar input[type='text'] {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-right: 10px;
        }
        .search-bar input[type='submit'], .search-bar input[type='reset'] {
            padding: 8px 16px;
            border: none;
            border-radius: 5px;
            background-color: #4CAF50;
            color: white;
            cursor: pointer;
        }
        .search-bar input[type='submit']:hover, .search-bar input[type='reset']:hover {
            background-color: #45a049;
        }
        .add-to-cart, .product-details {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 10px;
            text-decoration: none;
            color: white;
            border-radius: 5px;
            transition: all 0.3s ease;
        }
        .add-to-cart {
            background-color: #4CAF50; /* Green */
        }
    
        .product-details {
            background-color: #008CBA; /* Blue */
        }
    
        .add-to-cart:hover, .product-details:hover {
            opacity: 0.8;
        }
        .footer {
            background-color: #333;
            color: white;
            padding: 20px;
            text-align: center;
            position: absolute;
            bottom: 0;
            width: 100%;
        }
        .social-icons {
            display: flex;
            justify-content: center;
            margin-top: 10px;
        }
        .social-icons a {
            display: inline-block;
            margin: 0 10px;
            font-size: 24px;
            color: white;
            transition: color 0.3s ease;
        }
        .social-icons a:hover {
            color: #007bff;
        }
    </style>`);


    res.write("<header>");
    res.write("<h1>T MART</h1>");
    res.write("<nav>");
    res.write("<a href=\"/\">HOME</a>");
    res.write("<a href=\"/showcart\">CART</a>");
    res.write("<a href=\"/listorder\">ORDERS</a>");
    if(req.session.authenticatedUser && req.session.userid) {
        res.write("<span>Welcome, " + req.session.userid + "!</span>");
        res.write("<a href=\"/logout\">Logout</a>");
    } else {
        res.write("<a href=\"/login\">LOGIN</a>");
    }
    res.write("</nav>");
    res.write("</header>");
    res.write("<div class='search-bar'>");
    res.write("<form method='get' action='listprod'>");
    res.write("<select name='categoryName'>");
    res.write("<option>All</option>");
    res.write("<option>Beverages</option>");
    res.write("<option>Condiments</option>");
    res.write("<option>Confections</option>");
    res.write("<option>Dairy Products</option>");
    res.write("<option>Grains/Cereals</option>");
    res.write("<option>Meat/Poultry</option>");
    res.write("<option>Produce</option>");
    res.write("<option>Seafood</option></select>");
    res.write("<input type='text' name='productName' placeholder='Search products...' size='50'>");
    res.write("<input type='submit' value='Submit'>");
    res.write("<input type='reset' value='Reset'>");
    res.write("</form></div>");

    // Get the product name to search for
    try{
        let name = req.query.productName;
        let categoryName = req.query.categoryName;
        let pool = await sql.connect(dbConfig);
        sqlQuery = "SELECT p.productId, p.productName, p.productPrice, c.categoryName, p.productImageURL FROM product p JOIN category c ON p.categoryId = c.categoryID";
        let results = null;

        if(categoryName && categoryName != "All"){
            sqlQuery += " WHERE categoryName = @categoryName";
        }
        else if(name){
            sqlQuery += " WHERE productName LIKE @productName";
        }

        if(categoryName && categoryName != "All"){
            results = await pool.request()
                .input('categoryName', sql.VarChar, categoryName)
                .input('productName', sql.VarChar, "%" + name + "%")
                .query(sqlQuery);
            res.write("<h1>Products in Category: " + categoryName + "</h1>");
        }else{
            results = await pool.request()
                .input('productName', sql.VarChar, "%" + name + "%")
                .query(sqlQuery);
            res.write("<h1>All Products</h1>");
        }

        
        res.write(`
            <style>
                .product-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                    justify-content: center;
                }
                .product-row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                    justify-content: center;
                }
                .product {
                    text-align: center;
                    border: 1px solid #ccc;
                    padding: 10px;
                    max-width: 200px;
                    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
                    flex: 1 0 calc(25% - 20px); /* Four products per row */
                    margin-bottom: 20px;
                }
                .product img {
                    width: 150px;
                    height: 150px;
                    margin-bottom: 10px;
                }
            </style>
        `);

        res.write("<div class='product-container'>");

        for(let i=0; i<results.recordset.length ; i++){
            let result = results.recordset[i];
            let productId = result.productId;
            let productName = result.productName;
            let productNameURL = encodeURIComponent(productName);
            productNameURL = productNameURL.replace(/'/g/'%27'); 
            let productPrice = result.productPrice;                                                                                                                                                                                                                                                                                                                              
            let categoryname = result.categoryName;
            let categoryColor = getCategoryColor(categoryname);
            let productImageURL = result.productImageURL;
            const addCartLink = 'addcart?id='+productId+'&name='+productNameURL+'&price='+productPrice;
            const productDetail = 'product?id='+productId;

            if(i > 0 && i % 5 == 0){
                res.write("</div>");
                res.write("<div class='product-container'>");
            }
            
            res.write("<div class='product'>");
            res.write("<img src='" + productImageURL + "' alt='" + productName + "'>");
            res.write("<h3>" + productName + "</h3>");
            res.write("<p>Category: " + categoryname + "</p>");
            res.write("<p>Price: $" + parseFloat(productPrice).toFixed(2) + "</p>");
            res.write("<a class = 'add-to-cart' href='" + addCartLink + "'>Add to Cart</a>");
            res.write("<p><a class = 'product-details' href='" + productDetail + "'>Product Details</a></p>");
            res.write("</div>");
        }
        // res.write("<div class='footer'>");
        // res.write("<p>Contact us: example@example.com | Phone: 123-456-7890</p>");
        // res.write("<div class='social-icons'>");
        // res.write("<a href='https://www.instagram.com/' target='_blank'><i class='fab fa-instagram'></i></a>");
        // res.write("<a href='https://www.facebook.com/' target='_blank'><i class='fab fa-facebook'></i></a>");
        // res.write("</div>");
        // res.write("</div>");
        res.end();
    }catch(err){
        console.error(err);
        res.write("An error occured while searching for products !");
        res.end();
    }
    
    

    res.end();
});

function getCategoryColor(categoryName){
    const fontcolor = {
        "Beverages": "blue",
        "Condiments": "green",
        "Confections": "purple",
        "Dairy Products": "orange",
        "Grains/Cereals": "brown",
        "Meat/Poultry": "red",
        "Produce": "teal",
        "Seafood": "navy"
    };

    return fontcolor[categoryName];
}

module.exports = router;
