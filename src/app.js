import express from 'express';
import productsRouter from './routes/productsRouter.js';
import cartsRouter from './routes/cartsRouter.js';

const app = express();

app.use(express.json()); // Para poder leer JSON
app.use('/api/products', productsRouter); // Registrar productos
app.use('/api/carts', cartsRouter); // Registrar carritos

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
