const moment = require('moment')

const startDate = moment('2020-02-29')

const verifiedDay = (day) => {
    let endDate = moment();

    return moment(day).isValid() && moment(day).isBetween(startDate, endDate);
}

module.exports = { verifiedDay }