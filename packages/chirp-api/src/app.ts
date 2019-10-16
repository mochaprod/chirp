import dotenv from "dotenv";
import express from "express";

dotenv.config();

const {
    PORT,
    HOST
} = process.env;

const LISTEN_PORT = Number(PORT) || 6969;
const LISTEN_HOST = HOST || "0.0.0.0";

const app = express();

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/adduser", (req, res) => {});

app.post("/login", (req, res) => {});

app.post("/logout", (req, res) => {});

app.post("/verify", (req, res) => {});

app.post("/additem", (req, res) => {});

app.get("/item/:itemid", (req, res) => {
    res.send("Your item id is: " + req.params.itemid);
});

app.post("/search", (req, res) => {});

app.listen(
    LISTEN_PORT,
    LISTEN_HOST,
    () => console.log(`API Server listening on port ${LISTEN_HOST}:${LISTEN_PORT}`)
);
