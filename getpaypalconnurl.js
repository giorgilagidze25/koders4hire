const PAYPAL_CLIENT_ID = 'AY-BGzpHqwk6JiOJStEYWieDaESnNNHZBa6e6lVbvy5FEStVnI--DDXVqqplWGmhHMKsOUv1IQJE4TwW';
const REDIRECT_URI = 'https://api.k4h.dev/paypal/callback';

function getPayPalConnectURL() {
  const params = new URLSearchParams({
    flowEntry: 'static',
    client_id: PAYPAL_CLIENT_ID,
    scope: 'openid profile email https://uri.paypal.com/services/paypalattributes',
    redirect_uri: REDIRECT_URI,
    response_type: 'code'
  });
  return `https://www.paypal.com/connect?${params.toString()}`;
}

console.log(getPayPalConnectURL());
