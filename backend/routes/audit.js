const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');


// Save audit log manually (optional route, or do it inside fund update)
router.post('/audit-log', async (req, res) => {
  const { action, userId, userFullName, fundName, changes } = req.body;

  if (!action || !userId || !userFullName || (action === 'updated' && !changes)) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    const log = new AuditLog({
      action,
      userId,
      userFullName,
      fundName,
      changes,
    });

    await log.save();
    res.status(201).json({ message: 'Audit log saved', log });
  } catch (err) {
    console.error('Failed to save audit log:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// GET all audit logs
router.get('/audit', async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});




module.exports = router;
