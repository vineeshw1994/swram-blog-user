const { Router } = require('express');
const { signup, login, logout, refresh } = require('../controllers/auth');

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);

module.exports = router; 