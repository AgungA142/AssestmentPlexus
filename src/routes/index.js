const express = require('express');

const router = express.Router();
const authRoutes = require('./auth');
const userRoutes = require('./user');
const leaderboardRoutes = require('./leaderboard');
const scoreRoutes = require('./score');



router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/score', scoreRoutes);

module.exports = router;