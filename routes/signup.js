const express = require('express');
const router = express.Router();
const sql = require('mssql');

// Assuming you have a dbConfig object defined for your database connection

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
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

        const query = `INSERT INTO customer (firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password)
                       VALUES (@firstName, @lastName, @email, @phonenum, @address, @city, @state, @postalCode, @country, @userid, @password)`;

        console.log("Check1");
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
        const fetchedCustomer = await request
            .input('userid', sql.Int, customerId)
            .query(fetchQuery);

        console.log("Check4");
        const customerInfo = fetchedCustomer.recordset[0];

        res.write(`<h2>Customer Info:</h2>`);
        res.write(`<p>ID: ${customerInfo.customerId}</p>`);
        res.write(`<p>First Name: ${customerInfo.firstName}</p>`);
        res.write(`<p>Last Name: ${customerInfo.lastName}</p>`);
        
        res.send('Customer successfully added!');
        res.end();
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
        res.write('<h4><a href="signup">Return to signup page</a></h4>');
        res.end();
    }
});

module.exports = router;
