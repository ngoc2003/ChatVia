import express from 'express';
import {
    blockConversation,
    createConversation,
    deleteConversation,
    getConversation,
    getImage,
    unBlockConversation,
    updateConversation
} from '../controllers/ConversationControllers';
const router = express();

router.post('/', createConversation);

router.get('/image', getImage);

router.get('/:userId', getConversation);

router.post('/delete/:conversationId', deleteConversation);

router.post('/update/:conversationId', updateConversation);

router.post('/block/:conversationId', blockConversation);

router.post('/unblock/:conversationId', unBlockConversation);

module.exports = router;
