const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req,res,next) {
    res.write("<title>Admin</title>");
    res.write("<h1 align = 'center'>Update Existing Products<h1>");
    res.write(`<style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            width: 50%;
            margin: 50px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            font-weight: bold;
            margin-bottom: 5px;
        }

        input[type="text"],
        input[type="number"] {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }

        input[type="submit"] {
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
    
        </style>`)

    res.write("<div class='container'>");
    res.write("<h3 align = 'center'>Update Product</h3>");
    res.write("<form action='/updateproduct' method='POST'>");
    res.write("<div class='form-group'>");
    res.write("<label for='existproductName'>Existing Product Name:</label>");
    res.write("<input type='text' id='existproductName' name='existproductName' required>");
    res.write("</div>");
    res.write("<div class='form-group'>");
    res.write("<label for='newproductName'>New Product Name:</label>");
    res.write("<input type='text' id='newproductName' name='newproductName' required>");
    res.write("</div>");
    res.write("<div class='form-group>");
    res.write("<label for='categoryId'>New Category ID:</label>");
    res.write("<input type='number' id='categoryId' name='categoryId' required>");
    res.write("</div>");
    res.write("<div class='form-group'>");
    res.write("<label for='productDesc'>New Product Description:</label>");
    res.write("<input type='text' id='productDesc' name='productDesc' required>");
    res.write("</div>");
    res.write("<div class='form-group'>");
    res.write("<label for='productPrice'>New Product Price:</label>");
    res.write("<input type='text' id='productPrice' name='productPrice' required>");
    res.write("</div>");
    res.write("<input type='submit' value='Update Product'>");
    res.write("</form>");
    res.write("</div>");
    res.end();
});

router.post('/',async function(req,res,next) {
    try{
        const pool = await sql.connect(dbConfig);
        const {
            existproductName,
            newproductName,
            categoryId,
            productDesc,
            productPrice
        } = req.body;

        const updateprod = `UPDATE product 
                        SET productName = @newproductName, categoryId = @categoryId, productDesc = @productDesc, productPrice = @productPrice
                        WHERE productId = @productId`;
        console.log("check1");
        console.log(existproductName);
        let selectQuery = "SELECT * FROM product WHERE productName = @existproductName";
        let results = await pool.request()
            .input('existproductName', sql.VarChar(40), existproductName)
            .query(selectQuery);
        let productId = results.recordset[0].productId; // Getting the productId for the product to be updated

        console.log("check2");
        let resultsprod = await pool.request()
            .input('newproductName', sql.VarChar(40), newproductName)
            .input('categoryId', sql.Int, categoryId)
            .input('productDesc', sql.VarChar(1000), productDesc)
            .input('productPrice', sql.Decimal(10,2), productPrice)
            .input('productId', sql.Int, productId)
            .query(updateprod);
        console.log(results);
        // res.send(200);
        res.redirect('/admin');
    }catch (err) {
        console.error(err);
        res.write(err.message);
        res.send(500);
    }
});

module.exports = router;
