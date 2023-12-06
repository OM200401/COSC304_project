const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');
const auth = require('../auth');

router.get('/', auth.checkAuthentication, function(req, res, next) {

    res.setHeader('Content-Type', 'text/html');

    (async function() {
        try {
            let pool = await sql.connect(dbConfig);

            res.write('<h3>Customer Profile</h3>');
            
            let sqlQuery = "SELECT customerId, firstName, lastName, email, phonenum, address, city, state, " +               
               "postalCode, country, userid FROM customer WHERE userid = @userId";   

            let customerInfo = await pool.request()
                                   .input('userid', sql.VarChar, req.session.userid)
                                   .query(sqlQuery);

            res.write("<table class=\"table\" border=\"1\">");

            res.write("<tr><td> ID </td><td>" + customerInfo.recordset[0].customerId + "</td></tr>" +
                      "<tr><td> First Name </td><td>" + customerInfo.recordset[0].firstName + "</td></tr>" +   
                      "<tr><td> Last Name </td><td>" + customerInfo.recordset[0].lastName + "</td></tr>" + 
                      "<tr><td> Email </td><td>" + customerInfo.recordset[0].email + "</td></tr>" + 
                      "<tr><td> Phone </td><td>" + customerInfo.recordset[0].phonenum + "</td></tr>" + 
                      "<tr><td> Address </td><td>" + customerInfo.recordset[0].address + "</td></tr>" + 
                      "<tr><td> City </td><td>" + customerInfo.recordset[0].city + "</td></tr>" + 
                      "<tr><td> State </td><td>" + customerInfo.recordset[0].state + "</td></tr>" + 
                      "<tr><td> Postal Code </td><td>" + customerInfo.recordset[0].postalCode + "</td></tr>" + 
                      "<tr><td> Country </td><td>" + customerInfo.recordset[0].country + "</td></tr>" + 
                      "<tr><td> User ID </td><td>" + customerInfo.recordset[0].userid + "</td></tr>");

            res.write("</table>");
            
            res.write(`<h3>Orders for ${customerInfo.recordset[0].firstName+" "+customerInfo.recordset[0].lastName} </h3>`);

            let orders = "SELECT o.orderID, o.orderDate, o.customerId, c.firstName, c.lastName, o.totalAmount"
            + " FROM ordersummary o JOIN customer c ON c.customerId = o.customerId WHERE o.customerId = @customerId";
            let results = await pool.request()
                .input("customerId", sql.Int, customerInfo.recordset[0].customerId)
                .query(orders);
                
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

            res.write(`<table class = 'table' corder = '1'>`);

            res.end();

        } catch(err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
});

module.exports = router;
