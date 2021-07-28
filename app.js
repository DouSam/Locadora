//#region Packages Import
const https = require('https');// Used to create server and listen connections
const fs    = require('fs');// Used to read certificates files
var express        = require("express"),// Used to handle HTTPS requests
    app            = express(),
    mongoose       = require("mongoose"),// Used to connect on MongoDB database
    bodyParser     = require('body-parser'),// Used to pass information by req.body
    cookieParser   = require("cookie-parser"),// Used for cookie manipulation
    methodOverride = require("method-override");// Used for overwriting form method
//#endregion

//Import middleware
var cookieHandler = require("./middleware/cookieHandler");

// Import models
const Session = require("./models/session");

require('dotenv').config({ path: './config/.env' });// This line import dotenv and change the environment variables

// Reading the certificate files
const options = {
  key: fs.readFileSync(`${process.env.SSL_KEY}`),
  cert: fs.readFileSync(`${process.env.SSL_CERTIFICATE}`)
};

app.use(bodyParser.urlencoded({ extended: true }));// Setting bodyParser as a middleware
app.set("view engine", "ejs");// Only to specified that 'ejs' will be used to construct the pages, that way i don't need to inform .ejs in res.render
app.use(methodOverride('_method'));// Configuring the word that indicates a method override
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.use(cookieHandler.cookieHandlerF); // Using the cookie manager function as a middleware

/**
 * Open mongoose connection with MongoDB Database,
 * One error is expected here, the MongoDB service is stopped, for this case we handle this error by a CRON script that checks if mongo is running before start node.
 */ 
mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`, { useNewUrlParser: true ,useUnifiedTopology:true});

//#region Importing routes

var loginRoutes    = require("./routes/login"),
    registerRoutes = require("./routes/register");

//#endregion

//#region Setting routes 

app.use("/login", loginRoutes)
app.use("/register", registerRoutes)

//#endregion

// The main handler to '/', this page redirect to all other routes.
app.get("", (req,res) => {
  res.render("index",{msg:req.query.msg,msgInd:req.query.msgInd})
})

// Starting server to listen to connections on the port and host defined in .env file
https.createServer(options,app).listen(process.env.NODE_PORT,process.env.NODE_HOST,()=> {
  console.log(`Starting on ${process.env.NODE_PORT}`)
});

// Function to clean 
async function cleanSessions(){

  let filter = {
    mxa : {
      "$lt" : Date.now()
    }
  }

  return await Session.deleteMany(filter);
}

// Interval to run clean session function
setInterval(cleanSessions,1000 * 60 * 30);