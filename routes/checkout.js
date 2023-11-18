const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<title>Grocery CheckOut Line</title>");

    res.write("<h1>Enter your customer id and password to complete the transaction:</h1>");
    res.write('<form method="get" action="order"><table>');
    res.write('<tr><td>Customer ID</td><td><input type="text" name="customerId" size="20"</td></tr>');
    res.write('<tr><td>Password: </td><td><input type="password" name="password" size="20"</td></tr>');
    res.write('<tr><td><input type="submit" value="Submit"></td><td><input type="reset" value="Reset"></td></tr>');
    res.write('</table></form>');

    res.end();
});

module.exports = router;
