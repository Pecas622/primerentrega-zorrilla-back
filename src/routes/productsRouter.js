import { Router } from 'express';
import fs from 'fs/promises';

const router = Router();
const filePath = './data/productos.json';

// Funciones de utilidad
const readProducts = async () => {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data) || [];
    } catch {
        return [];
    }
};

const writeProducts = async (products) => {
    await fs.writeFile(filePath, JSON.stringify(products, null, 2));
};

// 1. GET '/' - Listar todos los productos (con limit)
router.get('/', async (req, res) => {
    const products = await readProducts();
    const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
    res.json(products.slice(0, limit));
});

// 2. GET '/:pid' - Obtener producto por ID
router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    const products = await readProducts();
    const product = products.find((p) => p.id === pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
});

// 3. POST '/' - Agregar un producto
router.post('/', async (req, res) => {
    const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios, excepto thumbnails' });
    }

    const products = await readProducts();
    const newProduct = {
        id: (products.length + 1).toString(),
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
    };
    products.push(newProduct);
    await writeProducts(products);
    res.status(201).json(newProduct);
});

// 4. PUT '/:pid' - Actualizar producto
router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const updateData = req.body;
    const products = await readProducts();
    const index = products.findIndex((p) => p.id === pid);

    if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' });

    products[index] = { ...products[index], ...updateData, id: pid }; // No se modifica el ID
    await writeProducts(products);
    res.json(products[index]);
});

// 5. DELETE '/:pid' - Eliminar producto
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    let products = await readProducts();
    const productExists = products.some((p) => p.id === pid);

    if (!productExists) return res.status(404).json({ error: 'Producto no encontrado' });

    products = products.filter((p) => p.id !== pid);
    await writeProducts(products);
    res.json({ message: `Producto con id ${pid} eliminado` });
});

export default router;
