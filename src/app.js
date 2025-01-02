import express from 'express';
import cartsRouter from './routes/cartsRouter.js'; // Importa las rutas de carritos

const app = express();
app.use(express.json()); // Para manejar el cuerpo de las solicitudes en formato JSON

// Usar las rutas de carritos
app.use('/api/carts', cartsRouter);

app.listen(8080, () => {
    console.log('Servidor escuchando en http://localhost:8080');
});
