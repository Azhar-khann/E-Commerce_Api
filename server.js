const express = require('express');
const app = express();
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const pool = require('./db/connect_to_db');
const passwordHash = require('./utils/helper_functions');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
app.use(express.json());


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const productsRouter = require('./routes/products')
app.use('/products', productsRouter);

const usersRouter = require('./routes/users')
app.use('/users',usersRouter);

const cartRouter = require('./routes/cart')
app.use('/cart', cartRouter)

const ordersRouter = require('./routes/orders')
app.use('/order', ordersRouter)



const store = new session.MemoryStore();
// session middleware below:
app.use(
  session({
    secret: "D53gxl41G",
    resave: false,
    saveUninitialized: false,
    cookie: {secure: true, sameSite: "none" },
    store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, {id})
})


passport.use(new LocalStrategy(

  function(username, password, done) {

    pool.query('SELECT * FROM users where username = $1', [username], async (error, results) => {

      // if error looking up in database
      if (error) {
        return done(error)
      }

      // if no user found
      if (results.rows.length === 0) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      
      const matchedPassword = await bcrypt.compare(password, results.rows[0].password);
      // if password is incorrect
      if (!matchedPassword){
        return done(null,false)
  
      }

      // if user found and password matches
      return done(null,results.rows[0])
      
    })

  }
));  





app.get('/', (req, res) => {
  res.send('<h1>Hello from your Express.js server!!</h1>');
});
  
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashPassword = await passwordHash(password,10)

  pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashPassword], (error, results) => {

    if (error) {
      res.status(500).send("Unable to create user!");
    }
    else{
      res.status(201).send('User successfully created')
    }

  })

});

app.post('/login',passport.authenticate("local"), (req, res) => {
  res.status(200).send('Successfully Authenticated')
});



app.listen(3000, () => {
  console.log('Server listening on port 3000');
});