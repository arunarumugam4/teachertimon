// DATABASE CONFIGURATION
const mongoose = require('mongoose');

// GET DATABASE DETAILS
const databaseConfig = require('../secrets/databaseSecret');
const dbUrl = databaseConfig.dbUrl;
const dbName = databaseConfig.dbName;

const db = mongoose.connection;

// REPLACE MONGOOSE PROMISE BY NODE NATIVE PROMISE(RECOMMENDED)
mongoose.Promise = global.Promise

// CREATE CONNECTION
mongoose.connect(dbUrl, { useMongoClient: true }).catch((err) => console.log(`\n some error occured while connecting to the ${dbName} database 
\n ERROR :	${err}`));

// SET EVENT LISTENERS
db.on('connected', () => console.log(`\n server is successfully connected to the ${dbName} database`))
db.on('disconnected', () => console.log(`\n Database disconnected ! ! !`));

//END