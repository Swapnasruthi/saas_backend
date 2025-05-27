// const Razorpay = require('razorpay');

// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_SECRET_KEY,
// });

// module.exports = razorpay;

const Razorpay = require('razorpay');

const isMock = process.env.MOCK_RAZORPAY === 'true';

let razorpay;

if (isMock) {
  //  Mocked Razorpay instance
  razorpay = {
    orders: {
      create: async (options) => {
        return {
          id: 'order_mock_123',
          amount: options.amount,
          currency: options.currency,
          receipt: options.receipt,
          status: 'created',
          created_at: Date.now(),
        };
      },
    },
  };
} else {
  //  Real Razorpay instance
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
  });
}

module.exports = razorpay;
