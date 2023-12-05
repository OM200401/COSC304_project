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
            text-align: center;
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
        h1_1{
            text-align: center;
            color: #fbfcfa;
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
    </style>`);


    res.write("<header>");
    res.write("<h1_1>T MART</h1_1>");
    res.write("<nav>");
    res.write("<a href=\"/\">HOME</a>");
    res.write("<a href=\"/showcart\">CART</a>");
    res.write("<a href=\"/listorder\">ORDERS</a>");
    res.write("<a href=\"/login\">LOGIN</a>");
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
                .product {
                    text-align: center;
                    border: 1px solid #ccc;
                    padding: 10px;
                    max-width: 200px;
                    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
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
            const addCartLink = 'addCart?id='+productId+'&name='+productNameURL+'&price='+productPrice;
            const productDetail = 'product?id='+productId;
            
            res.write("<div class='product'>");
            res.write("<img src='" + productImageURL + "' alt='" + productName + "'>");
            res.write("<h3>" + productName + "</h3>");
            res.write("<p>Category: " + categoryname + "</p>");
            res.write("<p>Price: $" + parseFloat(productPrice).toFixed(2) + "</p>");
            res.write("<a href='" + addCartLink + "'>Add to Cart</a>");
            res.write("<p><a href='" + productDetail + "'>Product Details</a></p>");
            res.write("</div>");
        }
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
