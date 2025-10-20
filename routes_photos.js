const express = require("express");

const rutas_fotos = express.Router();


//AGREGO FILE SYSTEM
const fs = require('fs');

//INDICO RUTA HACIA EL ARCHIVO

const multer = require('multer');
const mime = require('mime-types');
//const path = require('path');

const PATH_ARCHIVO_FOTOS = "./archivos/productos_fotos.json";

const upload = multer({
    storage: multer.diskStorage({
        destination: "public/fotos/",
    })
});

//##############################################################################################//
//RUTAS PARA EL CRUD ARCHIVOS Y FOTOS
//##############################################################################################//

//LISTAR
rutas_fotos.get('/', (request, response) => {

    let retorno = {};

    if(fs.existsSync(PATH_ARCHIVO_FOTOS)){

        const data = fs.readFileSync(PATH_ARCHIVO_FOTOS);
        retorno = JSON.parse(data);
    }

    response.json(retorno);

});

//AGREGAR
rutas_fotos.post('/', upload.single("foto"), (request, response) => {

    //response.send('POST - servidor Node.JS');
    let estado = 200;
    const obj_resp = {"exito": false, "mensaje": "No se pudo agregar"};

    let file = request.file;
    let ext = mime.extension(file.mimetype);
    let obj = JSON.parse(request.body.obj_producto);
    const path = file.destination + obj.codigo + "." + ext;

    fs.renameSync(file.path, path);

    obj.path = path.split("public/")[1];

    if(fs.existsSync(PATH_ARCHIVO_FOTOS)){
        const data = fs.readFileSync(PATH_ARCHIVO_FOTOS);
        const productos = JSON.parse(data);

        productos.push(obj);

        fs.writeFileSync(PATH_ARCHIVO_FOTOS, JSON.stringify(productos, null, 2));

        estado = 201;
        obj_resp.exito = true;
        obj_resp.mensaje = "El producto con foto fue agregado con éxito";
    }

    response.status(estado).json(obj_resp);

});

  //MODIFICAR
rutas_fotos.put('/', upload.single('foto'), (request, response)=>{

    //response.send('PUT - servidor Node.JS');

    let file = request.file;
    let extension = mime.extension(file.mimetype);
    let obj = JSON.parse(request.body.obj_producto);
    
    let estado = 200;
    const obj_resp = {"exito": false, "mensaje": "No se pudo modificar"};

    if(fs.existsSync(PATH_ARCHIVO_FOTOS)){
        const data = fs.readFileSync(PATH_ARCHIVO_FOTOS);
        const productos = JSON.parse(data);

        const indice = productos.findIndex( p => parseInt(p.codigo) == parseInt(obj.codigo))

        if(indice === -1){
            obj_resp.mensaje = "No se ha encontrado el producto " + obj.codigo;
        }

        else {
            const obj_path = "public/" + productos[indice].path;            

            if (fs.existsSync(obj_path)){
                try{
                    fs.unlinkSync(obj_path);                
                    console.log(obj_path + ' fue borrado.');
                } catch(err){
                    console.error("Error al borrar imagen anterior:", err);
                }

            }

            const path = file.destination + obj.codigo + "." + extension;

            fs.renameSync(file.path, path);

            obj.path = path.split("public/")[1];

            productos[indice] = obj;

            fs.writeFileSync(PATH_ARCHIVO_FOTOS, JSON.stringify(productos, null, 2));

            estado = 255;
            obj_resp.exito = true;
            obj_resp.mensaje = "El producto fue modificado con éxito";
        }
        
    }

    response.status(estado).json(obj_resp);

});

//ELIMINAR
rutas_fotos.delete('/', (request, response)=>{

    //response.send('DELETE - servidor Node.JS');

    let estado = 200;
    const obj_resp = {"exito": false, "mensaje": "No se pudo eliminar"};
    const producto = {...request.body};

    let path_foto = "public/";

    if(fs.existsSync(PATH_ARCHIVO_FOTOS)){
        const data = fs.readFileSync(PATH_ARCHIVO_FOTOS);
        const productos = JSON.parse(data);

        const indice = productos.findIndex( p => parseInt(p.codigo) == parseInt(producto.codigo));

        if(indice === -1){
            obj_resp.mensaje = "No se ha encontrado el producto " + producto.codigo;
        }
        else {
            
            const productos_delete = productos.filter(p => parseInt(p.codigo) !== parseInt(producto.codigo));

            fs.writeFileSync(PATH_ARCHIVO_FOTOS, JSON.stringify(productos_delete, null, 2));

            const obj_delete = productos[indice];
            path_foto += obj_delete.path;

            fs.unlink(path_foto, (err) => {
                if (err) throw err;
                console.log(path_foto + ' fue borrado.');
            });

            estado = 255;
            obj_resp.exito = true;
            obj_resp.mensaje = "El producto fue eliminado con éxito";

        }

    }

    response.status(estado).json(obj_resp);
});

module.exports = rutas_fotos;