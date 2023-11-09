const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');
const app = express();

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');

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

    (async function() {
        try {
            let pool = await sql.connect(dbConfig);

            res.write('<h1>Oms Grocery Order List</h1>');
            
            let sqlQuery = "SELECT o.orderID, o.orderDate, o.customerId, c.firstName, c.lastName, o.totalAmount"
            + " FROM ordersummary o JOIN customer c ON c.customerId = o.customerId";   
            // let sqlQuery = "SELECT o.orderID, o.orderDate, o.customerId, c.firstName, c.lastName,o.totalAmount, op.productId, op.quantity, op.price"
            // + " FROM customer c JOIN ordersummary o ON c.customerId = o.customerId JOIN orderproduct op ON o.orderId = op.orderId";  
            let results = await pool.request()
                .query(sqlQuery);
            
            res.write("<table border=1><tr><th>Order ID</th><th>Order Date</th><th>Customer ID</th><th>Customer Name</th><th>Total Amount</th></tr>");

            for (let i = 0; i < results.recordset.length; i++) {
                let result = results.recordset[i];
                let num = result.totalAmount;
                num = num.toFixed(2);

                res.write("<tr><td>" + result.orderID + 
<<<<<<< HEAD
                "</td><td>" + moment(result.orderDate).format("YYYY-MM-DD HH:mm:ss") + 
                "</td><td>" + result.customerId + 
                "</td><td>" + result.firstName + " " + result.lastName + 
                "</td><td>" + result.totalAmount + "</td></tr>");
                res.write("<table><tr><th>Product ID</th><th>Quantity</th><th>Price</th></tr>");
                res.write("<tr><td>"+ result.orderID+
                "</td><td>"+ result.quantity+
                "</td><td>"+ result.price.toFixed(2)+"</td></tr></table>") 
=======
                        "</td><td>" + moment(result.orderDate).format("YYYY-MM-DD HH:mm:ss") + 
                        "</td><td>" + result.customerId + 
                        "</td><td>" + result.firstName + " " + result.lastName + 
                        "</td><td>" + "$" + num + "</td></tr>");

                let innerResults = await pool.request()
                                            .input('orderId', sql.Int, result.orderID)
                                            .query("SELECT op.productId, op.quantity, op.price FROM orderproduct op JOIN ordersummary o ON o.orderId = op.orderId WHERE o.orderId = @orderId")

                res.write("<tr align=\"right\"> <td colspan=4> <table border=1> <tbody>");
                res.write("<tr><th>Product ID</th><th>Quantity</th><th>Price</th></tr>");

                for(let j = 0; j < innerResults.recordset.length; j++){
                    let innerResult = innerResults.recordset[j];
                    res.write("<tr><td>" + innerResult.productId + "</td>" +
                              "<td>" + innerResult.quantity + "</td>" +
                              "<td>" + "$" + innerResult.price.toFixed(2) + "</td></tr>") 
                }
                res.write("</tbody></table></td></tr>");
>>>>>>> 0678c780c880cda523a3f16f5bef7a7df3ef5eed
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

