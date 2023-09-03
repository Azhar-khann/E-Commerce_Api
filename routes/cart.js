const express = require('express');
const cartRouter = express.Router();
const pool = require('../db/connect_to_db');

cartRouter.get('/' , (req, res) => {

    pool.query('SELECT * FROM cart', (error, results) => {

        if (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json(results.rows)
    })
});


//get items in users cart
cartRouter.get('/user/:id' , (req, res) => {

    const id  = req.params.id;
    const query = `select name,size,price,image from cart join product_sizes 
    on cart.product_size_id = product_sizes.id 
    join products
    on  product_sizes.product_id = products.id 
    where user_id = $1`

    pool.query(query, [id], (error, results) => {

        if (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.rowCount === 0) {
            return res.status(404).send( 'cart not found' );
        }

        res.status(200).json(results.rows)
    })
});

//add products in user's cart
cartRouter.post('/user/:user_id' , (req, res) => {

    const user_id  = req.params.user_id;
    const {product_size_id} = req.body;

    pool.query('insert into cart (user_id,product_size_id) values($1,$2)', [user_id,product_size_id], (error, results) => {

        if (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.status(200).send('product successsfully added in user cart')
    })
});

// update product in user's cart
cartRouter.put('/user/:user_id/:product_size_id' , (req, res) => {

    const user_id  = req.params.user_id;
    const existing_product_size_id = req.params.product_size_id;
    const {product_size_id} = req.body

    pool.query(`UPDATE cart SET product_size_id = $1 WHERE user_id = $2 and product_size_id = $3`, [product_size_id, user_id, existing_product_size_id], (error, results) => {

        if (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.rowCount === 0) {
            return res.status(404).json({ message: 'cart not found' });
        }

        res.status(200).send(`user's cart updated successfully`)
    })
});

// delete product from user's cart
cartRouter.delete('/user/:user_id/:product_size_id' , (req, res) => {

    const user_id  = req.params.user_id;
    const existing_product_id = req.params.product_size_id;

    pool.query(`delete from cart where user_id = $1 and product_size_id = $2`,[user_id,existing_product_id],  (error, results) => {

        if (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.rowCount === 0) {
            return res.status(404).send( 'cart not found' );
        }

        res.status(200).send('cart deleted successfully')
    })
});

module.exports = cartRouter;