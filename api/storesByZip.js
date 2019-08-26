/**
 * Route: GET /zip
 */
const axios = require('axios');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const util = require('./util.js');

const urlBase = 'https://api.bestbuy.com/v1/stores(area(';
const urlButt = ',50))?format=json&show=storeId,longName,name,phone,distance,address,address2,city,region,postalCode&pageSize=5&apiKey='
const apiKey = process.env.BESTBUY_PRODUCTS_API_KEY;

exports.handler = async (event) => {
    try {
        let zipCode = event.pathParameters.zip;
        let url = urlBase + zipCode + urlButt + apiKey;

        const response = await axios.get(url);
        
        return {
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify({
                stores: response.data.stores
            })
        };
    } catch (err) {
        console.log('Error:', err);
        return {
            statusCode: err.statusCode ? err.statusCode : 500,
            headers: util.getResponseHeaders(),
            body: JSON.stringify({
                error: err.name ? err.name : 'Exception',
                message: err.message ? err.message : 'Uknown error'
            })
        };
    }
};
