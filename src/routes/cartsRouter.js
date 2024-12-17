import { Router } from 'express';
import fs from 'fs/promises';

const router = Router();
const filePath = './data/carrito.json';

// Funciones de utilidad
const readCarts = async () => {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data) || [];
    } catch {
        return [];
    }
};

const writeCarts = async (carts) => {
    await fs.writeFile(filePath, JSON.stringify(carts, null, 2));
};

// 1. POST '/' - Crear un carrito nuevo
router.post('/', async (req, res) => {
    const carts = await readCarts();
    const newCart = { id: (carts.length + 1).toString(), products: [] };
    carts.push(newCart);
    await writeCarts(carts);
    res.status(201).json(newCart);
});

// 2. GET '/:cid' - Obtener productos de un carrito
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    const carts = await readCarts();
    const cart = carts.find((c) => c.id === cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart.products);
});

// 3. POST '/:cid/product/:pid' - Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const carts = await readCarts();
    const cartIndex = carts.findIndex((c) => c.id === cid);

    if (cartIndex === -1) return res.status(404).json({ error: 'Carrito no encontrado' });

    const cart = carts[cartIndex];
    const product = cart.products.find((p) => p.product === pid);

    if (product) {
        product.quantity += 1; // Incrementar cantidad si el producto ya existe
    } else {
        cart.products.push({ product: pid, quantity: 1 }); // Agregar nuevo producto
    }

    await writeCarts(carts);
    res.json(cart);
});

export default router;
