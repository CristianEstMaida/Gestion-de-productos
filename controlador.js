
const Producto = require("./producto");

const getController = async (request, response)=>{

    response.json(await Producto.obtenerTodos());

}

const postController = async (request, response)=>{

    let estado = 200;
    const obj_resp = {"exito": false, "mensaje": "No se pudo agregar"};
    const producto = {...request.body};

    if (await Producto.agregar(producto)){
        estado = 201;
        obj_resp.exito = true;
        obj_resp.mensaje = "El producto fue agregado con éxito";
    }

    response.status(estado).json(obj_resp);

}

const putController = async (request, response)=>{

    let estado = 200;
    const obj_resp = {"exito": false, "mensaje": "No se pudo modificar"};
    const producto = {...request.body};

    if (await Producto.modificar(producto)){
        estado = 255;
        obj_resp.exito = true;
        obj_resp.mensaje = "El producto fue modificado con éxito";
    }

    response.status(estado).json(obj_resp);

}

const deleteController = async (request, response)=>{
 
    let estado = 200;
    const obj_resp = {"exito": false, "mensaje": "No se pudo eliminar"};
    const producto = {...request.body};

    if (await Producto.eliminar(producto)){
        estado = 255;
        obj_resp.exito = true;
        obj_resp.mensaje = "El producto fue eliminado con éxito";
    }

    response.status(estado).json(obj_resp);

}

module.exports = {getController, postController, putController, deleteController}