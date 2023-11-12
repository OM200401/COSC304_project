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
    res.write("<h1 align = \"center\"><font face = \"cursive\" color = \"blue\">T MART </font></h1>")
    res.write("<h2>Browse Products By Category and Search by Product Name:</h1>");
    res.write("<form method=\"get\" action=\"listprod\">");
    res.write("<p align = \"left\">");
    res.write("<select size = \"1\" name = \"categoryName\">");
    res.write("<option>All</option>");
    res.write("<option>Beverages</option>");
    res.write("<option>Condiments</option>");
    res.write("<option>Confections</option>");
    res.write("<option>Dairy Products</option>");
    res.write("<option>Grains/Cereals</option>");
    res.write("<option>Meat/Poultry</option>");
    res.write("<option>Produce</option>");
    res.write("<option>Seafood</option></select>");
    res.write("<input type=\"text\" name=\"productName\" size=\"50\">");
    res.write("<input type=\"submit\" value=\"Submit\">");
    res.write("<input type=\"reset\" value=\"Reset\">");
    res.write("</p></form>");

    // Get the product name to search for
    try{
        let name = req.query.productName;
        let categoryName = req.query.categoryName;
        let pool = await sql.connect(dbConfig);
        sqlQuery = "SELECT p.productId, p.productName, p.productPrice, c.categoryName FROM product p JOIN category c ON p.categoryId = c.categoryID";
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

        
        res.write("<font face = \"Century Gothic\" size = \"2\">");
        res.write("<table style='width: 100%; border-collapse: collapse;'>");
        res.write("<tr><th style='border: 2px solid #ddd; padding: 8px; text-align: left;'></th>");
        res.write("<th style='border: 2px solid #ddd; padding: 8px; text-align: left;'>Product Name</th>");
        res.write("<th style='border: 2px solid #ddd; padding: 8px; text-align: left;'>Category</th>");
        res.write("<th style='border: 2px solid #ddd; padding: 8px; text-align: left;'>Price</th></tr>");
        for(let i=0; i<results.recordset.length ; i++){
            let result = results.recordset[i];
            let productId = result.productId;
            let productName = result.productName;
            let productNameURL = encodeURIComponent(productName);
            let productPrice = result.productPrice;                                                                                                                                                                                                                                                                                                                              
            let categoryname = result.categoryName;
            let categoryColor = getCategoryColor(categoryname);
            const addCartLink = 'addCart?id='+productId+'&name='+productNameURL+'&price='+productPrice;

            res.write("<tr><td style='border: 2px solid #ddd; padding: 8px; color: " + categoryColor + "'><a href='" + addCartLink + "'>Add to Cart</a></td>");
            res.write("<td style='border: 2px solid #ddd; padding: 8px; color: " + categoryColor + ";'>" + productName + "</td>");
            res.write("<td style='border: 2px solid #ddd; padding: 8px; color: " + categoryColor + "'>" + categoryname + "</td>");
            res.write("<td style='border: 2px solid #ddd; padding: 8px; color: " + categoryColor + "'>$" + parseFloat(productPrice).toFixed(2) + "</td></tr>");
            
        }
        res.write("</table></font>");   
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
    // switch(categoryName){
    //     case "Beverages":
    //         return "#FFD700"; 
    //     case "Condiments":
    //         return "#FFA500"; 
    //     case "Confections":
    //         return "#FFC0CB";
    //     case "Dairy Products":
    //         return "#FF69B4";
    //     case "Grains/Cereals":
    //         return "#FF6347";
    //     case "Meat/Poultry":
    //         return "#FF0000";
    //     case "Produce":
    //         return "#FFA500";
    //     case "Seafood":
    //         return "#00FFFF";
    // }
}

module.exports = router;
