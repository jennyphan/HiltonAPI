var express = require('express');
var cors = require('cors');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    hotels: [Hotel]
  },

  type Hotel {
    id: Int!
    name: String
    address: String
    city: String   
    zip: String    
  }
`);

var hotels = [
  {
    id: 1,
    name: 'Hilton Garden Inn',
    address: '1333 Address1',
    city: 'Dallas',
    zip: '75231'
  },
  {
    id: 2,
    name: 'Statler',
    address: '333 Address2',
    city: 'Richardson',
    zip: '75232'
  }
];

var getAllHotels = function() {
  return hotels;
};

var root = {
  hotels: getAllHotels
};

// Create an express server and a GraphQL endpoint
var app = express().use(cors());
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema, // Must be provided
    rootValue: root,
    graphiql: true // Enable GraphiQL when server endpoint is accessed in browser
  })
);
app.listen(8083, () => console.log('Now browse to localhost:8083/graphql'));
