export const validateToken = (req, res, next) => {
  console.log("Validating token");
  const token = req.query.token;
  console.log(token)

  if (!token) {
    return res.status(403).json({ error: "Access denied" });
  }

  next();
};
