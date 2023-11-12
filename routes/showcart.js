const express = require('express');
const router = express.Router();

    

router.get('/', function(req, res, next) {
    let productList = false;
    res.setHeader('Content-Type', 'text/html');
    res.write("<title>T MART</title>");
    if (req.session.productList) {
        productList = req.session.productList;
        res.write("<form name=shoppingForm>")
        res.write("<h1>Your Shopping Cart</h1>");
        res.write("<table><tr><th>Product Id</th><th>Product Name</th><th>Quantity</th>");
        res.write("<th>Price</th><th>Subtotal</th><th></th><th></th></tr>");

        let total = 0;
        for (let i = 0; i < productList.length; i++) {
            product = productList[i];
            if (!product) {
                continue
            }

            res.write("<tr><td>" + product.id + "</td>");
            res.write("<td>" + product.name + "</td>");

            res.write("<td align=\"center\"> <input type=\"number\" name=\"newqty\" size=\"1\" value= "+product.quantity+"> </td>");

            res.write("<td align=\"right\">$" + Number(product.price).toFixed(2) + "</td>");
            res.write("<td align=\"right\">$" + (Number(product.quantity.toFixed(2)) * Number(product.price)).toFixed(2) + "</td>");
            res.write("<td>" +
                        "<a href=\"showcart\">Remove Item from Cart</a>" +
                      "</td>");
            res.write("<td>" +
                        "<input type=\"BUTTON\" onclick=\"update(" + product.id + ", document.shoppingForm.newqty.value)\"value=\"Update Quantity\">" + 
                      "</td>");

            res.write("</tr>");
            
            total += product.quantity * product.price;
        }
        res.write("<tr><td colspan=\"4\" align=\"right\"><b>Order Total</b></td><td align=\"right\">$" + total.toFixed(2) + "</td></tr>");
        res.write("</table>");

        res.write("<h2><a href=\"checkout\">Check Out</a></h2>");
    } else{
        res.write("<h1>Your shopping cart is empty!</h1>");
    }
    res.write('<h2><a href="listprod">Continue Shopping</a></h2>');
    res.write("</form>")

    res.end();
});

module.exports = router;
