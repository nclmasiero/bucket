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
  const data = req.body.data;
  if (!data) return res.sendStatus(400);

  console.log("new data received");

  fs.writeFileSync("./public/img.png", Buffer.from(data, "base64"));
  
  res.sendStatus(200);
});

app.use(express.static("public"));

app.listen(3000, console.log("app running..."));