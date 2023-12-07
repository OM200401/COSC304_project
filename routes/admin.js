const express = require('express');
const router = express.Router();
const moment = require('moment');
const auth = require('../auth');
const sql = require('mssql');

router.get('/', auth.checkAuthentication, function(req, res, next) {
    
    res.setHeader('Content-Type', 'text/html');
    res.write(`<style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
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
            color: #333;
            margin-top: 20px;
            font-family: 'Arial Black', sans-serif;
        }

        h3 {
            color: #333;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .table th,
        .table td {
            padding: 8px;
            border: 1px solid #ddd;
        }

        .table th {
            background-color: #f2f2f2;
            font-weight: bold;
            text-align: left;
        }

        .table tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        a {
            display: block;
            margin-bottom: 10px;
            color: #007bff;
            text-decoration: none;
        }
        </style>`);

    res.write("<header>");
    res.write("<h1>T MART</h1>");
    res.write("<nav>");
    res.write("<a href=\"/\">HOME</a>");
    res.write("<a href = '/listprod'>SHOP PRODUCTS</a>");
    res.write("<a href=\"/showcart\">CART</a>");
    res.write("<a href=\"/listorder\">ORDERS</a>");
    res.write("<a href=\"/admin\">ADMIN</a>");
    res.write("<a href=\"/customer\">CUSTOMERS</a>");

    if(req.session.authenticatedUser && req.session.userid) {
        res.write("<span>Welcome, " + req.session.userid + "!</span>");
        res.write("<a href=\"/logout\">Logout</a>");
    } else {
        res.write("<a href=\"/login\">LOGIN</a>");
    }
    res.write("</nav>");
    res.write("</header>");
    res.write("</div>");

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

            res.write("<a href='/addproduct'>Add Product</a>");
            res.write("<a href='/updateproduct'>Update Product</a>");
            
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