const express = require('express');
const router = express.Router();
const sql = require('mssql');

// Assuming you have a dbConfig object defined for your database connection

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.write(`<style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        form {
            max-width: 400px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        label {
            display: block;
            font-weight: bold;
            margin-bottom: 5px;
        }

        input[type="text"],
        input[type="password"] {
            width: calc(100% - 10px);
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }

        input[type="submit"] {
            width: 100%;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            background-color: #4CAF50;
            color: white;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s ease;
        }

        input[type="submit"]:hover {
            background-color: #45a049;
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
    
    res.write('<form action="/signup" method="post">');

    res.write('<label for="firstName">First Name:</label><br>');
    res.write('<input type="text" id="firstName" name="firstName"><br>');

    res.write('<label for="lastName">Last Name:</label><br>');
    res.write('<input type="text" id="lastName" name="lastName"><br>');

    res.write('<label for="email">Email:</label><br>');
    res.write('<input type="text" id="email" name="email"><br>');

    res.write('<label for="phonenum">Phone Number:</label><br>');
    res.write('<input type="text" id="phonenum" name="phonenum"><br>');

    res.write('<label for="address">Address:</label><br>');
    res.write('<input type="text" id="address" name="address"><br>');

    res.write('<label for="city">City:</label><br>');
    res.write('<input type="text" id="city" name="city"><br>');

    res.write('<label for="state">State:</label><br>');
    res.write('<input type="text" id="state" name="state"><br>');

    res.write('<label for="postalCode">Postal Code:</label><br>');
    res.write('<input type="text" id="postalCode" name="postalCode"><br>');

    res.write('<label for="country">Country:</label><br>');
    res.write('<input type="text" id="country" name="country"><br>');

    res.write('<label for="userid">Username:</label><br>');
    res.write('<input type="text" id="userid" name="userid"><br>');

    res.write('<label for="password">Password:</label><br>');
    res.write('<input type="password" id="password" name="password"><br>');

    res.write('<input type="submit" value="Submit">');
    res.write('</form>');
    res.end();
});

router.post('/', async function(req, res, next) {
    try {
        const pool = await sql.connect(dbConfig);

        const {
            firstName,
            lastName,
            email,
            phonenum,
            address,
            city,
            state,
            postalCode,
            country,
            userid,
            password
        } = req.body;

        const query = `INSERT INTO customer (firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password) OUTPUT INSERTED.customerId VALUES (@firstName, @lastName, @email, @phonenum, @address, @city, @state, @postalCode, @country, @userid, @password)`;

        console.log("Check1");
        console.log(req.body);
        let selectQuery = "SELECT * FROM customer WHERE userid = @userid";
        let results = await pool.request()
            .input('userid', sql.VarChar(50), req.body.userid)
            .query(selectQuery);
          
        if(results.recordset.length > 0)
            throw new Error('User with this ID already exists');

        console.log("Check2");
        const customer = await pool.request()
            .input('firstName', sql.VarChar(40), firstName)
            .input('lastName', sql.VarChar(40), lastName)
            .input('email', sql.VarChar(50), email)
            .input('phonenum', sql.VarChar(20), phonenum)
            .input('address', sql.VarChar(50), address)
            .input('city', sql.VarChar(40), city)
            .input('state', sql.VarChar(20), state)
            .input('postalCode', sql.VarChar(20), postalCode)
            .input('country', sql.VarChar(40), country)
            .input('userid', sql.VarChar(20), userid)
            .input('password', sql.VarChar(30), password)
            .query(query);
        
        console.log(customer.recordset);
        const customerId = customer.recordset[0].userid;
        console.log("Check3");

        const fetchQuery = `SELECT * FROM customer WHERE userid = @userid;`;
        const fetchedCustomer = await pool.request()
            .input('userid', sql.VarChar(20), req.body.userid)
            .query(fetchQuery);

        console.log("Check4");
        const customerInfo = fetchedCustomer.recordset[0];

        console.log(`<h2>Customer Info:</h2>`);
        console.log(`<p>ID: ${customerInfo.customerId}</p>`);
        console.log(`<p>First Name: ${customerInfo.firstName}</p>`);
        console.log(`<p>Last Name: ${customerInfo.lastName}</p>`);
        console.log('Customer successfully added!');

        res.send(200);
    } catch (err) {
        console.error(err);
        res.write(err.message);
        res.send(500);
    }
});

module.exports = router;
