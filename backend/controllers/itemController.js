const db = require('../config/db');

const allowedStatuses = ['active', 'pending', 'completed'];

const getItems = async (req, res, next) => {
  try {
    const [items] = await db.query(
      'SELECT * FROM items WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ items });
  } catch (error) {
    next(error);
  }
};

const getItemById = async (req, res, next) => {
  try {
    const [items] = await db.query(
      'SELECT * FROM items WHERE id = ? AND user_id = ? LIMIT 1',
      [req.params.id, req.user.id]
    );

    if (!items.length) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    res.json({ item: items[0] });
  } catch (error) {
    next(error);
  }
};

const createItem = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: 'Title is required.' });
    }

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const [result] = await db.query(
      'INSERT INTO items (user_id, title, description, status) VALUES (?, ?, ?, ?)',
      [req.user.id, title.trim(), description?.trim() || null, status || 'active']
    );

    const [items] = await db.query('SELECT * FROM items WHERE id = ? LIMIT 1', [result.insertId]);

    res.status(201).json({ message: 'Item created successfully.', item: items[0] });
  } catch (error) {
    next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    const [existingItems] = await db.query(
      'SELECT id FROM items WHERE id = ? AND user_id = ? LIMIT 1',
      [req.params.id, req.user.id]
    );

    if (!existingItems.length) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    if (!title?.trim()) {
      return res.status(400).json({ message: 'Title is required.' });
    }

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    await db.query(
      'UPDATE items SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?',
      [title.trim(), description?.trim() || null, status || 'active', req.params.id, req.user.id]
    );

    const [items] = await db.query(
      'SELECT * FROM items WHERE id = ? AND user_id = ? LIMIT 1',
      [req.params.id, req.user.id]
    );

    res.json({ message: 'Item updated successfully.', item: items[0] });
  } catch (error) {
    next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const [result] = await db.query('DELETE FROM items WHERE id = ? AND user_id = ?', [
      req.params.id,
      req.user.id
    ]);

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    res.json({ message: 'Item deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed
      FROM items
      WHERE user_id = ?`,
      [req.user.id]
    );

    const stats = rows[0] || {};
    res.json({
      stats: {
        total: Number(stats.total || 0),
        active: Number(stats.active || 0),
        pending: Number(stats.pending || 0),
        completed: Number(stats.completed || 0)
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getStats
};
