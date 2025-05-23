import express from "express"
import { connectDbFn } from "../DB/db_connection.js";
import { router } from "../routes/routes.js";
// import {app} '

let app = express();
// console.log(app);
app.use(express.json())
app.use("/user", router)

connectDbFn()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})