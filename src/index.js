import app from "./app.js";
import { config } from "./config/index.js";
import mongoose from "mongoose";


const startServer = async () => {
    try {
        await mongoose.connect(config.mongoURI);
        console.log('Conexión exitosa a MongoDB');
        app.listen(config.port, () => {
            console.log(`Servidor corriendo en el puerto ${config.port}`);
        });
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
    }
};

startServer();
