const cron = require('node-cron');
const { init } = require('./utils/init')
const updateData = require('./utils/app')


init()
    .then(data => {
        updateData().then(console.info('Initializing Worker Process'));
        console.log('Cron Worker Process Running');
        cron.schedule('0 */4 * * *', () => {
            console.log('Checking For Updates on server');
            updateData()
                .then(console.log('Success'))
        })
});
