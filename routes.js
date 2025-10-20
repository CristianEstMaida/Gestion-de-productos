const express = require("express");


const rutas = express.Router();

const {getController, postController, putController, deleteController} = require("./controlador");
//##############################################################################################//
//RUTAS PARA EL CRUD ARCHIVOS
//##############################################################################################//

//LISTAR
rutas.get('/', getController);

//AGREGAR
rutas.post('/', postController);

//MODIFICAR
rutas.put('/', putController);

//ELIMINAR
rutas.delete('/', deleteController); 

module.exports = rutas;