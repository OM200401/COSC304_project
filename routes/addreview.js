const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.post('/:productId', async function(req, res, next) {
    try {
        //Adding a check if user is logged in or not before they can add a review
        // if(req.session.userid){
        //     return next();
        // }else{
        //     res.redirect('/login');
        // }
        let pool = await sql.connect(dbConfig);
        let productId = req.params.productId;
        let stars = req.body.stars;
        let comment = req.body.comment;
        let customerId = req.session.customerId; // Assuming customerId is stored in session

        let currentDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Current date in YYYY-MM-DD HH:MM:SS format

        let sqlQuery = `
            INSERT INTO review (reviewRating, reviewDate, customerId, productId, reviewComment)
            OUTPUT INSERTED.reviewId VALUES (@stars, @currentDate, @customerId, @productId, @comment)
        `;
        let result = await pool.request()
            .input('stars', sql.Int, stars)
            .input('currentDate', sql.DateTime, currentDate)
            .input('customerId', sql.Int, customerId)
            .input('productId', sql.Int, productId)
            .input('comment', sql.VarChar(1000), comment)
            .query(sqlQuery);

        res.redirect(`/product?id=${productId}`); // Redirect back to the product page after adding the review
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding review');
    }
});

module.exports = router;
