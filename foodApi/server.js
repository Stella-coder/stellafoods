const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const port = 4009;
const router = require("./router");
const app = express();
app.use(cors());
const url =
  "mongodb+srv://L5bjWCPqd6IHur0Q:L5bjWCPqd6IHur0Q@backend.es1b8.mongodb.net/nfoodDB?retryWrites=true&w=majority";

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected successfully");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use(express.json());

app.get("/", (req, res) => {
  res.send("welcome to my Api");
});
app.use("/api", router);

app.listen(port, () => {
  console.log(`server is listening to ${port}`);
});
