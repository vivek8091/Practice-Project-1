const express = require("express"); // Import express...
const app = express();
const multer = require("multer");
const path = require("path");
const port = 1212; // Storing port into a variable...
const conn = require("./connection"); // Importing connection.js...
const bodyParser = require("body-parser"); // Importing body-parser...
app.use(bodyParser.json()); // Using body-parser in app...

const fs = require("fs");

app.get("/", (req, res) => {
  // Sending server request...
  res.send("server is running...");
});

// app.post("/Datapost", (req, res) => {
//   // Inserting data using POST...
//   const data = {
//     // Storing data in "data" object...
//     name: req.body.name,
//     email: req.body.email,
//     password: req.body.password,
//   };

//   conn.query("insert into reg set ?", data, (err, result) => {
//     // Applying insert query...
//     if (err) {
//       console.log(err);
//     } else {
//       return res.json({
//         // Returning res(response) in .json format...
//         success: true,
//         message: "Data inserted successfully...",
//         data: result,
//       });
//     }
//   });
// });

// app.get("/getData", (req, res) => {
//   // Fetching(getting) all data from the table...
//   conn.query("select * from reg", (err, result) => {
//     // Select query...
//     if (err) {
//       console.log(err);
//       // res.status(500).json({ success: false, message: "Database error" });
//     } else {
//       // res.json({ success: true, data: result});
//       res.send(result);
//     }
//   });
// });

// app.get("/getData/:id", (req, res) => {
//   // Fetching data by it's id...
//   const id = req.params.id;
//   conn.query("select * from reg where id = ?", id, (err, result) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.send(result);
//     }
//   });
// });

// app.patch("/updateData/:id", (req, res) => {
//   // Updating data by it's id...
//   const userId = req.params.id; // Getting id from URL...
//   const { name, email, password } = req.body;

//   const updateQuery =
//     "update reg set name = ?, email = ?, password = ? where id = ?";

//   conn.query(updateQuery, [name, email, password, userId], (err, result) => {
//     if (err) {
//       console.log(err);
//       return res.json({
//         Message: "Error Occured...",
//       });
//     } else {
//       return res.json({
//         success: 1,
//         Message: "Data updated successfully...",
//       });
//     }
//   });
// });

// app.delete("/deleteData/:id", (req, res) => {
//   // Delete data by id...
//   const userId = req.params.id; // Getting id...

//   const deleteQuery = "delete from reg where id =  ?"; // Delete query...
//   conn.query(deleteQuery, [userId], (err, result) => {
//     if (err) {
//       console.log(err);
//     } else {
//       return res.json({
//         success: 1,
//         Message: "Data deleted successfully...",
//       });
//     }
//   });
// });

// Storage Engine...
const storage = multer.diskStorage({
  destination: "./uploads/", // Folder to store images
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

// File Upload Middleware
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      return cb(new Error("Only images (JPG, PNG, GIF) are allowed!"));
    }
  },
});

app.post("/upload", upload.array("images", 5), (req, res) => {
  // Upload multiple images at a time...
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const imagePaths = req.files.map((file) => file.filename);
  const query = "INSERT INTO images (image_path) VALUES ?";
  const values = imagePaths.map((image) => [image]);

  conn.query(query, [values], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }
    return res.json({
      success: true,
      message: "Images uploaded successfully",
      files: imagePaths,
    });
  });
});

app.use("/uploads", express.static("uploads"));

app.get("/getImg", (req, res) => {
  conn.query("select * from images", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      // res.json({
      //   success: true,
      //   message: "Images successfully fetched...",
      //   data: result,
      // });
      res.send(result);
    }
  });
});

app.listen(port, () => {
  // Checking if server is running or not...
  console.log(`server is running... ${port}`);
});
