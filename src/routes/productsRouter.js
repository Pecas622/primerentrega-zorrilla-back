// src/routes/productsRouter.js
import express from 'express';
const router = express.Router();

// Datos de ejemplo de productos
let products = [
    { id: 1, title: 'Producto 1', description: 'Descripción 1', code: 'P001', price: 100, status: true, stock: 10, category: 'Categoria A', thumbnails: ['/img/product1.jpg'] },
    { id: 2, title: 'Producto 2', description: 'Descripción 2', code: 'P002', price: 150, status: true, stock: 15, category: 'Categoria B', thumbnails: ['/img/product2.jpg'] },
    { id: 3, title: 'Producto 3', description: 'Descripción 3', code: 'P003', price: 200, status: true, stock: 5, category: 'Categoria A', thumbnails: ['/img/product3.jpg'] },
    { id: 4, title: 'Producto 4', description: 'Descripción 4', code: 'P004', price: 250, status: true, stock: 7, category: 'Categoria C', thumbnails: ['/img/product4.jpg'] },
    { id: 5, title: 'Producto 5', description: 'Descripción 5', code: 'P005', price: 300, status: true, stock: 3, category: 'Categoria B', thumbnails: ['/img/product5.jpg'] }
];

// Ruta GET /api/products para listar productos
router.get('/', (req, res) => {
    const limit = parseInt(req.query.limit);

    if (limit && !isNaN(limit)) {
        return res.json(products.slice(0, limit));
    }

    res.json(products);
});

// Ruta GET /api/products/:pid para obtener un producto por ID
router.get('/:pid', (req, res) => {
    const { pid } = req.params;
    const product = products.find(p => p.id === parseInt(pid));

    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);
});

// Ruta POST /api/products para agregar un nuevo producto
router.post('/', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    // Validación de campos obligatorios
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos excepto thumbnails son obligatorios' });
    }

    // Generación del nuevo ID, asegurando que no haya duplicados
    const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;

    // Crear el nuevo producto
    const newProduct = {
        id: newId,
        title,
        description,
        code,
        price,
        status: true, // El status es true por defecto
        stock,
        category,
        thumbnails: thumbnails || [] // thumbnails es opcional
    };

    // Agregar el nuevo producto al arreglo
    products.push(newProduct);

    // Responder con el producto agregado
    res.status(201).json(newProduct);
});

// Ruta PUT /api/products/:pid para actualizar un producto
router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    // Buscar el producto con el id correspondiente
    const productIndex = products.findIndex(p => p.id === parseInt(pid));

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Actualizar solo los campos proporcionados, asegurando que el ID no cambie
    const updatedProduct = { ...products[productIndex], title, description, code, price, stock, category, thumbnails };

    // Reemplazar el producto viejo con el actualizado
    products[productIndex] = updatedProduct;

    // Responder con el producto actualizado
    res.json(updatedProduct);
});

// Ruta DELETE /api/products/:pid para eliminar un producto
router.delete('/:pid', (req, res) => {
    const { pid } = req.params;

    // Buscar el índice del producto que se desea eliminar
    const productIndex = products.findIndex(p => p.id === parseInt(pid));

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Eliminar el producto
    products.splice(productIndex, 1);

    // Responder con un mensaje de éxito
    res.status(200).json({ message: 'Producto eliminado con éxito' });
});

export default router;
