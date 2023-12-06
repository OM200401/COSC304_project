const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<title>Grocery CheckOut Line</title>");
    res.write(`<style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
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
        .search-bar {
            text-align: center;
            margin-top: 20px;
        }
        h1{
            text-align: center;
            color: #fbfcfa;
            margin-top: 20px;
            font-family: 'Arial Black', sans-serif;
        }
        .search-bar select, .search-bar input[type='text'] {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-right: 10px;
        }
        .search-bar input[type='submit'], .search-bar input[type='reset'] {
            padding: 8px 16px;
            border: none;
            border-radius: 5px;
            background-color: #4CAF50;
            color: white;
            cursor: pointer;
        }
        .search-bar input[type='submit']:hover, .search-bar input[type='reset']:hover {
            background-color: #45a049;
        }
        .add-to-cart, .product-details {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 10px;
            text-decoration: none;
            color: white;
            border-radius: 5px;
            transition: all 0.3s ease;
        }
    </style>`);


    res.write("<header>");
    res.write("<h1>T MART</h1>");
    res.write("<nav>");
    res.write("<a href=\"/\">HOME</a>");
    res.write("<a href=\"/showcart\">CART</a>");
    res.write("<a href=\"/listorder\">ORDERS</a>");
    if(req.session.authenticatedUser && req.session.userid) {
        res.write("<span>Welcome, " + req.session.userid + "!</span>");
        res.write("<a href=\"/logout\">Logout</a>");
    } else {
        res.write("<a href=\"/login\">LOGIN</a>");
    }
    res.write("</nav>");
    res.write("</header>");
    res.write("<style>");
    res.write("body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }");
    res.write("h1 { text-align: center; color: #333; }");
    res.write("form { width: 50%; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }");
    res.write("table { width: 100%; }");
    res.write("table tr { margin-bottom: 15px; }");
    res.write("table td { padding: 5px; }");
    res.write("input[type='text'], input[type='password'] { width: calc(100% - 10px); padding: 8px; border: 1px solid #ccc; border-radius: 5px; }");
    res.write("input[type='submit'], input[type='reset'] { padding: 8px 16px; border: none; border-radius: 5px; background-color: #4CAF50; color: white; cursor: pointer; }");
    res.write("input[type='submit']:hover, input[type='reset']:hover { background-color: #45a049; }");
    res.write("</style>");

    res.write("<h1>Enter your customer ID and password to complete the transaction:</h1>");
    res.write('<form method="get" action="order"><table>');
    res.write('<tr><td>Customer ID:</td><td><input type="text" name="customerId"></td></tr>');
    res.write('<tr><td>Password:</td><td><input type="password" name="password"></td></tr>');
    res.write('<tr><td><input type="submit" value="Submit"></td><td><input type="reset" value="Reset"></td></tr>');
    res.write('</table></form>');

    res.end();
});

module.exports = router;
