const express = require("express");
const app = express();

app.get("/", function (req, res) {
    res.send("Hello Serhii");
});

app.listen(3000);
