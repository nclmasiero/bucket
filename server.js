require("dotenv").config();

const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb' }));

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.post("/post", async (req, res) => {
  if (!req.body.name) return res.json({ result: false, message: "No file name specified" });
  if (!req.body.extension) return res.json({ result: false, message: "No file extension specified" });
  if (!req.body.bytes) return res.json({ result: false, message: "No bytes specified" });

  const path = "./public/" + req.body.name + "." + req.body.extension;
  if (fs.existsSync(path)) return res.json({ result: false, message: "A file with this name already exists" });

  console.log("received instruction to store at: " + path);
  if (process.env.ENVIRONMENT == "production") fs.writeFileSync(path, Buffer.from(req.body.bytes, "base64"));
  else {
    fs.writeFileSync(path, Buffer.from("fake file"));
    console.log("Testing environment detected. Pretending to save an image...");
  }
  
  res.json({ result: true, message: "File saved at " + path, path: path });
});

app.post("/del", async (req, res) => {
  if (!req.body.name) return res.json({ result: false, message: "No file name specified" });
  if (!req.body.extension) return res.json({ result: false, message: "No file extension specified" });

  const path = "./public/" + req.body.name + "." + req.body.extension;
  if (!fs.existsSync(path)) return res.json({ result: false, message: "A file with that name does not exist" });

  console.log("received instruction to delete at: " + path);
  fs.unlinkSync(path);

  res.json({ result: true, message: "File deleted at " + path, path: path });
});

app.post("/copy", async (req, res) => {
  if (!req.body.name) return res.json({ result: false, message: "No file name specified" });
  if (!req.body.extension) return res.json({ result: false, message: "No file extension specified" });
  if (!req.body.destination) return res.json({ result: false, message: "No destination specified" });

  const path = "./public/" + req.body.name + "." + req.body.extension;
  const newPath = "./public/" + req.body.destination + "." + req.body.extension;
  if (!fs.existsSync(path)) return res.json({ result: false, message: "A file with that name does not exist" });
  if (fs.existsSync(newPath)) return res.json({ result: false, message: "The destination file already exists" });

  console.log("received instruction to copy from: " + path + " to " + newPath);
  fs.copyFileSync(path, newPath);

  res.json({ result: true, message: "File copied at " + newPath, path: newPath });
});

app.use(express.static("public"));

app.listen(process.env.PORT, console.log("app running on port: " + process.env.PORT + " and environment: " + process.env.ENVIRONMENT));

// check if the public dir exists
if (!fs.existsSync("./public")) {
  // if not, create it
  console.log("Public dir not found. Creating one...");
  fs.mkdirSync("./public");
}