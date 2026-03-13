const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

const app = express();

// ✅ Allow all origins during development
app.use(cors());
app.use(express.json());

// ✅ Database connection pool using environment variables
const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

// Test connection
db.getConnection()
  .then(conn => {
    console.log("Database connected successfully!");
    conn.release();
  })
  .catch(err => {
    console.error("Database connection failed:", err.message);
  });

// ✅ Helper: normalize row keys
function normalizeRow(r) {
  return {
    id: r.id,
    user: r.user,
    service: r.service,
    link: r.link,
    qty: r.qty,
    charges: r.charges,
    status: r.status,
    date: r.date
  };
}

// GET all orders
app.get('/orders', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders');
    const normalized = rows.map(normalizeRow);
    res.json(normalized);
  } catch (err) {
    console.error("Error fetching orders:", err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET dashboard metrics
app.get('/dashboard', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders');
    const orders = rows.map(normalizeRow);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.charges || 0), 0);
    const netProfit = totalRevenue * 0.35;
    const activeUsers = new Set(orders.map(o => o.user)).size;

    const statusCounts = {
      completed: orders.filter(o => o.status?.toLowerCase() === "completed").length,
      processing: orders.filter(o =>
        o.status?.toLowerCase() === "processing" ||
        o.status?.toLowerCase() === "progressing"
      ).length,
      pending: orders.filter(o => o.status?.toLowerCase() === "pending").length,
      cancelled: orders.filter(o =>
        o.status?.toLowerCase() === "cancelled" ||
        o.status?.toLowerCase() === "canceled"
      ).length
    };

    res.json({
      totalRevenue,
      netProfit,
      activeUsers,
      totalOrders: orders.length,
      statusCounts,
      orders
    });
  } catch (err) {
    console.error("Error fetching dashboard metrics:", err.message);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
});

// POST add new order
app.post('/orders', async (req, res) => {
  try {
    console.log("Received order:", req.body);

    const { user, service, link, qty, charges, status, date } = req.body;

    if (!user || !service) {
      return res.status(400).json({ error: "User and Service are required" });
    }

    const newId = parseInt(uuidv4().replace(/\D/g, '').slice(0, 6));

    await db.query(
      'INSERT INTO orders (id, user, service, link, qty, charges, status, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [newId, user, service, link, qty, charges, status, date]
    );

    res.status(201).json({
      message: 'Order added',
      order: { id: newId, user, service, link, qty, charges, status, date }
    });
  } catch (err) {
    console.error("Error inserting order:", err.message);
    res.status(500).json({ error: 'Failed to add order' });
  }
});

// DELETE order by ID
app.delete('/orders/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    console.log("Deleting order:", orderId);

    await db.query('DELETE FROM orders WHERE id = ?', [orderId]);
    res.json({ message: `Order ${orderId} deleted` });
  } catch (err) {
    console.error("Error deleting order:", err.message);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// PUT update order by ID
app.put('/orders/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const { user, service, link, qty, charges, status, date } = req.body;

    console.log("Updating order:", orderId, req.body);

    // Update the order in Railway MySQL
    await db.query(
      'UPDATE orders SET user=?, service=?, link=?, qty=?, charges=?, status=?, date=? WHERE id=?',
      [user, service, link, qty, charges, status, date, orderId]
    );

    res.json({
      message: `Order ${orderId} updated`,
      order: { id: orderId, user, service, link, qty, charges, status, date }
    });
  } catch (err) {
    console.error("Error updating order:", err.message);
    res.status(500).json({ error: 'Failed to update order' });
  }
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
