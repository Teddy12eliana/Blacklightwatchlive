const Stripe = require('stripe');
exports.handler = async (event) => {
  try{
    const body = JSON.parse(event.body || "{}");
    const { amount, currency, size='medium' } = body;
    if(!amount || amount<100) throw new Error("amount (cents) required, >=100");
    const secret = process.env.STRIPE_SECRET_KEY;
    const publicKey = process.env.STRIPE_PUBLISHABLE_KEY;
    const stripe = Stripe(secret, { apiVersion: '2023-10-16' });
    const pct = size==='large' ? 5 : (size==='small' ? 2 : 3);
    const fee = Math.round(amount * pct / 100);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price_data: { currency: currency||'usd', product_data:{name:'Campaign Support'}, unit_amount: amount }, quantity: 1 }],
      success_url: 'https://deluxe-cocada-c096b8.netlify.app/?donated=1',
      cancel_url: 'https://deluxe-cocada-c096b8.netlify.app/pricing.html?cancelled=1',
      automatic_tax: { enabled: true },
      payment_intent_data: {
        application_fee_amount: fee,
        transfer_data: { destination: process.env.STRIPE_CONNECT_DEST || '' }
      },
      metadata: { fee_percent: pct }
    });

    return { statusCode: 200, body: JSON.stringify({ id: session.id, publicKey }) };
  }catch(e){
    return { statusCode: 400, body: JSON.stringify({ error: e.message }) };
  }
};
