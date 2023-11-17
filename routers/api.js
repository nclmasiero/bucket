const express = require("express");
const router = express.Router();

const fs = require("fs");

router.post("/post", async (req, res) => {
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
  
  res.json({
    result: true,
    message: "File saved at " + path,
    url: process.env.URL + "/" + req.body.name + "." + req.body.extension
  });
});

router.post("/del", async (req, res) => {
  if (!req.body.name) return res.json({ result: false, message: "No file name specified" });
  if (!req.body.extension) return res.json({ result: false, message: "No file extension specified" });

  const path = "./public/" + req.body.name + "." + req.body.extension;
  if (!fs.existsSync(path)) return res.json({ result: false, message: "A file with that name does not exist" });

  console.log("received instruction to delete at: " + path);
  fs.unlinkSync(path);

  res.json({
    result: true,
    message: "File deleted at " + path,
    url: process.env.URL + "/" + req.body.name + "." + req.body.extension
  });
});

router.post("/copy", async (req, res) => {
  if (!req.body.name) return res.json({ result: false, message: "No file name specified" });
  if (!req.body.extension) return res.json({ result: false, message: "No file extension specified" });
  if (!req.body.destination) return res.json({ result: false, message: "No destination specified" });

  const path = "./public/" + req.body.name + "." + req.body.extension;
  const newPath = "./public/" + req.body.destination + "." + req.body.extension;
  if (!fs.existsSync(path)) return res.json({ result: false, message: "A file with that name does not exist" });
  if (fs.existsSync(newPath)) return res.json({ result: false, message: "The destination file already exists" });

  console.log("received instruction to copy from: " + path + " to " + newPath);
  fs.copyFileSync(path, newPath);

  res.json({
    result: true,
    message: "File copied at " + newPath,
    url: process.env.URL + "/" + req.body.destination + "." + req.body.extension
  });
});

module.exports = router;