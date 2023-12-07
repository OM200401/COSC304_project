const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');


router.get('/', async function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<title>Order Summary</title>");
    res.write(`<style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #aef280; 
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
                h2 {
                    margin-top: 20px;
                    text-align: center;
                }
        
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
        
                table, th, td {
                    border: 1px solid #ddd;
                }
        
                th, td {
                    padding: 10px;
                    text-align: left;
                }
        
                th {
                    background-color: #f2f2f2;
                }
        
                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
        
                button {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    background-color: #007bff;
                    color: white;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
        
                button a {
                    text-decoration: none;
                    color: white;
                }
        
                button:hover {
                    background-color: #0056b3;
                }
            </style>`);

    
    res.write("<header>");
    res.write("<h1>S MART</h1>");
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
        let pool = await sql.connect(dbConfig);
        let customerId = req.query.customerId;
        let password = req.query.password;
        let validateQuery = "SELECT * FROM customer where customerId = @customerId and password = @password";
        let validateResult = await pool.request()
        .input('customerId',sql.Int, customerId)
        .input('password',sql.VarChar, password)
        .query(validateQuery);

        if(validateResult.recordset.length === 0){
            res.write("<h1 align = \"center\"><font face = \"cursive\" color = \"#3399FF\">S MART</font></h1>");
            res.write("<hr>The password you entered was incorrect. Please go back and try again !</hr>")
            res.end();
            return;
        }

        let custName = validateResult.recordset[0].firstName+" "+validateResult.recordset[0].lastName;

        if(!customerId){
            res.write("<h1>Invalid Customer ID</h1>");
            res.end();
            return;
        }
        if(!productList){
            res.write("<h1>Shopping Cart is empty</h1>");
            res.end();
            return;a
        }
        let totalprice = 0;
        for(let i=0; i<productList.length; i++){
            let product = productList[i];
            if(!product){
                continue;
            }
            if(!product.id || !product.name || !product.price || !product.quantity){
                res.write("<h1>Invalid Product Information</h1>");
                res.end();
                return;
            }
            totalprice += product.price*product.quantity;
        }
        let orderId = await saveorders(moment().format("YYYY-MM-DD HH:mm:ss"), customerId, totalprice);
        for(let i=0; i<productList.length; i++){
            let product = productList[i];
            if(!product){
                continue;
            }
            await saveorderproduct(orderId, product);
        }
        await printordersummary(orderId);
        res.write("<h1>Shipping to Customer: "+customerId+"</h1>");
        res.write("<h1>Customer Name: "+custName+"</h1>");
        res.write("<h2><a href = \"/\">Back to Main Page</a></h2>")

    }catch(err){
        console.error(err);
    }

    /** Make connection and validate **/

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
    async function saveorders(orderDate, customerId, total){
        try{
            let pool = await sql.connect(dbConfig);
            let sqlQuery = "INSERT INTO ordersummary (orderDate, customerId, totalAmount) OUTPUT INSERTED.orderId VALUES(@orderDate, @customerId, @totalAmount)";
            let result = await pool.request()
                .input('orderDate',sql.DateTime, moment().format("YYYY-MM-DD HH:mm:ss"))
                .input('customerId',sql.Int, customerId)
                .input('totalAmount',sql.Decimal, total)
                .query(sqlQuery);
            
            return result.recordset[0].orderId;
        }catch(err){
            console.error(err);
        }
    }
    
    /** Insert each item into OrderedProduct table using OrderId from previous INSERT **/
    async function saveorderproduct(orderId, product){
        try{
            let pool = await sql.connect(dbConfig);
            let sqlQuery = "INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES(@orderId, @productId, @quantity, @price)";
            let result = await pool.request()
                .input('orderId',sql.Int, orderId)
                .input('productId',sql.Int, product.id)
                .input('quantity',sql.Int, product.quantity)
                .input('price',sql.Decimal, product.price)
                .query(sqlQuery);
        }catch(err){
            console.error(err);
        }
    }

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

    async function printordersummary(orderId){
        try{
            let pool = await sql.connect(dbConfig);
            let total = 0;
            let sqlQuery = "SELECT op.productId, p.productName, op.quantity, op.price FROM orderproduct op JOIN product p ON op.productId = p.productId WHERE orderId = @orderId";
            let result = await pool.request()
                .input('orderId',sql.Int, orderId)
                .query(sqlQuery);
            res.write("<h1>Your Order Summary</h1>");
            res.write("<table><tr><th>Product Id</th><th>Product Name</th><th>Quantity</th><th>Price</th><th>SubTotal</th></tr>");
            for(let i=0; i<result.recordset.length; i++){
                let resultset = result.recordset[i];
                let productId = resultset.productId;
                let productName = resultset.productName;
                let quantity = resultset.quantity;
                let price = resultset.price;
                let subtotal = quantity * price;
                res.write("<tr><td>"+productId+"</td><td>"+productName+"</td><td align=\"center\">"+quantity+"</td><td align=\"right\">$"+price.toFixed(2)+"</td><td align=\"right\">$"+subtotal.toFixed(2)+"</td></tr>");
                total = subtotal + total;
            }
            res.write("</table>");
            res.write("<tr><td colspan = \"4\" align = \"right\"><b>Order Total: </b><td align=\"right\">$" + total.toFixed(2)+"</td></tr>");
            res.write("<h1>Order Completed! Will be shipped soon...</h1>");
            res.write("<h1>Your Order Reference number is 1519")
        }catch(err){
            console.error(err);
        }
    }

    /** Clear session/cart **/
    req.session.productList = [];
    

    res.end();
});

module.exports = router;
