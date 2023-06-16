var express = require("express");
const jwt = require("jsonwebtoken");
var router = express.Router();

router.get("/login", function (req, res, next) {
  res.render("login", { title: "Login" });
});

router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/auth/login");
});

router.post("/google/callback", async function (req, res, next) {
  // Verify the Cross-Site Request Forgery (CSRF) token.
  const csrfTokenCookie = req.cookies["g_csrf_token"];
  if (!csrfTokenCookie) return res.send(400, "No CSRF token in Cookie.");
  const csrfTokeBody = req.body["g_csrf_token"];
  if (!csrfTokeBody) return res.send(400, "No CSRF token in post body.");
  if (csrfTokenCookie != csrfTokeBody)
    return res.send(400, "Failed to verify double submit cookie.");

  req.oauth2Client.setCredentials({ id_token: req.body["credential"] });

  console.log(req.oauth2Client);

  const ticket = await req.oauth2Client.verifyIdToken({
    idToken: req.oauth2Client.credentials.id_token,
  });
  console.log(ticket);

  const token = jwt.sign(
    {
      name: ticket.payload.name,
      email: ticket.payload.email,
      avatar: ticket.payload.picture,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  // Save the token as a cookie
  res.cookie("jwt", token);

  return res.redirect("/dashboard");
});

module.exports = router;
