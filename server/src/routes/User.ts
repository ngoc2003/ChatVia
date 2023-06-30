import { getListFriend, getUserById, updateInformation } from '../controllers/UserControllers';

const router = require('express').Router();

router.get('/', getUserById);
router.get('/friendList', getListFriend);
router.post('/updateInformation', updateInformation);

module.exports = router;
