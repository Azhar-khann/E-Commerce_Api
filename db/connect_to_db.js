const Pool = require('pg').Pool
const pool = new Pool({
    user: 'azhar',
    host: 'localhost',
    database: 'E-commerce',
    port: 5432,
})

/* function check_user_in_db() {
        pool.query('SELECT * FROM users where id = $1', [id], (error, results) => {
            if (error) {
                return done(error)
            }
    })
} */
 
module.exports = pool;