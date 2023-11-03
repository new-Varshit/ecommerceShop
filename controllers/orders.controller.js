const stripe = require('stripe')();


const Order = require('../models/order.model');
const User = require('../models/user.model');
// const { get } = require('../routes/orders.routes');

async function getOrders(req, res) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render('customer/orders/all-orders', {
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
}

async function addOrder(req, res, next) {
  let userDocument;
  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }
const cart = res.locals.cart;
  const order = new Order(cart, userDocument);

  try {
    await order.save();
  } catch (error) {
    next(error);
    return;
  }

  req.session.cart = null;

  const session = await stripe.checkout.sessions.create({
    line_items: cart.items.map(function(item){
      return {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price_data:{
          currency: 'usd',
          product_data:{
            name: item.product.title
          },
          unit_amount_decimal: +item.product.price.toFixed(2) * 100
        },
        quantity: item.quantity,
      }
      
    }),
    mode: 'payment',
    success_url: `https://localhost:3000/orders/success`,
    cancel_url: `https://localhost:3000/orders/cancel`,
  });

  res.redirect(303, session.url);
}

function getSuccess(req,res){
  res.render('customer/orders/success');
}


function getFailure(req,res){
  res.render('customer/orders/failure');
}


module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
  getFailure:getFailure,
  getSuccess:getSuccess
};