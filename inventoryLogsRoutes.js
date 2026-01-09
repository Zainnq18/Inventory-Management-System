// inventorylogsroutes.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all inventory logs
router.get('/', async (req, res) => {
  try {
    const logs = await prisma.inventoryLog.findMany({
      include: {
        product: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
    res.json(logs);
  } catch (error) {
    console.error('❌ Error fetching inventory logs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST a new inventory log and update product quantity
router.post('/', async (req, res) => {
  const { product_id, quantity, change_type, change_date } = req.body;

  if (!product_id || !quantity || !change_type || !change_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const qty = parseInt(quantity);
    const delta = change_type === 'out' || change_type === 'purchase' ? -qty : qty;

    // Create inventory log
    await prisma.inventoryLog.create({
      data: {
        product: { connect: { id: product_id } },
        quantity: qty,
        type: change_type,
        date: new Date(change_date),
        department: {
          connect: {
            id: (await prisma.product.findUnique({
              where: { id: product_id },
            })).departmentId,
          },
        },
      },
    });

    // Update product quantity
    await prisma.product.update({
      where: { id: product_id },
      data: {
        quantity: {
          increment: delta,
        },
      },
    });

    res.status(200).json({ message: 'Inventory log added and product quantity updated' });
  } catch (err) {
    console.error('❌ Error adding inventory log:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;


