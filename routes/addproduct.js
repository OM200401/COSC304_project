const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req,res,next) {
    res.write("<title>Admin</title>");
    res.write("<h1 align = 'center'>Admin Dashboard<h1>");
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
    res.write("<h3 align = 'center'>Add Product</h3>");
    res.write("<form action='/addproduct' method='POST'>");
    res.write("<div class='form-group'>");
    res.write("<label for='productName'>Product Name:</label>");
    res.write("<input type='text' id='productName' name='productName' required>");
    res.write("</div>");
    res.write("<div class='form-group>");
    res.write("<label for='categoryId'>Category ID:</label>");
    res.write("<input type='number' id='categoryId' name='categoryId' required>");
    res.write("</div>");
    res.write("<div class='form-group'>");
    res.write("<label for='productDesc'>Product Description:</label>");
    res.write("<input type='text' id='productDesc' name='productDesc' required>");
    res.write("</div>");
    res.write("<div class='form-group'>");
    res.write("<label for='productPrice'>Product Price:</label>");
    res.write("<input type='text' id='productPrice' name='productPrice' required>");
    res.write("</div>");
    res.write("<input type='submit' value='Add Product'>");
    res.write("</form>");
    res.write("</div>");
    res.end();
});

router.post('/',async function(req,res,next) {
    try{
        const pool = await sql.connect(dbConfig);
        const {
            productName,
            categoryId,
            productDesc,
            productPrice
        } = req.body;

        const addprod = `INSERT INTO product (productName, categoryId, productDesc, productPrice)
        VALUES (@productName, @categoryId, @productDesc, @productPrice)`;
        console.log("check1");
        let selectQuery = "SELECT * FROM product WHERE productName = @productName";
        let results = await pool.request()
            .input('productName', sql.VarChar(40), productName)
            .query(selectQuery);
        if(results.recordset.length > 0){
            throw new Error('Product with this name already exists');
        }

        console.log("check2");
        let resultsprod = await pool.request()
            .input('productName', sql.VarChar(40), productName)
            .input('categoryId', sql.Int, categoryId)
            .input('productDesc', sql.VarChar(1000), productDesc)
            .input('productPrice', sql.Decimal(10,2), productPrice)
            .query(addprod);
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
