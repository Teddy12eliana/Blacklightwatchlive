const Stripe = require('stripe');
exports.handler = async (event) => {
  try{
    const body = JSON.parse(event.body || "{}");
    const kind = body.kind || 'basic';
    const secret = process.env.STRIPE_SECRET_KEY;
    const publicKey = process.env.STRIPE_PUBLISHABLE_KEY;
    const priceBasic = process.env.STRIPE_PRICE_ID_BASIC;
    const pricePro = process.env.STRIPE_PRICE_ID_PRO;
    if(!secret || !publicKey) throw new Error("Stripe keys missing");
    const stripe = Stripe(secret, { apiVersion: '2023-10-16' });

    let lineItems = [];
    let mode = 'subscription';

    if(kind === 'basic') lineItems = [{ price: priceBasic, quantity: 1 }];
    else if(kind === 'pro') lineItems = [{ price: pricePro, quantity: 1 }];
    else if(kind === 'org') { const priceVerify = process.env.STRIPE_PRICE_ID_ORG_VERIFY || priceBasic; lineItems = [{ price: priceVerify, quantity: 1 }]; mode = 'payment'; }

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: lineItems,
      success_url: 'https://deluxe-cocada-c096b8.netlify.app/?paid=1',
      cancel_url: 'https://deluxe-cocada-c096b8.netlify.app/pricing.html?cancelled=1',
      automatic_tax: { enabled: true },
      allow_promotion_codes: true,
      metadata: { price_id: lineItems[0] ? lineItems[0].price : null, plan_kind: kind }
    });

    return { statusCode: 200, body: JSON.stringify({ id: session.id, publicKey }) };
  }catch(e){
    return { statusCode: 400, body: JSON.stringify({ error: e.message }) };
  }
};
