const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');

    (async function() {
        try {
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
                h1{
                    text-align: center;
                    color: #fbfcfa;
                    margin-top: 20px;
                    font-family: 'Arial Black', sans-serif;
                }
                </style>`);

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

            res.write("<header><h1><font face = 'cursive'>T-MART</font></h1>");
            res.write("<nav>");
            res.write("<a href=\"/\">HOME</a>");
            res.write("<a href=\"/showcart\">CART</a>");
            res.write("<a href=\"/listorder\">ORDERS</a>");
            res.write("<a href=\"/login\">LOGIN</a>");
            res.write("</nav></header>");
            res.write("<h2 align = 'center'>" + productName + "</h2>");

            // TODO: If there is a productImageURL, display using IMG tag
            // TODO: Retrieve any image stored directly in database. Note: Call displayImage.jsp with product id as parameter.
            res.write("<img align = 'center' src = '"+product.productImageURL+"'>");
            res.write("<img align = 'center' src = 'displayImage?id="+productId+"'>");
            res.write("<table>");
            res.write("<tr><th>Id</th><td>"+productId+"</td></tr>");
            res.write("<tr><th>Price</th><td> $"+productPrice+"</td></tr>");
            // Displaying item inventory by warehouse
            let warehouseinv = `SELECT * FROM productinventory WHERE productId = @productId`;
            let results2 = await pool.request()
                .input('productId', sql.Int, productId)
                .query(warehouseinv);

            let inventory = results2.recordset;
            for(let i = 0; i < inventory.length; i++){
                let inv = inventory[i];
                res.write("<tr><th>Warehouse ID: </th><td>"+inv.warehouseId+"</td></tr>");
                res.write("<th> Quanity in warehouse: </th><td>"+inv.quantity+"</td></tr>");
            }

            res.write("</table>");

            // TODO: Add links to Add to Cart and Continue Shopping
            
            res.write("<h3><a href = 'addCart?id="+productId+"&name="+productNameURL+"&price="+productPrice+"'>Add to Cart</a></h3>");
            res.write("<h3><a href = 'listprod'>Continue Shopping</a></h3>");

            // Reviews section 
            res.write(`<style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f0f0f0; /* Light gray background */
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
            h1 {
                text-align: center;
                color: #fbfcfa;
                margin-top: 20px;
                font-family: 'Arial Black', sans-serif;
            }
            .review-form {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-top: 20px;
            }
            .review-form label {
                margin-bottom: 10px;
                font-weight: bold;
            }
            .review-form textarea,
            .review-form input[type='number'] {
                padding: 8px;
                margin-bottom: 15px;
                border: 1px solid #58a641;
                border-radius: 5px;
                width: calc(50% - 10px);
                box-sizing: border-box;
            }
            .review-form input[type='submit'] {
                padding: 8px 20px;
                margin-bottom: 15px;
                border: none;
                border-radius: 5px;
                background-color: #58a641;
                color: #fff;
                font-weight: bold;
                cursor: pointer;
                width: calc(50% - 10px);
                box-sizing: border-box;
            }
            .review {
                background-color: #fff;
                border: 1px solid #58a641;
                border-radius: 5px;
                padding: 10px;
                margin-top: 10px;
                max-width: 80%;
            }
            .review p {
                margin: 5px 0;
            }
            </style>`);
            
            res.write("<h2 align = 'center'>Reviews</h2>");
            res.write("<form class = 'review-form' action = '/addreview/"+productId+"' method = 'post'>");
            res.write("<input type = 'hidden' name = 'id' value = '"+productId+"'>");
            res.write("<label for = 'stars'>Stars (out of 5): </label>");
            res.write("<input type='number' name='stars' id='stars' min='1' max='5' required>");
            res.write("<label for = 'comment'>Comment: </label>");
            res.write("<textarea name='comment' id='comment' required></textarea>");
            res.write("<input type = 'submit' value = 'Submit Review'>")
            res.write("</form>");
            res.write("<div class = 'reviews'>");
            //display existing reviews here from the database
            let sqlQuery1 = `SELECT * FROM review WHERE productId = @productId`;
            let results1 = await pool.request()
                .input('productId', sql.Int, Id)
                .query(sqlQuery1);
            let reviews = results1.recordset;
            for(let i = 0; i < reviews.length; i++){
                let review = reviews[i];
                res.write("<div class = 'review'>");
                res.write("<p><strong>Stars: </strong>"+review.reviewRating+"</p>");
                res.write("<p><string>Comment: </strong>"+review.reviewComment+"</p>");
                res.write("</div>");
            }
            res.write("</div>");
            res.end();
        } catch(err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
});


module.exports = router;
