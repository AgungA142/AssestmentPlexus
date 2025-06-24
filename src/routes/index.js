const express = require('express');

const router = express.Router();
const authRoutes = require('./auth');
const userRoutes = require('./user');
const leaderboardRoutes = require('./leaderboard');
const scoreRoutes = require('./score');
const shopRoutes = require('./shop');
const battlepassRoutes = require('./battlepass');



router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/score', scoreRoutes);
router.use('/shop', shopRoutes);
router.use('/battlepass', battlepassRoutes);

module.exports = router;