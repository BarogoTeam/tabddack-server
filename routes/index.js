import * as gameService from '../services/gameService'

let express = require('express');
let router = express.Router();

router.get('/game', (req, res, next) => {
    res.send(gameService.getAnalysisData());
})

module.exports = router;