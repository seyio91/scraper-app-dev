const { dbQuery } = require('../db/dbQuery')
const moment = require('moment')
const client = require('../utils/redisClient')
const { verifiedDay } = require('../utils/validations')
const { successMsg, errorMsg, status } = require('../utils/status')

const getTimeLine = async (req, res) => {
    let totalQuery = 'SELECT * FROM summary ORDER BY date DESC';
    try {
        let data = await client.get('mainChart');
        if (!data){
            const { rows } = await dbQuery(totalQuery);
            week = dateParse(rows)
            data = Object.values(week).reverse();
            await client.setex('mainChart', 43200 ,JSON.stringify(data))
        }else{
            data = JSON.parse(data)
        }
        successMsg.data = data
        return res.status(status.success).json(successMsg)

    } catch(error){
        errorMsg.error = error
        res.status(status.error).json(errorMsg)
    }
}

const healthCheck = async(req, res) => {
    successMsg.data = { status: "success" }
    return res.status(status.success).json(successMsg);
}


const dailyEvent = async( req, res ) => {
    try {
        let overview = await client.get('overview');
        if (!overview){
            hours = await dbQuery(`SELECT date FROM ticks ORDER BY date DESC LIMIT 1`);
            lastTime = moment(hours.rows[0].date).format('YYYY-MM-DD');
            let lastEvent = `SELECT * FROM ticks WHERE date = '${lastTime}' ORDER BY date;`
            let lastQuery = `SELECT * FROM summary WHERE date = '${lastTime}' LIMIT 1;`
            let [ event, sum ] = await Promise.all([dbQuery(lastEvent), dbQuery(lastQuery)])
            let data = event.rows;
            let summary = sum.rows[0]
            overview = { summary, data }
            await client.setex('overview', 34800, JSON.stringify(overview));
        } else {
            overview = JSON.parse(overview);
        }
        successMsg.data = overview
        return res.status(status.success).json(successMsg);

    } catch (error) {
        errorMsg.error = error
        res.status(status.error).json(errorMsg)
    }
}



// summary
const getSummary = async(req, res) => {
    try {
        let data = await client.get('lastSummary')
        if (!data){
            hours = await dbQuery(`SELECT date FROM summary ORDER BY date DESC LIMIT 1`);
            lastTime = moment(hours.rows[0].date).format('YYYY-MM-DD');
            let lastQuery = `SELECT * FROM summary WHERE date = '${lastTime}' ORDER BY date;`
            const { rows } = await dbQuery(lastQuery);
            data = rows[0]
            await client.set('lastSummary', JSON.stringify(data))
        } else {
            data = JSON.parse(data)
        }

        successMsg.data = data
        return res.status(status.success).json(successMsg)

    } catch (error) {
        errorMsg.error = error
        res.status(status.error).json(errorMsg)
    }
}



const getEventDay = async( req, res ) => {
    try {

        day = req.params.date;
        if (!verifiedDay(day)){

            return res.redirect('/api/user/v1/events');
        }

        let overview = await client.get(`overview-${day}`);

        if (!overview){
            let lastEvent = `SELECT * FROM ticks WHERE date = '${day}';`
            let lastQuery = `SELECT * FROM summary WHERE date = '${day}' LIMIT 1;`
            let [ event, sum ] = await Promise.all([dbQuery(lastEvent), dbQuery(lastQuery)])
            let data = event.rows;
            let summary = sum.rows[0]
            overview = { summary, data }
            await client.setex(`overview-${day}`, 34800, JSON.stringify(overview));
        } else {
            overview = JSON.parse(overview);
        }
        successMsg.data = overview
        return res.status(status.success).json(successMsg);

    } catch (error) {
        errorMsg.error = error
        res.status(status.error).json(errorMsg)
    }
}





const dateParse = (arrayObj) => {
    weeklyData = {};
    arrayObj.forEach(data => {
        week = moment(data.date).month();
        if(!weeklyData[week]){
            weeklyData[week] = data
        } else {
            highData = weeklyData[week].totalcases > data.totalcases ? weeklyData[week] : data;
            weeklyData[week] = highData;
        }
    })
    return weeklyData

}

module.exports = { dailyEvent ,getTimeLine, getSummary, getEventDay, healthCheck };
