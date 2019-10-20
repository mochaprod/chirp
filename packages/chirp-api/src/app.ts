import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import mongo, { ObjectId } from "mongodb";

import connect, { Collections } from "./db/database";
import addUser from "./add-user";
import login from "./login";
import logout from "./logout";
import { ifLoggedInMiddleware } from "./cookies/auth";

dotenv.config();

const {
    PORT,
    HOST,
    DB_HOST,
    DB_PORT,
    DB_NAME: MONGO_DB
} = process.env;

const LISTEN_PORT = Number(PORT) || 6969;
const LISTEN_HOST = HOST || "0.0.0.0";
const MONGO_PORT = DB_PORT || 27017;
const MONGO_HOST = DB_HOST || "localhost";

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

let db: mongo.Db;
let Collections: Collections;

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/adduser", (req, res) => {
    addUser(req, res, Collections.Users);
});

app.post("/login", (req, res) => {
    login(req, res, Collections.Users);
});

app.use("/logout", ifLoggedInMiddleware);
app.post("/logout", logout);

app.post("/verify", (req, res) => { });

app.post("/additem", (req, res) => {
    // TODO: User verification; add a username field
    Collections.Items.insertOne({
        content: req.body.content,
        childType: req.body.childType,
        timestamp: Math.round(Date.now() / 1000),
        username: "",
        retweeted: 0,
        property: {
            likes: 0,
        },
    })
        .then((result) => {
            res.send({
                status: "OK",
                id: result.insertedId,
            });
        })
        .catch((err) => {
            res.send({
                status: "error",
                error: err,
            });
        });
});

app.get("/item/:itemid", (req, res) => {
    try {
        db.collection("item").findOne({
            _id: new ObjectId(req.params.itemid),
        })
            .then((result) => {
                if (result === null) {
                    throw new Error("Item not found!");
                }

                // Conform to API requirements
                result.id = result._id;
                res.send({
                    status: "OK",
                    item: result,
                });
            });
    } catch (e) {
        // If given itemid is invalid, then ObjectID constructor will throw an error
        res.send({
            status: "error",
            error: e.message,
        });
    }
});

app.post("/search", async (req, res) => {
    let limit;
    if (req.body.limit === undefined) {
        limit = 25;
    } else if (req.body.limit > 100) {
        limit = 100;
    } else {
        limit = req.body.limit;
    }

    const items: any[] = [];

    await Collections.Items.find({
        timestamp: { $lte: req.body.timestamp }
    }, { limit }).forEach((item) => {
        item.id = item._id;
        items.push(item);
    });

    res.send({
        status: "OK",
        items
    });
});

mongo.MongoClient.connect(
    `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`,
    {
        useUnifiedTopology: true
    },
    (err, database) => {
        if (err) { throw err; }

        db = database.db(MONGO_DB);
        Collections = connect(db);

        app.listen(
            LISTEN_PORT,
            LISTEN_HOST,
            () => console.log(`API Server listening on port ${LISTEN_HOST}:${LISTEN_PORT}`)
        );
    }
);
