import path from "path";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import multer from "multer";
import morgan from "morgan";
import mongo from "mongodb";

import { ResponseSchema } from "./models/express";
import { ItemPayload } from "./models/item";

import createUserRouter from "./routes/user";

import verify from "./verify";
import addUser from "./add-user";
import addItem from "./add-item";
import like from "./like";
import deleteItem from "./delete-item";
import login from "./login";
import logout from "./logout";
import follow from "./routes/user/follow";
import addMedia from "./routes/media/add-media";
import media from "./routes/media/media";
import search from "./search/search";

import connect, { Collections } from "./db/database";
import { loggedInOnly } from "./cookies/auth";
import { respond } from "./utils/response";
import elastic from "./utils/elasticsearch";
import CassandraClient from "./utils/cassandra";

dotenv.config();
elastic();

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
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("tiny"));
app.use(express.static(path.join(__dirname, "../../chirp-ui-static/")));

let db: mongo.Db;
let Collections: Collections;
let cassandra = new CassandraClient();

let upload = multer();

app.use(
    [
        "/logout",
        "/additem",
        "/item/:id/like",
        "/follow"
    ],
    loggedInOnly()
);

app.post("/adduser", (req, res) => {
    addUser(req, res, Collections.Users);
});

app.post("/login", (req, res) => {
    login(req, res, Collections.Users);
});

app.post("/logout", logout);

app.post("/verify", (req, res) => verify(req, res, Collections.Users));

app.post("/additem", (req, res) => {
    addItem(req, res, Collections.Items);
});

app.get("/item/:id", async (req, res) => {
    try {
        const { params: { id } } = req;

        if (!id) {
            throw new Error("No item provided.");
        }

        const result = await Collections.Items.findOne({
            _id: id,
        });

        if (!result) {
            throw new Error(`Item ${id} not found!`);
        }

        const item: ItemPayload = {
            id: result._id,
            username: result.ownerName,
            content: result.content,
            childType: result.childType,
            timestamp: result.timestamp,
            retweeted: result.retweeted,
            parent: result.parentID,
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

app.post("/item/:id/like", (req, res) => like(
    req, res, Collections.Items, Collections.Likes
));

app.delete(
    "/item/:id",
    loggedInOnly(),
    (req, res) => deleteItem(req, res, Collections.Items)
);

app.post("/search", async (req, res) => search(
    req, res, Collections.Items, Collections.Follows
));

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

app.post(
    "/addmedia",
    upload.single('content'),
    loggedInOnly(),
    (req, res) => addMedia(req, res, cassandra)
);

app.get(
    "/media/:id",
    (req, res) => media(req, res, cassandra)
);

app.get("/elastic/clear", async (_, res) => {
    await elastic().deleteAll();

    res.send({
        status: "OK"
    });
});

app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../../chirp-ui-static/index.html"));
});

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
