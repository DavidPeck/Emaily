const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = (app) => {
    app.post('/api/stripe', requireLogin, async (req, res) => {
        try {
            // bad bad for testing
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

            const charge = await stripe.charges.create({
                amount: 500,
                currency: 'usd',
                description: '$5 for 5 credits',
                source: req.body.id
            });

            req.user.credits += 5;
            const user = await req.user.save();
            
            res.send(user);            
         } catch(err) {
             console.log('Error: ', err.raw);
         }
    });

    app.get('/api/stripe/test', async(req, res) => {
        try{

            // bad bad for testing
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

            //stripe.setHttpAgent(new ProxyAgent('http://wswc482352:3030'));
            const charges = await stripe.charges.retrieve("ch_1Cx5q2FDm1JdLkz4ASbvIZrT", {
                api_key: "sk_test_q0ufbaiRNJ3CWIMWm1rhjjhb"
            });

            res.send(charges);

        } catch (err) {
            console.log('Charges read error: ', err);
            //res.redirect('/error');
            res.send(err.message);
        }

    });


    app.get('/v0/api/charges/test', async (req, res) => {
        try {
            const ProxyAgent = require('https-proxy-agent');
            var url = require('url');
            var https = require('https');
            var proxy = 'http://wswc482352:3030';

            console.log('using proxy server %j', proxy);

            // HTTPS endpoint for the proxy to connect to
            var endpoint = process.argv[2] || 'https://www.google.com/';
            console.log('attempting to GET %j', endpoint);
            // bad bad for testing
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
            console.log('Regect setting: ', process.env.NODE_TLS_REJECT_UNAUTHORIZED);
            var options = url.parse(endpoint);

            // create an instance of the `HttpsProxyAgent` class with the proxy server information
            // var agent = new ProxyAgent(proxy);
            // options.agent = agent;

            https.get(options, function (res) {
            console.log('"response" event!', res);
            res.pipe(process.stdout);
            });


            // stripe.setHttpAgent(new ProxyAgent('http://wswc482352:3030'));
            // const charges = await stripe.charges.retrieve("ch_1Cx5q2FDm1JdLkz4ASbvIZrT", {
            //     api_key: "sk_test_q0ufbaiRNJ3CWIMWm1rhjjhb"
            // });




            //res.send(charges);
        } catch (err) {
            console.log('Charges read error: ', err);
            res.redirect('/error');
        }
    });
};