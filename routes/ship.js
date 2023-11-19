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
            await transaction.request()
                .input('shipmentDate', sql.Date, shipmentDate)
                .query(sqlQuery2);

	   	    // TODO: For each item verify sufficient quantity available in warehouse 1.
            for(let record = 0; record < results.recordset[0].length; record++){
                let sqlQuery3 = "SELECT quantity FROM productinventory WHERE productId = @productId AND warehouseId = 1";
                inventoryresults = await transaction.request()
                    .input('productId', sql.Int, record.productId)
                    .query(sqlQuery3);
                let inventory = inventoryresults.recordset[0];
                let quantity = inventory.quantity;
    
    
                // TODO: If any item does not have sufficient inventory, cancel transaction and rollback. Otherwise, update inventory for each item.
                if(quantity < results.recordset[0].quantity){
                    await transaction.rollback();
                    res.write("<h1>Shipment not done. Insufficient inventory for product id: "+results.recordset[0].productId+"</h1>");
                    res.write("<h2><a href = '/'>Back to Main page</a></h2>");
                    res.end();
                    return;
                }else{
                    let sqlQuery4 = "UPDATE inventory SET quantity = @quantity WHERE productId = @productId AND warehouseId = 1";
                    await transaction.request()
                        .input('quantity', sql.Int, quantity - results.recordset[0].quantity)
                        .input('productId', sql.Int, productId)
                        .query(sqlQuery4);
                        
                    res.write("<h2>Ordered Product: "+results.recordset[0].productId+" Qty :"+quantity+" Previous Inventory: "+results.recordset[0].quantity+" New inventory: "+(quantity - results.recordset[0].quantity)+"</h2>");

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
