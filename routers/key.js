const express = require("express");
const router = express.Router();

router.post("*", (req, res, next) => {
  if (!req.body.key) return res.send("I see you.");
  if (req.body.key != process.env.KEY) return res.json({ result: false, message: "Invalid key" });

  next();
})

module.exports = router;