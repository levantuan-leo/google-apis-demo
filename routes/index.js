var express = require("express");
var jwt = require("jsonwebtoken");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get(
  "/dashboard",
  (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(403).send("Token is invalid");
        }
        req.user = user;
        next();
      });
    } else {
      return res.status(401).send("Unauthenticated");
    }
  },
  function (req, res) {
    return res.render("index", { title: "Dashboard", user: req.user });
  }
);

module.exports = router;
