const connection = require('../database/connection');

module.exports = {

    async All(request, response) {
        connection.query("SELECT * FROM terms ORDER BY id", function(error, results, fields){
            if(results == '' || results == undefined) 
              response.status(400).json(error);
            else
            response.status(200).json(results);
        });
    },
    
    async Read(request, response) {
        const language = request.body.language
        connection.query("SELECT * FROM terms WHERE language = '" + language +"'", function(error, results, fields){
            if(results == '' || results == undefined) 
              response.status(400).json(error);
            else
            response.status(200).json(results);
        });
    },
    
    async Update(request, response) {
        const tituloPT = request.body.tituloPT;
        const descricaoPT = request.body.descricaoPT;
        const tituloES = request.body.tituloES;
        const descricaoES = request.body.descricaoES;
        connection.query("UPDATE terms t1 JOIN terms t2 ON t1.Id = 1 AND t2.Id = 2 SET t1.titulo = '" + tituloPT + "', t1.descricao = '" + descricaoPT + "', t2.titulo = '" + tituloES + "', t2.descricao = '" + descricaoES + "'", function(error, results, fields){
            if(results == '' || results == undefined) 
                response.status(400).json(error);
            else
                response.status(200).json(results);
        });
    }
}