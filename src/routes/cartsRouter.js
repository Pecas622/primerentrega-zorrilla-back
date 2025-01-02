import express from 'express';
const router = express.Router();

// Lista de carritos de ejemplo (simulando una base de datos)
let carts = [
    { id: 1, products: [{ productId: 1, quantity: 2 }, { productId: 2, quantity: 1 }] },
    { id: 2, products: [{ productId: 3, quantity: 1 }] }
];

// Ruta POST para crear un nuevo carrito
router.post('/', (req, res) => {
    // Recibir los datos del carrito desde el cuerpo de la solicitud
    const { products } = req.body;

    // Validar que los productos sean un array
    if (!Array.isArray(products)) {
        return res.status(400).json({ error: 'El campo "products" debe ser un array' });
    }

    // Generar un nuevo id para el carrito (asegurándonos de que no se repita)
    const newId = carts.length ? carts[carts.length - 1].id + 1 : 1;

    // Crear el nuevo carrito
    const newCart = {
        id: newId,
        products: products // Asignamos los productos enviados en el cuerpo de la solicitud
    };

    // Agregar el nuevo carrito a la lista
    carts.push(newCart);

    // Responder con el carrito creado
    res.status(201).json(newCart);
});

export default router;
