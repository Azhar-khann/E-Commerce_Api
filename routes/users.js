const express = require('express');
const usersRouter = express.Router();
const pool = require('../db/connect_to_db');

usersRouter.get('/' , (req, res) => {
    pool.query('SELECT * FROM users', (error, results) => {
        if (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json(results.rows)
    })
});



module.exports = usersRouter;