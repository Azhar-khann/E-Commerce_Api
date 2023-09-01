const express = require('express');
const productsRouter = express.Router();
const pool = require('../db/connect_to_db')

productsRouter.get('/' , (req, res) => {
    pool.query('SELECT * FROM products', (error, results) => {
        if (error) {
          throw error
        }
        res.status(200).json(results.rows)
    })
});

module.exports = productsRouter;