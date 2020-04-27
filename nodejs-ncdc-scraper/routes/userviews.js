const express = require('express');

const { subscribe } = require('../utils/event');

const { dailyEvent ,getTimeLine, getSummary, getEventDay, healthCheck } = require('../controllers/dbGet');

const router = express.Router();


router.get('/timeline', getTimeLine)

router.get('/events', dailyEvent)

router.get('/summary', getSummary)

router.get('/stream', subscribe )

router.get('/events/:date', getEventDay)

router.get('/health', healthCheck)






module.exports = router;