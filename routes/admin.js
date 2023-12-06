const express = require('express');
const router = express.Router();
const moment = require('moment');
const auth = require('../auth');
const sql = require('mssql');

router.get('/', auth.checkAuthentication, function(req, res, next) {
    
    res.setHeader('Content-Type', 'text/html');

    (async function() {
        try {
            res.write('<h3>Admin Sales Report by Day</h3>');

            let pool = await sql.connect(dbConfig);

            let sqlQuery = "SELECT CONVERT(date, orderDate) AS orderDay, sum(totalAmount) as total FROM orderSummary GROUP BY CONVERT(date,orderDate)";
            
            let results = await pool.request().query(sqlQuery);

            res.write("<table class=\"table\" border=\"1\"><tr><th>Order Date</th><th> Total Order Amount</th></tr>");

            for (let i = 0; i < results.recordset.length; i++) {
                let result = results.recordset[i];
                // console.log(result);

                res.write("</td><td>" + moment(result.orderDay).format("YYYY-MM-DD") + 
                          "</td><td>" + "$" + result.total.toFixed(2) + "</td></tr>");
            }
            res.write("</table>");

            res.write("<h3> Customers in Database</h3>");
            let customers = "SELECT * FROM customer";
            let customersResults = await pool.request().query(customers);
            res.write(`<table class=\"table\" border=\"1\"><tr><th>Customer ID</th><th>Customer Name</th><th>Customer Email</th><th>Phone Number</th>
            <th> Address</th><th> City</th><th>State</th><th>Postal Code</th><th>Country</th></tr>`);
            for (let i = 0; i < customersResults.recordset.length; i++) {
                let result = customersResults.recordset[i];
                customerName = result.firstName+" "+result.lastName;

                res.write("</td><td>" + result.customerId + 
                          "</td><td>" + customerName + "</td><td>" + result.email + "</td><td>" + result.phonenum + 
                          "</td><td>" + result.address + "</td><td>" + result.city + "</td><td>" + result.state + 
                          "</td><td>" + result.postalCode + "</td><td>" + result.country + "</td></tr>");
            }
            res.end();
        } catch(err) {
            console.dir(err);
            res.write(err + "");
            res.end();
        }
    })();
});

module.exports = router;