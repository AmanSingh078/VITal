const express = require('express');
const stripe = require('stripe')('sk_test_51RAZmtQMV2s7xmL2VvC151SSeHGGzHEVmqubkEMACHsAHbgKsRYuCEF8aYEaBUN0TL8XCAzhKNPi3NZGqDQitM3H00Da7JvwCh'); // Replace with your secret key
const app = express();
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  const { paymentMethodId, amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
    });
    res.send({ success: true });
  } catch (error) {
    res.send({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});