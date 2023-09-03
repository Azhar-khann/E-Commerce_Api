const express = require('express');
const usersRouter = express.Router();
const pool = require('../db/connect_to_db');


// get all users
usersRouter.get('/' , (req, res) => {

    pool.query('SELECT * FROM users', (error, results) => {

        if (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json(results.rows)
    })
});

//get user by id
usersRouter.get('/:id' , (req, res) => {

    const id  = req.params.id;

    pool.query('SELECT * FROM users where id = $1', [id], (error, results) => {

        if (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.rowCount === 0) {
            return res.status(404).send( 'user not found' );
        }

        res.status(200).json(results.rows)
    })
});

//create user
usersRouter.post('/' , (req, res) => {

    const {username,password} = req.body;

    pool.query('insert into users (username,password) values($1,$2)', [username,password], (error, results) => {

        if (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).send('user successsfully added')
    })
});


// update user name and password
usersRouter.put('/:id' , (req, res) => {

    const id  = req.params.id;
    const column = Object.keys(req.body)[0];
    const newValue = req.body[column];

    pool.query(`UPDATE users SET ${column} = $1 WHERE id = $2`, [newValue,id], (error, results) => {

        if (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.rowCount === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).send(`users's ${column} updated successfully`)
    })
});

// delete user
usersRouter.delete('/:id' , (req, res) => {

    const id  = req.params.id;

    pool.query(`delete from users where id = $1`,[id],  (error, results) => {

        if (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.rowCount === 0) {
            return res.status(404).send( 'user not found' );
        }

        res.status(200).send('user deleted successfully')
    })
});

module.exports = usersRouter;