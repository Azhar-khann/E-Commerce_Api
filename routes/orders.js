const express = require('express');
const ordersRouter = express.Router();
const pool = require('../db/connect_to_db');
const helper = require('../utils/helper_functions')


module.exports = ordersRouter;

// get users order
ordersRouter.get('/user/:user_id' , (req, res) => {

    const user_id  = req.params.user_id;
    const query  = `select orders.order_id, name,size,price,image,date from 
    orders
    join order_details
    on orders.user_id = order_details.user_id and orders.order_id = order_details.order_id
    join product_sizes 
    on order_details.product_size_id = product_sizes.id 
    join products
    on  product_sizes.product_id = products.id 
    where orders.user_id = $1
`
    pool.query(query, [user_id], (error, results) => {

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



