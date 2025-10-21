async function checkout(kind){
  try{
    const endpoint = kind === 'org' ? '/.netlify/functions/create-checkout-donation' : '/.netlify/functions/create-checkout-session';
    const resp = await fetch(endpoint, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(kind==='org' ? { amount: 1000, currency: 'usd', size: 'medium' } : { kind }) });
    const { id, publicKey, error } = await resp.json();
    if(error) throw new Error(error);
    const stripe = Stripe(publicKey);
    const { error: stripeErr } = await stripe.redirectToCheckout({ sessionId: id });
    if(stripeErr) alert(stripeErr.message);
  }catch(e){ console.error(e); alert('Checkout failed: ' + e.message); }
}