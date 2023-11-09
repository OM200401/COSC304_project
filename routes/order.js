const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<title>YOUR NAME Grocery Order Processing</title>");

    let productList = false;
    if (req.session.productList && req.session.productList.length > 0) {
        productList = req.session.productList;
    }

    /**
    Determine if valid customer id was entered
    Determine if there are products in the shopping cart
    If either are not true, display an error message
    **/
    try{
        let customerId = req.query.customerId;
        if(!customerId){
            res.write("<h1>Invalid Customer ID</h1>");
            res.end();
            return;
        }
        if(!productList){
            res.write("<h1>Shopping Cart is empty</h1>");
            res.end();
            return;
        }
    }catch(err){
        console.error(err);
    }

    /** Make connection and validate **/
    async function connect(){
        try{
            let pool = await sql.connect(dbConfig);
        }catch(err){
            console.error(err);
        }
    }

    /** Save order information to database**/


        /**
        // Use retrieval of auto-generated keys.
        sqlQuery = "INSERT INTO <TABLE> OUTPUT INSERTED.orderId VALUES( ... )";
        let result = await pool.request()
            .input(...)
            .query(sqlQuery);
        // Catch errors generated by the query
        let orderId = result.recordset[0].orderId;
        **/
    async function saveorders(){
        try{
            let sqlQuery = "INSERT INTO ordersummary (orderDate, customerId, totalAmount) OUTPUT INSERTED.orderId VALUES(@orderDate, @customerId, @totalAmount)";
            let result = await pool.request()
                .input('orderDate',sql.DateTime, moment().format("YYYY-MM-DD HH:mm:ss"))
                .input('customerId',sql.Int, customerId)
                .input('totalAmount',sql.Decimal, total)
                .query(sqlQuery);
            let orderId = result.recordset[0].orderId;
        }catch(err){
            console.error(err);
        }
    }
    
    /** Insert each item into OrderedProduct table using OrderId from previous INSERT **/

    /** Update total amount for order record **/

    /** For each entry in the productList is an array with key values: id, name, quantity, price **/

    /**
        for (let i = 0; i < productList.length; i++) {
            let product = products[i];
            if (!product) {
                continue;
            }
            // Use product.id, product.name, product.quantity, and product.price here
        }
    **/

    /** Print out order summary **/

    /** Clear session/cart **/

    res.end();
});

module.exports = router;