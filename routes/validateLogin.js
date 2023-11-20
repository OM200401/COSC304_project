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

    let userid = req.body.username;
    let password = req.body.password;
    let authenticatedUser =  await (async function() {
        try {
            let pool = await sql.connect(dbConfig);

            let validateLogin = "SELECT * FROM customer where userid = @userid and password = @password";
            let validateResult = await pool.request()
                                            .input('userid',sql.VarChar, userid)
                                            .input('password',sql.VarChar, password)
                                            .query(validateLogin);
    
            if(validateResult.recordset[0].length === 0){
                return false;
            }
            req.session.userid = userid; 

            return userid;

        } catch(err) {
            console.dir(err);
            return false;
        }
    })();

    return authenticatedUser;
}

module.exports = router;
