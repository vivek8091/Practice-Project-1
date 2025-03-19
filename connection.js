const mysql = require("mysql"); // Importing mySql...

const conn = mysql.createConnection({ // Creating mySql connection...
  host: "localhost",
  user: "root",
  database: "vivekdb",
});

conn.connect((err, result) => { // Connecting Database...
  if (err) {
    console.log(err);
  } else {
    console.log("successfully connected");
  }
});
module.exports = conn; // Export Database...
