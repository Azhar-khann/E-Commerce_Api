const express = require('express');
const ordersRouter = express.Router();
const pool = require('../db/connect_to_db');
const helper = require('../utils/helper_functions')


module.exports = ordersRouter;

// get users order
ordersRouter.get('/user/:user_id' , (req, res) => {

    const user_id  = req.params.user_id;
    const query  = `select orders.id as order_id, name,size,price,image,date from 
    orders
    join cart
    on orders.user_id = cart.user_id
    join product_sizes 
    on cart.product_size_id = product_sizes.id 
    join products
    on  product_sizes.product_id = products.id 
    where orders.user_id = $1`

    const query2 = `select n_orders.id as order_id, name,size,price,image,date from 
    n_orders
    join users
    on users.id = n_orders.user_id
    join product_sizes 
    on n_orders.product_size_id = product_sizes.id 
    join products
    on  product_sizes.product_id = products.id 
    where n_orders.user_id = $1`

    pool.query(query2, [user_id], (error, results) => {

        if (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.rowCount === 0) {
            return res.status(404).send( 'no orders found' );
        }

        const groupData = helper.groupDataByOrderId(results.rows);
        const outputJson = Object.values(groupData);

        res.status(200).json(outputJson)
    })
});

ordersRouter.post('/user/:user_id' , (req, res) => {
    
    const user_id  = req.params.user_id;
    const {date} = req.body;

    pool.query('insert into orders (user_id,date) values($1,$2)', [user_id,date], (error, results) => {

        if (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.status(200).send('order successfully added in user account')
    })

})

