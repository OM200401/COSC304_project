const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');
const app = express();

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
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
        .add-to-cart, .product-details {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 10px;
            text-decoration: none;
            color: white;
            border-radius: 5px;
            transition: all 0.3s ease;
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
    /** Create connection, and validate that it connected successfully **/

    /**
    Useful code for formatting currency:
        let num = 2.87879778;
        num = num.toFixed(2);
    **/

    /** Write query to retrieve all order headers **/

    /** For each order in the results
            Print out the order header information
            Write a query to retrieve the products in the order

            For each product in the order
                Write out product information 
    **/
    res.write(`
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f2f2f2;
                margin: 0;
                padding: 20px;
            }
            h1 {
                text-align: center;
                color: #333;
                margin-bottom: 20px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
            }
            th, td {
                border: 1px solid #ccc;
                padding: 8px;
                text-align: left;
            }
            th {
                background-color: #f5f5f5;
            }
            .inner-table {
                width: 100%;
                border-collapse: collapse;
            }
            .inner-table th, .inner-table td {
                border: 1px solid #ccc;
                padding: 8px;
                text-align: left;
            }
            .inner-table th {
                background-color: #e5e5e5;
            }
            tr:nth-child(even) {
                background-color: #f9f9f9;
            }
            tr:hover {
                background-color: #eaeaea;
            }
        </style>
`   );

    (async function() {
        try {
            let pool = await sql.connect(dbConfig);

            res.write('<h1> Grocery Order List</h1>');
            
            let sqlQuery = "SELECT o.orderID, o.orderDate, o.customerId, c.firstName, c.lastName, o.totalAmount"
            + " FROM ordersummary o JOIN customer c ON c.customerId = o.customerId";     
            let results = await pool.request()
                .query(sqlQuery);
            
            res.write("<table class=\"table\" border=\"1\"><tr><th>Order ID</th><th>Order Date</th><th>Customer ID</th><th>Customer Name</th><th>Total Amount</th></tr>");

            for (let i = 0; i < results.recordset.length; i++) {
                let result = results.recordset[i];
                let num = result.totalAmount;
                num = num.toFixed(2);

                res.write("<tr><td>" + result.orderID + 
                        "</td><td>" + moment(result.orderDate).format("YYYY-MM-DD HH:mm:ss") + 
                        "</td><td>" + result.customerId + 
                        "</td><td>" + result.firstName + " " + result.lastName + 
                        "</td><td>" + "$" + num + "</td></tr>");

                let innerResults = await pool.request()
                                            .input('orderId', sql.Int, result.orderID)
                                            .query("SELECT op.productId, op.quantity, op.price FROM orderproduct op JOIN ordersummary o ON o.orderId = op.orderId WHERE o.orderId = @orderId")

                res.write("<tr align=\"right\"> <td colspan=\"4\"> <table class=\"table\" border=\"1\"> <tbody>");
                res.write("<tr><th>Product ID</th><th>Quantity</th><th>Price</th></tr>");

                for(let j = 0; j < innerResults.recordset.length; j++){
                    let innerResult = innerResults.recordset[j];
                    res.write("<tr><td>" + innerResult.productId + "</td>" +
                              "<td>" + innerResult.quantity + "</td>" +
                              "<td>" + "$" + innerResult.price.toFixed(2) + "</td></tr>") 
                }
                res.write("</tbody></table></td></tr>");
            }
            res.write("</table>");
            res.end();
        } catch(err) {
            console.dir(err);
            res.write(JSON.stringify(err));
            res.end();
        }
    })();

});

module.exports = router;

