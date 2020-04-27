const cors = require('cors')
const handleError = require('./utils/errors')
const redisSubscriber = require('./utils/redis-sub-pub')
const express = require('express');
const userviews = require('./routes/userviews')



redisSubscriber().then(console.log('Subscribed to Redis Client'))


const bodyParser = require('body-parser');

const app = express()

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json());

app.use(cors())
app.use(express.static(__dirname + '/public'))

app.use('/api/user/v1', userviews)


// default error handling
app.use((req, res, next) => {
    res.status(404).send({
    status: 404,
    error: 'Not found'
    })
   })

// app.use(methodOverride())

app.use(function (err, req, res, next) {
    console.error(err.stack);
    handleError(err, res);
});

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
    console.log(`server is listening on port ${PORT}`)
});
