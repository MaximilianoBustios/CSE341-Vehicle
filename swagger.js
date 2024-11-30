const swaggerAutogen = require ('swagger-autogen')();

const doc = {
    info: {
        title: 'Vehicles Api',
        description: 'Vehicles Api'
    },
    host: 'localhost:3000',
    schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

//this will generate a swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);