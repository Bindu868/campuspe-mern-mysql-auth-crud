const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getStats
} = require('../controllers/itemController');

const router = express.Router();

router.use(authMiddleware);
router.get('/', getItems);
router.get('/stats', getStats);
router.get('/:id', getItemById);
router.post('/', createItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

module.exports = router;
