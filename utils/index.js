import express from "express"
import { connectDbFn } from "../DB/db_connection.js";
import { router } from "../routes/routes.js";
import cors from "cors";
import cookieParser from 'cookie-parser';
// import jwt from 'jsonwebtoken';

let app = express();
// console.log(app);

// origin: 'http://localhost:5173',

app.use(cors({
  origin: `${process.env.CORS_ORIGIN}`,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], 
  credentials: true // only needed for cookies or sessions
}));
 


app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} | Cookie:`, req.cookies);
  next();
});

app.use("/user", router)


connectDbFn()
.then(() => {
    const _PORT = process.env.PORT || 8000;
    app.listen( _PORT, () => {
        console.log(`Server is running at port : ${_PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})