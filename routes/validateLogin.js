const express = require('express');
const router = express.Router();
const auth = require('../auth');
const sql = require('mssql');

router.post('/', function(req, res) {
    // Have to preserve async context since we make an async call
    // to the database in the validateLogin function.
    (async () => {
        let authenticatedUser = await validateLogin(req);
        if (authenticatedUser) {
            req.session.authenticatedUser = true;
            res.redirect("/");
        } else {
            req.session.loginMessage = "Could not connect to the system using that username/password.";
            res.redirect("/login");
        }
     })();
});

async function validateLogin(req) {
    if (!req.body || !req.body.username || !req.body.password) {
        return false;
    }

    let username = req.body.username;
    let password = req.body.password;
    let authenticatedUser =  await (async function() {
        try {
            let pool = await sql.connect(dbConfig);

            let validateLogin = "SELECT * FROM customer where userid = @username and password = @password";
            let validateResult = await pool.request()
                                            .input('username',sql.VarChar, username)
                                            .input('password',sql.VarChar, password)
                                            .query(validateLogin);
    
            if(validateResult.recordset.length === 0){
                return false;
            }
            req.session.username = username; 
            return username;

        } catch(err) {
            console.dir(err);
            return false;
        }
    })();

    return authenticatedUser;
}

module.exports = router;
