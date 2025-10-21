const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const secret = process.env.STRIPE_SECRET_KEY;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripe = Stripe(secret, { apiVersion: '2023-10-16' });

  let evt;
  try{
    const sig = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
    evt = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
  }catch (e){
    return { statusCode: 400, body: `Webhook Error: ${e.message}` };
  }

  const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);

  try{
    if(evt.type === 'checkout.session.completed'){
      const s = evt.data.object;
      await sb.from('subscriptions').insert({
        stripe_customer: s.customer,
        stripe_session: s.id,
        price_id: s.metadata?.price_id || null,
        status: 'active'
      });
    }
  }catch(e){
    console.error('Supabase insert error', e.message);
  }
  return { statusCode: 200, body: 'ok' };
};
