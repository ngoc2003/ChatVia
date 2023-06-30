import express from 'express';
import { createMessage, getMessageByConversationId, deleteMessage, pinMessage, unpinMessage } from '../controllers/MessageControllers';

const router = express();

router.post('/', createMessage);

router.get('/:conversationId', getMessageByConversationId);

router.post('/delete/:messageId', deleteMessage);

router.post('/pin/:messageId', pinMessage);

router.post('/unpin/:messageId', unpinMessage);

module.exports = router;
