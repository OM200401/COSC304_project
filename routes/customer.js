const express = require('express');
const router = express.Router();
const sql = require('mssql');
const auth = require('../auth');

router.get('/', function(req, res, next) {

    res.setHeader('Content-Type', 'text/html');

    (async function() {
        try {
            let pool = await sql.connect(dbConfig);

            res.write('<h3>Customer Profile</h3>');
            
            let sqlQuery = "SELECT customerId, firstName, lastName, email, phonenum, address, city, state, " +                  "postalCode, country, userid FROM customer WHERE userid = @username";   

            console.log(req.query.username);

            let customerInfo = await pool.request()
                                   .input('username', sql.VarChar, "arnold")
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
                      "<tr><td> User ID </td><td>" + customerInfo.recordset[0].userId + "</td></tr>");

            res.write("</table>");
            res.end();

        } catch(err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
});

module.exports = router;
