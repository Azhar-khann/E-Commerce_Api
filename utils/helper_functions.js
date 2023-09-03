const bcrypt = require("bcrypt");
const cardValidator = require('credit-card-validator');
const creditcard =  require('creditcard.js');
const pool = require('../db/connect_to_db');
const { use } = require("passport");

// Create password hashing function below:
const passwordHash = async (password, saltRounds) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash
  } catch (err) {
    console.log(err);
  }
  return null
};

function groupDataByOrderId(inputJson) {
  return inputJson.reduce((result, item) => {
    const { order_id, ...rest } = item;
    if (!result[order_id]) {
      result[order_id] = { order_id, details: [] };
    }
    result[order_id].details.push(rest);
    return result;
  }, {});
}

function validateCreditCard(cardNumber, expirationMonth, expirationYear, cvv) {

  return creditcard.isValid(cardNumber) && creditcard.isExpirationDateValid(expirationMonth, expirationYear) && creditcard.isSecurityCodeValid(cardNumber,cvv);

}

function createOrder(user_id,date) {

  pool.query('insert into orders (user_id,date) values($1,$2)', [user_id,date], (error, results) => {

    if (error) {
        throw error;
    }

    

  })
}
  




module.exports = {
  passwordHash,
  groupDataByOrderId,
  validateCreditCard,
  createOrder
};