import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import mongo from "mongodb";

import { ResponseSchema } from "./models/express";
import { ItemPayload } from "./models/item";

import createUserRouter from "./routes/user";

import verify from "./verify";
import addUser from "./add-user";
import addItem from "./add-item";
import like from "./like";
import login from "./login";
import logout from "./logout";
import follow from "./routes/user/follow";

import connect, { Collections } from "./db/database";
import { ifLoggedInMiddleware } from "./cookies/auth";
import { respond } from "./utils/response";

dotenv.config();

const {
    PORT,
    HOST,
    DB_HOST,
    DB_PORT,
    DB_NAME: MONGO_DB,
    DB_USER,
    DB_PASSWORD
} = process.env;

const LISTEN_PORT = Number(PORT) || 6969;
const LISTEN_HOST = HOST || "0.0.0.0";
const MONGO_PORT = DB_PORT || 27017;
const MONGO_HOST = DB_HOST || "localhost";

const app = express();

app.disable("x-powered-by");
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("tiny"));

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

app.post("/verify", (req, res) => verify(req, res, Collections.Users));

app.use("/additem", ifLoggedInMiddleware);
app.post("/additem", (req, res) => {
    addItem(req, res, Collections.Items);
});

app.get("/item/:id", async (req, res) => {
    try {
        const result = await Collections.Items.findOne({
            id: req.params.id
        });

        if (!result) {
            throw new Error("Item not found!");
        }

        const item: ItemPayload = {
            id: result.id,
            username: result.ownerName,
            content: result.content,
            childType: result.childType,
            timestamp: result.timestamp,
            retweeted: result.retweeted,
            property: {
                likes: result.likes
            }
        };

        res.send({
            status: "OK",
            item
        } as ResponseSchema);
    } catch (e) {
        // If given itemid is invalid, then ObjectID constructor will throw an error
        respond(res, e.message);
    }
});

app.use("/item/:id/like", ifLoggedInMiddleware);
app.get("/item/:id/like", (req, res) => like(req, res, Collections.Items));

app.post("/search", async (req, res) => {
    try {
        const { body: {
            limit: reqLimit, timestamp: reqTimestamp
        } } = req;

        if (typeof reqLimit !== "number" && reqLimit !== undefined) {
            throw new Error(`Limit value super incorrect!`);
        }

        if (reqLimit < 0) {
            throw new Error(`Limit value ${reqLimit} is malformed!`);
        }

        let limit;

        if (!reqLimit) {
            limit = 25;
        } else if (reqLimit > 100) {
            limit = 100;
        } else {
            limit = reqLimit;
        }

        if (
            (typeof reqTimestamp !== "number" && reqTimestamp !== undefined)
            || reqTimestamp < 0
        ) {
            throw new Error(`Timestamp value "${reqTimestamp}" is malformed!`);
        }

        const timestamp = reqTimestamp || Math.round(Date.now() / 1000);

        const items: any[] = [];

        await Collections.Items.find({
            timestamp: { $lte: timestamp }
        }, { limit }).forEach((item) => {
            item.id = item._id.toHexString();
            items.push(item);
        });

        res.send({
            status: "OK",
            items
        });
    } catch (e) {
        respond(res, e.message);
    }
});

app.use("/follow", ifLoggedInMiddleware);
app.post("/follow", (req, res) => follow(
    req,
    res,
    Collections.Follows,
    Collections.Users
));

app.use("/user", (req, res, next) => createUserRouter(
    req,
    res,
    next,
    Collections
));

const DB_CREDENTIALS = DB_USER && DB_PASSWORD
    ? `${DB_USER}:${DB_PASSWORD}@`
    : "";

mongo.MongoClient.connect(
    `mongodb://${DB_CREDENTIALS}${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`,
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
