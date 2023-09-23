// const express = require('express')
// const app = express()
// app.all('/', (req, res) => {
//     console.log("Just got a request!")
//     res.send('Yo!')
// })
// app.listen(process.env.PORT || 3000)

const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const admin = require("firebase-admin");

const serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const express = require("express");
const app = express();
const db = admin.firestore();

const cors = require("cors");
app.use(cors({ origin: true }));
const PORT = process.env.PORT || 3000;

// Welcome route
app.get("/", (req, res) => {
  return res.status(200).send("This is an API for the CICT Career Guidance");
});

// READ the database of grades
app.get("/api/grades", async (req, res) => {
  try {
    const dataRef = db.collection("database");
    const snapshot = await dataRef.get();
    const data = snapshot.docs.map((doc) => ({
      doc: doc.id,
      data: doc.data(),
    }));
    res.json(data);
  } catch (error) {
    logger.error("Error fetching data:", error);
    res.status(500).json({error: "Internal Server Error"});
  }
});


// Retrieve the CSDataset from firebase
app.get("/api/dataset/cs", async (req, res) => {
  try {
    const bucket = admin.storage().bucket("gs://ocg-knn.appspot.com/");
    const file = bucket.file("dataset/CSDataset.csv");
    const [fileBuffer] = await file.download();
    res.setHeader("Content-Type", "application/csv");
    res.setHeader("Content-Disposition", "attachment; filename=CSDataset.csv");
    res.send(fileBuffer);
    logger.info("CS File retrieve success");
  } catch (error) {
    logger.error("Error retrieving file from Firebase Storage:", error);
    res.status(500).json({error: error});
  }
});

// Retrieve the ISDataset from firebase
app.get("/api/dataset/is", async (req, res) => {
  try {
    const bucket = admin.storage().bucket("gs://ocg-knn.appspot.com/");
    const file = bucket.file("dataset/ISDataset.csv");
    const [fileBuffer] = await file.download();
    res.setHeader("Content-Type", "application/csv");
    res.setHeader("Content-Disposition", "attachment; filename=ISDataset.csv");
    res.send(fileBuffer);
    logger.info("IS File retrieve success");
  } catch (error) {
    logger.error("Error retrieving file from Firebase Storage:", error);
    res.status(500).json({error: error});
  }
});

// Retrieve the ITDataset from firebase
app.get("/api/dataset/it", async (req, res) => {
  try {
    const bucket = admin.storage().bucket("gs://ocg-knn.appspot.com/");
    const file = bucket.file("dataset/ITDataset.csv");
    const [fileBuffer] = await file.download();
    res.setHeader("Content-Type", "application/csv");
    res.setHeader("Content-Disposition", "attachment; filename=ITDataset.csv");
    res.send(fileBuffer);
    logger.info("IT File retrieve success");
  } catch (error) {
    logger.error("Error retrieving file from Firebase Storage:", error);
    res.status(500).json({error: error});
  }
});

app.listen(process.env.PORT || 3000)
