/**
 * Route: GET /zip
 */

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const util = require('./util.js');

const getStoreList = (zip) => {
    return new Promise(resolve => {
        console.log('connected:');
        resolve(zip);
    });
    //Run query to Bestbuy for store list and resolve
};

exports.handler = async (event) => {
    try {
        let zipCode = parseInt(event.pathParameters.zip);

        let data = await getStoreList(zipCode);

        return {
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify(data)
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
