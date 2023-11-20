const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    (async function() {
        try {
            let pool = await sql.connect(dbConfig);
	        // Get product name to search for
	        // TODO: Retrieve and display info for the product
            Id = req.query.id;
            sqlQuery = "SELECT * FROM product WHERE productId = @productId";
            let results = await pool.request()
                .input('productId', sql.Int, Id)
                .query(sqlQuery);
            let product = results.recordset[0];
            let productId = product.productId;
            let productName = product.productName;
            let productNameURL = encodeURIComponent(productName);
            productNameURL = productNameURL.replace(/'/g,'%27');
            let productPrice = product.productPrice; 
            res.write("<h1 align='center'><font face = 'cursive' color='blue'><a href = '/'>T-MART</a></font></h1>");
            res.write("<h2>" + productName + "</h2>");

            // TODO: If there is a productImageURL, display using IMG tag
            // TODO: Retrieve any image stored directly in database. Note: Call displayImage.jsp with product id as parameter.
            res.write("<img src = '"+product.productImageURL+"'>");
            res.write("<img src = 'displayImage?id="+productId+"'>");
            res.write("<table>");
            res.write("<tr><th>Id</th><td>"+productId+"</td></tr>");
            res.write("<tr><th>Price</th><td> $"+productPrice+"</td></tr>");
            res.write("</table>");

            // TODO: Add links to Add to Cart and Continue Shopping
            
            res.write("<h3><a href = 'addCart?id="+productId+"&name="+productNameURL+"&price="+productPrice+"'>Add to Cart</a></h3>");
            res.write("<h3><a href = 'listprod'>Continue Shopping</a></h3>");

            res.end()
        } catch(err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
});

module.exports = router;
