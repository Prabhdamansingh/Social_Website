const express = require("express");
const connectDB = require("./config/db");
const app = express();

// connect db
connectDB();

// sending data to browser
app.get("/", (req, res) => res.send("hello"));

//init middelware
app.use(express.json({ extended: false }));

// Define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/auth", require("./routes/api/auth"));

const PORT = process.env.PORT || 5000; // this we are setting up the port where will listen from the server , if we set heruko it will take env varianble port to send data otherwise local host of 5000 will be used
app.listen(PORT, () => console.log(`server started on ${PORT}`));
