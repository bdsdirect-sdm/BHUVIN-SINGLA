
import express from "express"
import { dbconnect } from "./config/dbconnect";
import app from "./index"

dbconnect();

app.listen(4401, () => {
    console.log("Server is running on port 4401")
})




export default app;
