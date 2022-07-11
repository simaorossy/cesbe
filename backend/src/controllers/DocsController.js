const connection = require('../database/connection');

module.exports = {
    async Read(request, response) {
        connection.query('SELECT * FROM documents order by name', function(error, results, fields){
            if(results == '' || results == undefined) 
              response.status(400).json(error);
            else
            response.status(200).json(results);
        });
    },
    async ReadActives(request, response) {
        connection.query('SELECT * FROM documents d Where d.Status = 1 order by name', function(error, results, fields){
            if(results == '' || results == undefined) 
              response.status(400).json(error);
            else
            response.status(200).json(results);
        });
    },
    async Find(request, response) {
        const id = request.body.id;
        const name = request.body.name;
        connection.query('SELECT * FROM documents d Where d.name = "' + name + '" AND d.id !=' + id, function(error, results, fields){
            if(results == '' || results == undefined) 
              response.status(200).json(false);
            else
            response.status(200).json(true);
        });
    },
    async Delete(request, response) {
        const id = request.body.id;
        connection.query('DELETE FROM documents d WHERE d.id =' + id, function(error, results, fields){
            if(results == '' || results == undefined) 
              response.status(400).json(error);
            else
            response.status(200).json(results);
        });
    },
    async Update(request, response) {
        const id = request.body.id;
        const name = request.body.name;
        const status = request.body.status;
        connection.query('UPDATE documents SET name = "'+ name +'", STATUS = '+ status +' WHERE id =' + id, function(error, results, fields){
            if(results == '' || results == undefined) 
              response.status(400).json(error);
            else
            response.status(200).json(results);
        });
    },
    async Add(request, response) {
        const name = request.body.name;
        const status = request.body.status;
        connection.query('INSERT INTO documents (name, status) VALUES ("'+ name +'",'+ status +')', function(error, results, fields){
            if(results == '' || results == undefined) 
              response.status(400).json(error);
            else
            response.status(200).json(results);
        });
    }
}