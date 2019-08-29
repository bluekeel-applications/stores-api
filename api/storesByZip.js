/**
 * Route: GET /zip
 */
const axios = require('axios');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const util = require('./util.js');

const urlBase = 'https://api.bestbuy.com/v1/stores(area(';
const urlButt = ',100))?format=json&show=storeId,storeType,location,longName,name,phone,distance,address,address2,city,region,postalCode,country,lat,lng&pageSize=20&apiKey='
const apiKey = process.env.BESTBUY_PRODUCTS_API_KEY;

const formattedPhone = (rawPhone) => {
    let parts = rawPhone.split('-');
    return '(' + parts[0] + ') ' + parts[1] + '-' + parts[2];
};

exports.handler = async (event) => {
    try {
        let zipCode = event.pathParameters.zip;
        let url = urlBase + zipCode + urlButt + apiKey;

        let featureArray = [];
        await axios.get(url).then(res => {
            res.data.stores.forEach((store) => {
                let storeGeoJson = {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [store.lng, store.lat]
                    },
                    properties: {
                        name: store.name,
                        longName: store.longName,
                        storeType: store.storeType,
                        phoneFormatted: formattedPhone(store.phone),
                        phone: store.phone,
                        address: store.address,
                        address2: store.address2,
                        city: store.city,
                        country: store.country,
                        crossStreet: store.location,
                        postalCode: store.postalCode,
                        state: store.region,
                        storeId: store.storeId.toString(),
                        distance: store.distance.toString()
                    }
                }
                featureArray.push(storeGeoJson);
            })
        });

        return {
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify({
                stores: featureArray
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
