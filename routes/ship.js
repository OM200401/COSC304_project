const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');

	// TODO: Get order id
    orderId = req.query.orderId;
          
	// TODO: Check if valid order id
    if(!orderId){
        res.write("<h1>Invalid Order ID</h1>");
        res.end();
        return;
    }

    (async function() {
        try {
            let pool = await sql.connect(dbConfig);

            // TODO: Start a transaction
            const transaction = new sql.Transaction(pool);
            await transaction.begin();
	   	
	   	    // TODO: Retrieve all items in order with given id
            let sqlQuery1 = "SELECT op.orderId, op.quantity, op.productId FROM ordersummary os JOIN orderproduct op ON os.orderId = op.orderId WHERE op.orderId = @orderId";
            let results = await transaction.request()
                .input('orderId', sql.Int, orderId)
                .query(sqlQuery1);

	   	    // TODO: Create a new shipment record.
            let shipmentDate = moment().format('YYYY-MM-DD');
            let sqlQuery2 = "INSERT INTO shipment (shipmentDate) OUTPUT INSERTED.shipmentId VALUES (@shipmentDate)";
            let shipmentResult = await transaction.request()
                .input('shipmentDate', sql.Date, shipmentDate)
                .query(sqlQuery2);
            let shipmentId = shipmentResult.recordset[0].shipmentId;

	   	    // TODO: For each item verify sufficient quantity available in warehouse 1.

            for (let record of results.recordset) {
                let productId = record.productId;
                let quantity = record.quantity;
    
                let sqlQuery3 = "SELECT quantity FROM productinventory WHERE productId = @productId AND warehouseId = 1";
                let inventoryResult = await transaction.request()
                    .input('productId', sql.Int, productId)
                    .query(sqlQuery3);
    
                let inventoryQuantity = inventoryResult.recordset[0].quantity;
    
                if (inventoryQuantity < quantity) {
                    await transaction.rollback();
                    res.write("<h1>Shipment not done. Insufficient inventory for product id: " + productId + "</h1>");
                    res.write("<h2><a href = '/'>Back to Main page</a></h2>");
                    res.end();
                    return;
                } else {
                    let newInventoryQuantity = inventoryQuantity - quantity;
                    let sqlQuery4 = "UPDATE productinventory SET quantity = @quantity WHERE productId = @productId AND warehouseId = 1";
                    await transaction.request()
                        .input('quantity', sql.Int, newInventoryQuantity)
                        .input('productId', sql.Int, productId)
                        .query(sqlQuery4);
    
                    res.write("<h2>Ordered Product: " + productId + " Qty: " + quantity + " Previous Inventory: " + inventoryQuantity + " New inventory: " + newInventoryQuantity + "</h2>");
                }
            }

	   		await transaction.commit();
            res.write("<h1>Shipment successfully processed.</h1>");
            res.write("<h2><a href = '/'>Back to Main page</a></h2>");
            res.end();
 
        } catch(err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
});

module.exports = router;
