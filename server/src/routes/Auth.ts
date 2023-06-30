import { getUser, login, register } from '../controllers/AuthControllers';

const router = require('express').Router();

router.post('/register', register);

router.post('/login', login);

router.post('/me', getUser);

module.exports = router;
