import express from "express"
import { connectDbFn } from "../DB/db_connection.js";
import { router } from "../routes/routes.js";
import cors from "cors";


let app = express();
// console.log(app);

app.use(cors({
  origin: 'http://localhost:5173', // <--  React app 
  credentials: true // only needed for cookies or sessions
}));

// Logger Middleware
// app.use((req, res, next) => {
//   console.log(`[${req.method}] ${req.url}`);
//   next();
// });

app.use(express.json())
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