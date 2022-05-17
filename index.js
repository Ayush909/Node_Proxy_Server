require('dotenv').config();
const rateLimit = require('express-rate-limit')
const express = require('express')
const cors = require('cors')

const app = express();

const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max : 5
})

app.use(express.static('public'))

// app.use(limiter)
app.use(cors());

app.use('/api',require('./routes/index'))

app.listen(PORT, ()=>  console.log(`Server running on ${PORT}`));