import express from "express";
import loggerController from "../controllers/loggerController.js"


const loggerRouter = express.Router();


// Ruta para mostrar el formulario de prueba de logs
loggerRouter.get('/loggerTest', loggerController.showLoggerTest);

// Ruta para procesar la prueba de logs
loggerRouter.post('/loggerTest', loggerController.testLogger);

export default loggerRouter;