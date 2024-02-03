const express =  require('express');
const cors = require("cors")
const app = express();
const cookieParser = require('cookie-parser');

require("dotenv").config();

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:process.env.FRONTEND_URL,credentials: true,})); 
app.use(express.urlencoded({extended:false }))

require("./config/database").connect()

// route import and mount 
const user = require("./routes/user");
app.use("/user",user);

const budget = require("./routes/budget")
app.use("/budget",budget)

// Activate 
app.listen(PORT,() => {
    console.log("Server Run at ",PORT);
})

app.get("/", (req,res) => {
    res.send("<h1>Expense Tracker</h1>")
})