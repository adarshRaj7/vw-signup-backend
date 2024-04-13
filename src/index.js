const express = require("express");
const app = express();
const path=require('path');

const { config } = require("./server.config");
const signUpRoute = require("./routes/signUpRoute");
const addDetailsRoute = require("./routes/addDetailsRoute");
const addPreferancesRoute = require("./routes/addPreferancesRoute");
config(app);

app.get("/", (req, res, next) => {
  res.status(200).json({
    message: "hello from server",
  });
});

app.use("/api", signUpRoute);
app.use("/api", addDetailsRoute);
app.use('/api',addPreferancesRoute)
app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
