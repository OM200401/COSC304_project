const express = require('express');
const router = express.Router();
const sql = require('mssql');


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
    res.write("<title>YOUR NAME Grocery</title>")
    res.write("<h1>Search for the Products you want to buy:</h1>");
    res.write('<form method="get" action="listprod">');
    res.write('Product name: <input type="text" name="productName" size="25">');
    res.write('<input type="submit" value="Submit">');
    res.write('<input type="reset" value="Reset">');
    res.write("(Leave blank for all products)");
    res.write('</form>  ');

    // Get the product name to search for
    try{
        let name = req.query.productName;
        let pool = await sql.connect(dbConfig);
        sqlQuery = "SELECT productId, productName, productPrice FROM product";
        let results = null;

        if(name){
            sqlQuery += " WHERE productName LIKE @productName";
            results = await pool.request().input('productName',sql.VarChar,"%"+name+"%").query(sqlQuery);
        }else{
            results = await pool.request().query(sqlQuery);
        }

        res.write("<h1>All Products</h1>");
        res.write("<table><tr><th>Product Name</th><th>Price</th></tr>");
        for(let i=0; i<results.recordset.length ; i++){
            let result = results.recordset[i];
            let productId = result.productId;
            let productName = result.productName;
            let productPrice = result.productPrice;
            const addCartLink = 'addCart?id='+productId+'&name='+productName+'&price='+productPrice;
            res.write('<tr><td><a href='+addCartLink+'>Add to Cart</a></td><td>'+productName+'</td><td>$'+parseFloat(productPrice).toFixed(2)+'</td></tr>');
        }
        res.write("</table>");
        res.end();
    }catch(err){
        console.error(err);
        res.write("An error occured while searching for products !");
        res.end();
    }
    

    res.end();
});

module.exports = router;
