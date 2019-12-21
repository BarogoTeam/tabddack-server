const userService = require('./services/userService')

const express = require('express');
const app = express();
const port = 3000;

//init
userService.setUserList();

//schedule
const cron = require('node-cron')
cron.schedule('0 0 * * *', () => {
    console.log('Update User List')
    userService.setUserList();
})

let routes = require('./routes/index')
app.use('/v1', routes);

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});