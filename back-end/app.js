import express from "express";
import cors from "cors";
import mysql from "mysql";
import bodyParser from "body-parser";
import multer from "multer";
import promisify from "util";
import * as fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "file_upload_db",
});

app.use(cors());

app.use(bodyParser.json());

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

const jwtSecret = "jwt-token";

app.post("/loggedin", (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;

  const sql = "SELECT * FROM users WHERE user_email = ? AND user_password = ?";
  db.query(sql, [userEmail, userPassword], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res
        .status(500)
        .json({ error: "An error occurred while processing the request" });
    } else {
      //console.log("Query results:", results);
      if (results.length > 0) {
        const user = results[0];

        const token = jwt.sign(
          {
            user_id: user.user_id,
            user_email: user.user_email,
          },
          jwtSecret
        );

        //console.log(req.headers['authorization']);
        //console.log("prijavljen");
        //console.log(token);
        res.status(200).json({
          message: "The user is successfully logged in!",
          result_id: user.user_id,
          token: token,
        });
      } else {
        console.log("The user is not logged in!");
        res.status(401).json({ error: "Incorrect username or password!" });
      }
    }
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  //console.log(req.headers);
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    //console.log(req.token);
    next();
  } else {
    res.sendStatus(403);
  }
}

async function checkEmail(userEmail) {
  const query = `SELECT COUNT(*) as count FROM users WHERE user_email LIKE ?`;
  return new Promise((resolve, reject) => {
    db.query(query, [userEmail], (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        //console.log(result[0].count === 0);
        resolve(result[0].count === 0);
      }
    });
  });
}

app.put("/newsignup", async (req, res) => {
  const userName = req.body.name;
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  if (await checkEmail(userEmail)) {
    const sql =
      "INSERT INTO users (user_name, user_email, user_password) VALUES(?, ?, ?) ";
    db.query(sql, [userName, userEmail, userPassword], (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({
          error: "An error occurred while processing the request!",
        });
      } else {
        console.log("Query results:", results);
        if (results) {
          console.log("The user is registered");
          res.status(201).json({
            message: "The user is registered!",
          });
        } else {
          console.log("User is not registered!");
          res.status(401).json({
            error: "An error occurred!",
          });
        }
      }
    });
  } else res.status(406).json({ error: "Email is already in use!" });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = parseInt(req.body.user_id, 10);
    const uploadPath = `../file-upload-app/src/assets/uploads/user_${userId}`;

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

async function checkImageEx(user_id, imagePath) {
  const imageP =
    `uploads/user_${user_id}\\` +
    imagePath.substring(imagePath.lastIndexOf("\\"));
  //console.log(imageP);
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT COUNT(*) as count FROM images WHERE user_id = ? AND image_path LIKE ?`,
      [user_id, imageP],
      (err, result) => {
        //console.log(result[0].count);
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(result[0].count === 0);
        }
      }
    );
  });
}

app.post("/uploadImage", upload.single("image"), async (req, res) => {
  const userId = parseInt(req.body.user_id, 10);
  const imageEx = await checkImageEx(userId, req.file.path);
  //console.log(imageEx);
  if (imageEx) {
    const relativePath = path.relative(
      "../file-upload-app/src/assets/uploads",
      req.file.path
    );
    db.query(
      "INSERT INTO images (user_id, image_path) VALUES (?, ?)",
      [userId, `uploads/${relativePath}`],
      (error, results) => {
        if (error) throw error;
        else res.status(200).json({ message: "Success" });
      }
    );
  } else {
    res.status(500).json({ error: "Image is already uploaded!" });
  }
});

app.get("/images/:userId", verifyToken, (req, res) => {
  const userId = req.params.userId;
  const query =
    "SELECT image_path FROM images WHERE user_id = ? ORDER BY images_id";

  db.query(query, userId, (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      //console.log({ result: results });
      res.json({ result: results });
    }
  });
});

// app.delete("/delete/:userId", verifyToken, (req, res) => {
//   const { imagePaths } = req.body.paths;
//   const userId = req.params.userId;

//   //console.log("Slika je: " + JSON.stringify(imagePaths[0]));
//   imagePaths.forEach((element) => {
//     var imageName = element.substring(element.lastIndexOf("\\") + 1);
//     // console.log("Slika je: " + imageName);
//     const query = "DELETE FROM images WHERE user_id = ? AND image_path = ?";
//     db.query(query, [userId, element], (error, results) => {
//       if (error) {
//         res.status(500).json({ error: error.message });
//       } else {
//         deleteImage(userId, imageName);
//         //console.log({ result: results });
//         res.json({ result: results });
//       }
//     });
//   });
// });

app.delete("/delete/:userId", verifyToken, async (req, res) => {
  try {
    const { imagePaths } = req.body.paths;
    const userId = req.params.userId;

    await Promise.all(
      imagePaths.map(async (element) => {
        const imageName = element.substring(element.lastIndexOf("\\") + 1);
        const query = "DELETE FROM images WHERE user_id = ? AND image_path = ?";

        return new Promise((resolve, reject) => {
          db.query(query, [userId, element], (error, results) => {
            if (error) {
              reject(error);
            } else {
              deleteImage(userId, imageName);
              resolve(results);
            }
          });
        });
      })
    );
    res.json({ message: "Images deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const deleteImage = (userId, imageName) => {
  const imagePath = `../file-upload-app/src/assets/uploads/user_${userId}/${imageName}`;

  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
    console.log(`The image ${imageName} has been successfully deleted`);
  } else {
    console.log(`Image ${imageName} does not exist`);
  }
};

app.listen(port, () => {
  console.log(`App is up and running at port: ${port}`);
});
