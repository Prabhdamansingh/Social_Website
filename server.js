const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("hello")); // sending data to browser

const PORT = process.env.PORT || 5000; // this we are setting up the port where will listen from the server , if we set heruko it will take env varianble port to send data otherwise local host of 5000 will be used
app.listen(PORT, () => console.log(`server startde on ${PORT}`));
