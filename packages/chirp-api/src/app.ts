import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import * as mongo from "mongodb";
import { ObjectId } from "mongodb";

dotenv.config();

const {
    PORT,
    HOST
} = process.env;

const LISTEN_PORT = Number(PORT) || 6969;
const LISTEN_HOST = HOST || "0.0.0.0";

const app = express();
app.use(bodyParser.json());

const MONGO_PORT = 27017;
const MONGO_HOST = "localhost";

let db: mongo.Db;

mongo.MongoClient.connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/chirp`, (err, database) => {
    if (err) { throw err; }

    db = database.db("chirp");
});

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/adduser", (req, res) => {
    db.collection("user").insertOne({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    })
        .then((result) => {
            res.send({
                status: "OK",
            });
        })
        .catch((err) => {
            res.send({
                status: "error",
                error: err,
            });
        });
});

app.post("/login", (req, res) => { });

app.post("/logout", (req, res) => { });

app.post("/verify", (req, res) => { });

app.post("/additem", (req, res) => {
    // TODO: User verification; add a username field
    db.collection("item").insertOne({
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
                    res.send({
                        status: "error",
                        error: "Item not found!",
                    });
                    return;
                }

                // Conform to API requirements
                result.id = result._id;
                res.send({
                    status: "OK",
                    item: result,
                });
            });
    }
    catch (e) {
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

    let items: any[] = [];
    await db.collection("item").find({
        timestamp: { $lte: req.body.timestamp }
    }, { limit: limit }).forEach((item) => {
        item.id = item._id;
        items.push(item);
    })

    res.send({
        status: "OK",
        items: items,
    });
});

app.listen(
    LISTEN_PORT,
    LISTEN_HOST,
    () => console.log(`API Server listening on port ${LISTEN_HOST}:${LISTEN_PORT}`)
);
