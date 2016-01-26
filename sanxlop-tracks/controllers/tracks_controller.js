var fs = require('fs');

//GET - Retorna una cancion por su nombre
exports.findTrackByName = function(req, res){
	var findURL = req.params.name;

	//recogemos el fichero con ese nombre dentro del NAS
    //PRODUCCION: var urlDIR = "../mnt/nas/";
	var urlDIR = "../mnt/nas/";
	var newURL = urlDIR+findURL;

	// Envio la cancion que se encuentra en esa ruta:
	res.sendFile(findURL,{root: '../mnt/nas/'});
};


//POST - Inserta una nueva cancion en la DB
exports.addTrack = function(req, res){
    //PRODUCCION: var urlDIR = "../mnt/nas/";
	var urlDIR = "../mnt/nas/";

	if (req.method == 'POST') {
		var fileName = '';
		var musicFile = '';
    	var music_file;
    	var tempName = '';

        var body = '';
        var contador = 0;
        req.on('data', function (data) {
            body += data;
            // El primer dato que se envia es el nombre del fichero y un trozo de cancion
            // El resto de datos que llegan, es solo cancion.
            if (contador == 0){
            	var stringData = data.toString();

            	// EJ: prueba.mp3 -------XXXX
            	stringData = stringData.substr(stringData.indexOf('filename')+13);
                
            	// Cortamos despues del . y 3 caracteres
            	stringData = stringData.substr(0,stringData.indexOf('.')+4);
                
            	// Guardamos el nombre de fichero finalmente.
            	filename = stringData;
            	// Guardamos el nombre del fichero a guardar.
            	// EJ: /mnt/nas/154235262132_Prueba.mp3
            	// Metemos un numero random, para asegurar que no hay ninguno igual
            	var random = Math.floor((Math.random() * 100) + 1);

                // Para prevenir posibles errores de que no encuentre el nombre.
                console.log("FILENAME: "+filename);
                if (fileName == ""){
                    filename = ".mp3";
                }

            	tempName = new Date().getTime()+random+'_'+filename;
            	musicFile = urlDIR + tempName;

            	// Inicio del writeStream
            	music_file = fs.createWriteStream(musicFile);
            	// Escribimos el trozo de cancion que llega en este primer data.
            	music_file.write(data);
            	contador++;
            }else{
            	music_file.write(data);
            }
        });
        req.on('end', function () {
        	console.log("UPLOAD COMPLETADA");

            music_file.end();
            res.writeHead(200, {'Content-Type': 'text/html'});
            // Devolvemos el nombre de la cancion guardada:
        	res.end(tempName);
        });

    }
};


//DELETE - Borramos una cancion por su nombre
exports.deleteTrackByName = function(req,res){
    //PRODUCCION: var urlDIR = "../mnt/nas/";
	var urlDIR = "../mnt/nas/";
	var findURL = req.params.name;
	var newURL = urlDIR+findURL;

	// Borramos el fichero en esa ruta
	var fs = require('fs');
	fs.unlinkSync(newURL);
	res.status(200);
	console.log("BORRADA:"+findURL);
};