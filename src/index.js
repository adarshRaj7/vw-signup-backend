const express = require("express");
const app = express();
const { config } = require("./server.config");
const signUpRoute = require("./routes/signUpRoute");
const addDetailsRoute = require("./routes/addDetailsRoute");
config(app);

app.get("/", (req, res, next) => {
  res.status(200).json({
    message: "hello from server",
  });
});

app.use("/api", signUpRoute);
app.use("/api", addDetailsRoute);
app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
