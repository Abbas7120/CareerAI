const express = require("express");
const router  = express.Router();
const db      = require("../config/mysql");

// GET /api/dashboard/history/:clerkUserId
router.get("/history/:clerkUserId", async (req, res) => {
  try {
    const { clerkUserId } = req.params;
    const { feature } = req.query;

    let query  = `SELECT * FROM user_outputs WHERE clerk_user_id = ?`;
    const params = [clerkUserId];

    if (feature) {
      query += ` AND feature = ?`;
      params.push(feature);
    }

    query += ` ORDER BY created_at DESC LIMIT 50`;

    const [rows] = await db.query(query, params);
    return res.json({ success: true, history: rows });
  } catch (err) {
    console.error("[dashboard/history]", err.message);
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/stats/:clerkUserId
router.get("/stats/:clerkUserId", async (req, res) => {
  try {
    const { clerkUserId } = req.params;

    const [rows] = await db.query(
      `SELECT feature, COUNT(*) as count 
       FROM user_outputs 
       WHERE clerk_user_id = ? 
       GROUP BY feature`,
      [clerkUserId]
    );

    const stats = {};
    rows.forEach(r => { stats[r.feature] = Number(r.count); });

    return res.json({ success: true, stats });
  } catch (err) {
    console.error("[dashboard/stats]", err.message);
    return res.status(500).json({ error: err.message });
  }
});

// DELETE /api/dashboard/history/:id
router.delete("/history/:id", async (req, res) => {
  try {
    const { id }          = req.params;
    const { clerkUserId } = req.body;

    await db.query(
      `DELETE FROM user_outputs WHERE id = ? AND clerk_user_id = ?`,
      [id, clerkUserId]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error("[dashboard/delete]", err.message);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;