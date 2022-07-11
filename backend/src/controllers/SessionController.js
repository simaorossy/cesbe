const connection = require('../database/connection');

module.exports = {

    async Login(request, response) {
        const email = request.body.email;
        const password = request.body.password;
        
        connection.query('SELECT c.id, c.first_login, c.in_users, c.in_terms, c.in_refusal, c.in_document, c.in_approved, c.in_companys, c.per_report,c.in_deps, c.per_users, c.per_docs, c.name, c.status FROM users c WHERE c.email = "' + email +'" and c.password = "'+ password + '"' , function(error, results, fields){
            if(results == '' || results == undefined) {
                response.status(200).json(error);
            }
            else{
                response.status(200).json(results);
            }
           
        });   
    }
}