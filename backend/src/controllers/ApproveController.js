const connection = require('../database/connection');

module.exports = {
    async Read(request, response) {
        connection.query('SELECT a.id, a.name, a.status, d.name as typedoc FROM approves a JOIN documents d WHERE a.typedoc = d.id AND a.status != 3 order by a.name', function(error, results, fields){
            if(results == '' || results == undefined) 
              response.status(400).json(error);
            else
            response.status(200).json(results);
        });
    },async ReadActives(request, response) {
        connection.query('SELECT a.id, a.name FROM approves a WHERE a.status = 1 order by a.name', function(error, results, fields){
            if(results == '' || results == undefined) 
              response.status(400).json(error);
            else
            response.status(200).json(results);
        });
    },
    async ReadApprove(request, response) {
        const id = request.body.id;
        connection.query('SELECT * FROM approves a WHERE a.id =' + id , function(error, results, fields){
            if(results == '' || results == undefined) 
              response.status(400).json(error);
            else
            response.status(200).json(results);
        });
    },
    async ApproveLevels(request, response) {
        const id = request.body.id;
        connection.query('SELECT * FROM levels l WHERE l.approve =' + id, function(error, results, fields){
            if(results == '' || results == undefined) 
              response.status(400).json(error);
            else
            response.status(200).json(results);
        });
    },
    async ApproveUsers(request, response) {
        const id = request.body.id;
        connection.query('SELECT ua.user AS id, u.email, ua.level, ua.approve FROM users_approve ua JOIN users u ON u.id = ua.user WHERE ua.approve =' + id + ' order by u.name', function(error, results, fields){
            response.status(200).json(results);
        });
    },
    async ApproveAllUsers(request, response) {
        const id = request.body.id;
        connection.query('SELECT ua.id, ua.user, ua.level, ua.approve, u.email FROM users_approve ua JOIN users u ON ua.user = u.id WHERE ua.approve =' + id + ' order by u.name', function(error, results, fields){
            response.status(200).json(results);
        });
    },
    async EditApprove(request, response) {
        const id = request.body.id;
        const name = request.body.name;
        const typeDoc = request.body.typeDoc;
        const active = request.body.active;
        connection.query('UPDATE approves SET name = "'+ name +'", typedoc = '+ typeDoc +', status = '+ active +' WHERE id =' + id, function(error, results, fields){
            if(results == '' || results == undefined) 
              response.status(400).json(error);
            else
            response.status(200).json(results);
        });
    },
    async DeleteLevels(request, response) {
        const id = request.body.id;
        connection.query('DELETE FROM levels l WHERE l.approve =' + id, function(error, results, fields){
            response.status(200).json(results);
        });
    },
    async DeleteUsers(request, response) {
        const id = request.body.id;
        connection.query('DELETE FROM users_approve u WHERE u.approve =' + id, function(error, results, fields){
            response.status(200).json(results);
        });
    },
    async DeleteUsersCopy(request, response) {
        const id = request.body.id;
        connection.query('DELETE FROM users_approve u WHERE u.approve =' + id + 'AND u.level = 0', function(error, results, fields){
            response.status(200).json(results);
        });
    },
    async Delete(request, response) {
        const id = request.body.id;
        connection.query('DELETE FROM approves d WHERE d.id =' + id, function(error, results, fields){
            if(results == '' || results == undefined) 
              response.status(400).json(error);
            else
            response.status(200).json(results);
        });
    },
    async Add(request, response) {
        const name = request.body.name;
        const typeDoc = request.body.typeDoc;
        const active = request.body.active;
        connection.query('INSERT INTO approves (name, typedoc, status) VALUES ("'+ name +'",'+ typeDoc +','+ active +')', function(error, results, fields){
            if(results == '' || results == undefined) 
              response.status(400).json(error);
            else
            response.status(200).json(results);
        });

    },
    async AddLevels(request, response) {
        const level = request.body.level;
        const sla = request.body.sla;
        const approve = request.body.approve;
        connection.query('INSERT INTO levels (level, sla, approve) VALUES ('+ level +','+ sla +','+ approve +')', function(error, results, fields){
            if(results == '' || results == undefined) 
              response.status(400).json(error);
            else
            response.status(200).json(results);
        });

    },async AddUsers(request, response) {
        const id = request.body.id;
        const level = request.body.level;
        const approve = request.body.approve;
        connection.query('INSERT INTO users_approve (user, level, approve) VALUES ('+ id +','+ level +','+ approve +')', function(error, results, fields){
            if(results == '' || results == undefined) 
              response.status(400).json(error);
            else
            response.status(200).json(results);
        });

    },
    async GetId(request, response) {
        const name = request.body.name;
        connection.query('SELECT * FROM approves a WHERE a.name ="'+ name +'"', function(error, results, fields){
            if(results == '' || results == undefined) 
              response.status(400).json(error);
            else
            response.status(200).json(results);
        });
    },
    async Find(request, response) {
        const name = request.body.name;
        connection.query('SELECT a.name FROM approves a WHERE a.name = "' + name + '"', function(error, results, fields){
            if(results == '' || results == undefined) 
              response.status(200).json(false);
            else
            response.status(200).json(true);
        });
    },
}