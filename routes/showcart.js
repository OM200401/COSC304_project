const express = require('express');
const router = express.Router();

function update(prodID, newQty){
    if(newQty == 0){
        delete req.session.productList[prodID];
    }
    else{
        req.session.productList[prodID].quantity = newQty;
    }
}

router.get('/delete/:id', function(req, res) {
    const prodID = req.params.id;
    // console.log(req.session.productList);
    // Call your delete function here
    delete req.session.productList[prodID];

    productList = req.session.productList;
    productList.filter(item => item && item.id !== prodID);
    req.session.productList = productList
    res.end();
    // res.redirect('/showcart');
});

router.get('/', function (req, res, next) {
    let productList = false;
    res.setHeader('Content-Type', 'text/html');
    res.write("<title>T MART</title>");

    res.write(`<style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
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
        h1 {
            text-align: center;
            color: #333;
            margin-top: 20px;
            font-family: 'Arial Black', sans-serif;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .update-input {
            width: 50px;
            text-align: center;
        }
        a {
            text-decoration: none;
            color: #333;
        }
        a:hover {
            color: #000;
        }
        .checkout-link {
            text-align: center;
            margin-top: 20px;
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

    res.write("<script>");
    res.write("function updateQuantity(prodID, newQty) {");
    res.write("  var xhr = new XMLHttpRequest();");
    res.write("  xhr.open('POST', '/updateQuantity', true);");
    res.write("  xhr.setRequestHeader('Content-Type', 'application/json');");
    res.write("  xhr.send(JSON.stringify({ prodID: prodID, newQty: newQty }));");
    res.write("}");
    res.write("</script>");

    if (req.session.productList) {
        productList = req.session.productList;  

        res.write("<form name=shoppingForm method='post' action='/showcart'>");
        res.write("<h1>Your Shopping Cart</h1>");
        res.write("<table><tr><th>Product Id</th><th>Product Name</th><th>Quantity</th>");
        res.write("<th>Price</th><th>Subtotal</th><th></th><th></th></tr>");

        let total = 0;

        for (let i = 0; i < productList.length; i++) {
            product = productList[i];
            if (!product) {
                continue;
            }

            res.write("<tr><td>" + product.id + "</td>");
            res.write("<td>" + product.name + "</td>");

            res.write("<td align=\"center\"> <input type=\"text\" name=\"newqty1\" size=\"3\" value=\"1\"> </td>");

            res.write("<td align=\"right\">$" + Number(product.price).toFixed(2) + "</td>");
            res.write("<td align=\"right\">$" + (Number(product.quantity.toFixed(2)) * Number(product.price)).toFixed(2) + "</td>");
            // res.write("<td align=\"right\"><a href = \"showcart/delete/"+product.id+"\">Remove Item from cart</a></td>");
            // res.write("<td align=\"right\"><input type=\"BUTTON\" onclick=\"\" value=\"Update Quantity\"></td>");            
            res.write("</tr>");

            total += product.quantity * product.price;
        }

        res.write("<tr><td colspan=\"4\" align=\"right\"><b>Order Total</b></td><td align=\"right\">$" + total.toFixed(2) + "</td></tr>");
        res.write("</table>");

        res.write("<h2 class = 'checkout-link'><a href=\"checkout\">Check Out</a></h2>");
        res.write("</form>");
    } else {
        res.write("<h1>Your shopping cart is empty!</h1>");
    }

    res.write('<h2 align = \"center\"><a href="listprod">Continue Shopping</a></h2>');
    res.end();
    
});


module.exports = router;
