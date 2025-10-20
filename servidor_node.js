const express = require('express');

const app = express();

app.set('puerto', 9876);

//AGREGO JSON
app.use(express.json());

app.use(express.static("public"));

const cors = require("cors");

app.use(cors());

const whiteList = ["http://127.0.0.1:5500","http://localhost:5000","http://127.0.0.1:8500", "https://mi_sitio_favorito.com.ar"];

let options = {
    origin: (origin, callback) => {
        if(whiteList.indexOf(origin) !== -1){
            callback(null, true);
        }
        else{//no está invitado
            callback(new Error("Cors está habilitado para esta ruta"))
        }
    }
}

const routes = express.Router();

routes.get("/con_invitacion", cors(options), (request, response)=>{

});

//##############################################################################################//
//RUTAS PARA EL CRUD ARCHIVOS
//##############################################################################################//

const rutas = require("./routes");

app.use("/productos", rutas)

//##############################################################################################//
//RUTAS PARA EL CRUD ARCHIVOS Y FOTOS
//##############################################################################################//

const rutas_fotos = require("./routes_photos");

app.use("/productos_fotos", rutas_fotos);


app.listen(app.get('puerto'), ()=>{
    console.log('Servidor corriendo sobre puerto:', app.get('puerto'));
});