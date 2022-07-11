const connection = require('../database/connection');

module.exports = {
    async Read(request, response) {
        connection.query('SELECT u.id,u.name,u.email,u.status,u.office,d.name AS department,case when c.name <> "Outra" then c.name else u.other_company end AS company,u.in_users,u.in_refusal,u.in_document,u.in_approved,u.in_companys,u.in_deps,u.per_docs,u.per_users,u.per_approved FROM users u LEFT JOIN companys c on u.company = c.id LEFT JOIN deps d ON u.department = d.id order by u.status,u.name', function (error, results, fields) {
            if (results == '' || results == undefined) {
                console.log(error)
                response.status(400).json(error);
            }
            else
                response.status(200).json(results);
        });
    },
    async ReadActives(request, response) {
        connection.query('SELECT u.id, u.name, u.email, 99 AS level FROM users u WHERE u.status = 1 ORDER BY u.name', function (error, results, fields) {
            if (results == '' || results == undefined)
                response.status(400).json(error);
            else
                response.status(200).json(results);
        });
    },
    async UsersApprovers(request, response) {
        connection.query('SELECT u.email FROM users u WHERE u.per_users = 1 order by u.name', function (error, results, fields) {
            if (results == '' || results == undefined)
                response.status(400).json(error);
            else
                response.status(200).json(results);
        });
    },
    async UsersSend(request, response) {
        const current_level = request.body.current_level;
        const send = request.body.send;
        connection.query('SELECT u.email, u.name FROM send_approvers s JOIN users u ON u.Id = s.user WHERE s.send = "' + send + '" AND s.level =' + current_level, function (error, results, fields) {
            response.status(200).json(results);
        });
    },
    async AllUsersSend(request, response) {
        const send = request.body.send;
        connection.query('SELECT u.email, u.name FROM send_approvers s JOIN users u ON u.Id = s.user WHERE s.send = "' + send + '" AND s.level > 0', function (error, results, fields) {
            response.status(200).json(results);
        });
    },
    async UsersCopySend(request, response) {
        const send = request.body.send;
        connection.query('SELECT u.email, u.name FROM send_approvers s JOIN users u ON u.Id = s.user WHERE s.send = "' + send + '" AND s.level = 0', function (error, results, fields) {
            response.status(200).json(results);
        });
    },
    async Find(request, response) {
        const email = request.body.email;
        const id = request.body.id;

        if(id == '' || id == undefined){
            connection.query('SELECT u.email FROM users u WHERE u.email = "' + email + '"', function (error, results, fields) {
                if (results == '' || results == undefined)
                    response.status(200).json(false);
                else
                    response.status(200).json(true);
            });
        }else{
            connection.query('SELECT u.email FROM users u WHERE u.email = "' + email + '" AND u.id !=' + id, function (error, results, fields) {
                if (results == '' || results == undefined)
                    response.status(200).json(false);
                else
                    response.status(200).json(true);
            });
        }
    },
    async FindDelete(request, response) {
        const id = request.body.id;
        connection.query('SELECT s.user FROM send_approvers s WHERE s.user = ' + id + ' UNION SELECT u.user FROM users_approve u WHERE u.user = ' + id, function (error, results, fields) {
            if (results == '' || results == undefined)
                response.status(200).json(false);
            else
                response.status(200).json(true);
        });
    },
    async Delete(request, response) {
        const id = request.body.id;
        connection.query('DELETE FROM users u WHERE u.id =' + id, function (error, results, fields) {
            if (results == '' || results == undefined)
                response.status(400).json(error);
            else
                response.status(200).json(results);
        });
    },
    async Add(request, response) {

        var Name = request.body.Name;
        var Email = request.body.Email;
        var Company = request.body.Company;
        var Department = request.body.Department;
        var Office = request.body.Office;
        var Other = request.body.Other;
        var Active = request.body.Active;
        var All = request.body.All;
        var Terms = request.body.Terms;
        var Users = request.body.Users;
        var Deps = request.body.Deps;
        var Companys = request.body.Companys;
        var Refusal = request.body.Refusal;
        var Approved = request.body.Approved;
        var Docs = request.body.Docs;
        var AllDocs = request.body.AllDocs;
        var NewUsers = request.body.NewUsers;
        var Approvers = request.body.Approvers;
        var otherCNPJ = request.body.otherCNPJ;
        var reports = request.body.reports;
        var otherCompany = request.body.otherCompany;

        if (Other === true) {
            Company = 0;
        }
        if (reports === true) {
            reports = 1;
        } else { reports = 0; }
        if (All === true) { All = 1; }
        else { All = 0; }

        if (Terms === true) { Terms = 1; }
        else { Terms = 0; }

        if (Users === true) { Users = 1; }
        else { Users = 0; }

        if (Deps === true) { Deps = 1; }
        else { Deps = 0; }

        if (Companys === true) { Companys = 1; }
        else { Companys = 0; }

        if (Refusal === true) { Refusal = 1; }
        else { Refusal = 0; }

        if (Approved === true) { Approved = 1; }
        else { Approved = 0; }

        if (Docs === true) { Docs = 1; }
        else { Docs = 0; }

        if (AllDocs === true) { AllDocs = 1; }
        else { AllDocs = 0; }

        if (NewUsers === true) { NewUsers = 1; }
        else { NewUsers = 0; }

        if (Approvers === true) { Approvers = 1; }
        else { Approvers = 0; }

        connection.query('INSERT INTO users (password, name, office, email, status, company, department, in_all, in_users, in_terms,' +
            'in_refusal, in_document, in_approved, in_companys, in_deps, per_docs, per_approved, per_users, other_company, per_report, other_cnpj, register_data)' +
            ' VALUES ("cesbe","' + Name + '","' + Office + '","' + Email + '", ' + Active + ',' + Company + ',' + Department + ',' + All + ',' + Users + ',' + Terms + ',' + Refusal + ',' + Docs + ',' + Approved + ',' + Companys + ',' + Deps + ',' + AllDocs + ',' + Approvers + ',' + NewUsers + ',"' + otherCompany + '","' + reports + '","' + otherCNPJ + '", NOW())', function (error, results, fields) {
                if (results == '' || results == undefined) {
                    console.log(error)
                    response.status(400).json(error);
                }
                else {
                    response.status(200).json(results);
                }

            });
    },
    async ReadUser(request, response) {
        const id = request.body.id;
        connection.query('SELECT * FROM users u WHERE u.id = ' + id + ' order by name', function (error, results, fields) {
            if (results == '' || results == undefined)
                response.status(400).json(error);
            else
                response.status(200).json(results);
        });
    },
    async Edit(request, response) {
        var Id = request.body.Id;
        var Name = request.body.Name;
        var Email = request.body.Email;
        var Company = request.body.Company;
        var Department = request.body.Department;
        var Office = request.body.Office;
        var Other = request.body.Other;
        var Active = request.body.Active;
        var All = request.body.All;
        var Terms = request.body.Terms;
        var Users = request.body.Users;
        var Deps = request.body.Deps;
        var Companys = request.body.Companys;
        var Refusal = request.body.Refusal;
        var Approved = request.body.Approved;
        var Docs = request.body.Docs;
        var AllDocs = request.body.AllDocs;
        var NewUsers = request.body.NewUsers;
        var Approvers = request.body.Approvers;
        var otherCNPJ = request.body.otherCNPJ;
        var otherCompany = request.body.otherCompany;
        var Reports = request.body.reports;
        if (Other === true) {
            Company = 0;
        }
        if (Reports === true) {
            Reports = 1;
        } else { Reports = 0 }

        if (All === true) { All = 1; }
        else { All = 0; }

        if (Terms === true) { Terms = 1; }
        else { Terms = 0; }

        if (Users === true) { Users = 1; }
        else { Users = 0; }

        if (Deps === true) { Deps = 1; }
        else { Deps = 0; }

        if (Companys === true) { Companys = 1; }
        else { Companys = 0; }

        if (Refusal === true) { Refusal = 1; }
        else { Refusal = 0; }

        if (Approved === true) { Approved = 1; }
        else { Approved = 0; }

        if (Docs === true) { Docs = 1; }
        else { Docs = 0; }

        if (AllDocs === true) { AllDocs = 1; }
        else { AllDocs = 0; }

        if (NewUsers === true) { NewUsers = 1; }
        else { NewUsers = 0; }

        if (Approvers === true) { Approvers = 1; }
        else { Approvers = 0; }

        connection.query('UPDATE users u SET name = "' + Name + '", office = "' + Office + '", email = "' + Email + '", status = ' + Active + ', company = ' + Company + ', department = ' + Department + ', in_all = ' + All + ', in_users = ' + Users + ', in_terms = ' + Terms + ',' +
            'in_refusal = ' + Refusal + ', in_document = ' + Docs + ', in_approved = ' + Approved + ', in_companys = ' + Companys + ', in_deps = ' + Deps + ', per_docs = ' + AllDocs + ', per_approved = ' + Approvers + ', per_users = ' + NewUsers + ', other_company = "' + otherCompany + '", other_cnpj = "' + otherCNPJ + '", per_report= "' + Reports + '" WHERE u.Id = ' + Id, function (error, results, fields) {
                if (results == '' || results == undefined)
                    response.status(400).json(error);
                else
                    response.status(200).json(results);
            });
    },
    async UpdateStatus(request, response) {
        var Email = request.body.email;
        var Status = request.body.status;
        var dep = request.body.department;
        var comp = request.body.company;
        var other_company = request.body.other_company || null;
        var other_cnpj = request.body.other_cnpj || null;
        console.log(dep);

        connection.query('UPDATE users u SET u.status = ' + Status + ' , u.department = ' + dep + ' , u.company = "' + comp + '" , u.other_company = "' + other_company + '" , u.other_cnpj = ' + other_cnpj + ' WHERE u.email = "' + Email + '"', function (error, results, fields) {
            if (results == '' || results == undefined) {

                console.log(error)
                response.status(400).json(error);
            }
            else
                response.status(200).json(results);
        });


    },
    async Recover(request, response) {
        var email = request.body.email;
        connection.query('SELECT * FROM users u WHERE u.email = "' + email + '"', function (error, results, fields) {
            if (results == '' || results == undefined)
                response.status(200).json('Nada');
            else
                response.status(200).json(results);
        });
    },
    async Register(request, response) {

        var Name = request.body.Name;
        var Email = request.body.Email;
        var Company = request.body.Company;
        var Department = request.body.Department;
        var Office = request.body.Office;
        var Other = request.body.Other;
        var otherCNPJ = request.body.otherCNPJ;
        var otherCompany = request.body.otherCompany;
        var Active = 2;

        if (Other === true) {
            Company = 0;
        }

        connection.query('INSERT INTO users (password, name, office, email, status, company, department, other_company, other_cnpj, register_data)' +
            ' VALUES ("cesbe","' + Name + '","' + Office + '","' + Email + '", ' + Active + ',' + Company + ',' + Department + ', "' + otherCompany + '", "' + otherCNPJ + '",NOW())', function (error, results, fields) {
                if (results == '' || results == undefined)
                    response.status(400).json(error);
                else
                    response.status(200).json(results);
            });
    },
    async Password(request, response) {
        const id = request.body.id;
        const oldPass = request.body.oldPass;
        const NewPass = request.body.NewPass;
        const NewPassV = request.body.NewPassV;

        connection.query('UPDATE users u SET u.password = "' + NewPass + '", u.first_login = 1 WHERE u.Id = ' + id + ' AND u.password = "' + oldPass + '"', function (error, results, fields) {
            response.status(200).json(results.changedRows);
        });
    },
    async FistLogin(request, response) {
        const id = request.body.id;
        connection.query('SELECT u.first_login FROM users u WHERE u.Id = ' + id, function (error, results, fields) {
            response.status(200).json(results);
        });
    },
}