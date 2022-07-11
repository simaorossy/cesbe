var mysql = require('mysql2');

const connection = mysql.createConnection({
    // Produção
    // host: "172.16.0.215",
    // user: "moondu",
    // password: "M3s7DcJ/Rk9*",
    // database: "docflow_db"
    
    // Desenvolvimento
    host: "cesbe-sign.cgx2butnmec0.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "M00ndu-C3sb3",
    database: "docflow_db"
});

module.exports = connection;