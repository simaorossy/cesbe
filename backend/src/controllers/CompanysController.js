const connection = require('../database/connection');

module.exports = {
    async Read(request, response) {
        connection.query('SELECT * FROM companys c Where c.id > 0 order by name', function(error, results, fields){
            if(results == '' || results == undefined) 
              response.status(400).json(error);
            else
            response.status(200).json(results);
        });
    },
    async ReadActives(request, response) {
        connection.query('SELECT * FROM companys c Where c.id > 0 And c.status = 1 order by c.name', function(error, results, fields){
            if(results == '' || results == undefined) 
              response.status(400).json(error);
            else
            response.status(200).json(results);
        });
    },
    async Delete(request, response) {
        const id = request.body.id;
        connection.query('DELETE FROM companys c WHERE c.id =' + id, function(error, results, fields){
            if(results == '' || results == undefined) 
              response.status(400).json(error);
            else
            response.status(200).json(results);
        });
    },
    async Update(request, response) {
        const id = request.body.id;
        const cnpj = request.body.cnpj;
        const name = request.body.name;
        const status = request.body.status;
        console.log(cnpj)
        connection.query('UPDATE companys SET cnpj = "'+ cnpj +'", name = "'+ name +'", STATUS = "'+ status +'" WHERE id =' + id, function(error, results, fields){
            if(results == '' || results == undefined){
                console.log(error)
                response.status(400).json(error);
            } 
            else
            response.status(200).json(results);
        });
    },
    async Add(request, response) {
        const cnpj = request.body.cnpj;
        const name = request.body.name;
        const status = request.body.status;
        connection.query('INSERT INTO companys (cnpj, name, status) VALUES ("'+ cnpj +'","'+ name +'","'+ status +'")', function(error, results, fields){
            if(results == '' || results == undefined) 
              response.status(400).json(error);
            else
            response.status(200).json(results);
        });
    },
    async Find(request, response) {
        const id = request.body.id;
        const cnpj = request.body.cnpj;
        const name = request.body.name;
        connection.query('SELECT * FROM companys c WHERE c.name = "'+ name +'" AND c.id !=' + id + ' OR c.cnpj = "'+ cnpj +'" AND c.id !=' + id, function(error, results, fields){
            if(results == '' || results == undefined) 
              response.status(200).json(false);
            else
            response.status(200).json(true);
        });
    }
}