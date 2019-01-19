var express = require('express');
var cors = require('cors');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    reservation(id: Int!): Reservation
    reservations: [Reservation]
  },

  type Mutation {
    addReservation(input: ReservationInput!): Reservation
  },

  input ReservationInput {
    name: String!
    hotelName: String!
    arrivalDate: String! 
    departureDate: String!   
  }

  type Reservation {
    id: Int!
    name: String
    hotelName: String
    arrivalDate: String   
    departureDate: String    
  }
`);

var reservations = [
  {
    id: 1,
    name: 'Jenny Phan',
    hotelName: 'Hilton Garden Inn',
    arrivalDate: '03-01-2019',
    departureDate: '03-05-2019'
  },
  {
    id: 2,
    name: 'James Bond',
    hotelName: 'Hilton Garden Inn',
    arrivalDate: '06-01-2019',
    departureDate: '06-05-2019'
  },
  {
    id: 3,
    name: 'Donald Trump',
    hotelName: 'Canopy by Hilton Dallas Uptown',
    arrivalDate: '03-01-2019',
    departureDate: '03-05-2019'
  },
  {
    id: 4,
    name: 'Ashish Patel',
    hotelName: 'The Statler Dallas',
    arrivalDate: '04-01-2019',
    departureDate: '04-05-2019'
  },
  {
    id: 5,
    name: 'Wilson Francos',
    hotelName: 'Homewood Suites by Hilton',
    arrivalDate: '05-11-2019',
    departureDate: '05-17-2019'
  }
];

class Reservation {
  constructor(id, { name, hotelName, arrivalDate, departureDate }) {
    this.id = id;
    this.name = name;
    this.hotelName = hotelName;
    this.arrivalDate = arrivalDate;
    this.departureDate = departureDate;
  }
}

var getReservation = function(args) {
  var id = args.id;
  return reservations.filter(reservation => {
    return reservation.id === id;
  })[0];
};

var addReservation = function({ input }) {
  const nextId = getNextId();
  const newReservation = new Reservation(nextId, input);
  reservations.push(newReservation);
  return newReservation;
};
var getNextId = function() {
  const nextId =
    reservations.reduce((id, registration) => {
      return Math.max(id, registration.id);
    }, -1) + 1;
  return nextId;
};
var getAllReservations = function() {
  return reservations;
};

var root = {
  reservation: getReservation,
  reservations: getAllReservations,
  addReservation: addReservation
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
app.listen(8082, () => console.log('Now browse to localhost:8082/graphql'));
