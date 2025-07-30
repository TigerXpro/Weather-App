const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

const indexRoutes = require("./routers/index.router");
const forecastRoutes = require("./routers/forecast.router");

app.use("/", indexRoutes);
app.use("/forecast", forecastRoutes);

app.use((req, res) => {
    res.status(404).render("404", { title: "Page Not Found" });
});

app.listen(3000, () => {
    console.log("listening");
});