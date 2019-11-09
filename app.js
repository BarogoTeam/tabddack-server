const express = require('express');
const app = express();
const port = 3000;

let routes = require('./routes/index')
app.use('/v1', routes);

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});