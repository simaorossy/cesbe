const connection = require('../database/connection');

module.exports = {
    async ReadForSend(request, response) {
        var where = "1=1";
        var time = request.body.Time;
        var dateOne = request.body.dateOne;
        var dateTwo = request.body.dateTwo;
        var requester = request.body.requester;
        var aprover = request.body.aprover;
        var title = request.body.title;
        var aux = "";
        var auxA = "";

        for (let i = 0; i < requester.length; i++) {
            if (requester.length - 1 == i) {
                aux += `${requester[i]}`;
            } else {
                aux += `${requester[i]},`;
            }
        } for (let i = 0; i < aprover.length; i++) {
            if (aprover.length - 1 == i) {
                auxA += `${aprover[i]}`;
            } else {
                auxA += `${aprover[i]},`;
            }
        }
        if (time == "lastMonth") {
            where += " AND t.date >= DATE_ADD(current_date, INTERVAL -30 DAY) ";
        } if (time == "lastThreeMonth") {
            where += " AND t.date >= DATE_ADD(current_date, INTERVAL -90 DAY) ";
        } if (time == "lastSixMonth") {
            where += " AND t.date >= DATE_ADD(current_date, INTERVAL -6 MONTH) ";
        } if (time == "lastYear") {
            where += " AND t.date >= DATE_ADD(current_date, INTERVAL -12 MONTH) ";
        } if (time == "other") {
            where += " AND DATE(t.date)  between STR_TO_DATE('" + dateOne + "','%d/%m/%Y') and STR_TO_DATE('" + dateTwo + "','%d/%m/%Y') ";
        }
        if (requester != "") {
            where += " AND requester_id in (" + aux + ") ";
        }
        if (aprover != "") {
            where += " AND t.approver_id in (" + auxA + ") ";
        }
        if (title) {
            where += " AND t.title Like '%" + title + "%' ";
        }

        connection.query('select t.send, title, date, last_update,requester_id, requester, status, reason,' +
            'time_to_approve  from vw_report_per_send  t where ' + where + ' group by t.send, title, date, last_update, requester_id, requester, status, reason, time_to_approve', function (error, results, fields) {
                if (results == '' || results == undefined) {
                    console.log("errro :", error)
                    response.status(400).json(error);
                }
                else {
                    response.status(200).json(results);
                }

            });
    },
    async ReadForUsers(request, response) {
        var where = "1=1";  
        var time = request.body.Time;
        var dateOne = request.body.dateOne;
        var dateTwo = request.body.dateTwo;
        var users = request.body.requester;
        var aux = [];

        console.log(time);
        console.log(response.body);

        for (let i = 0; i < users.length; i++) {
            if (users.length - 1 == i) {
                aux += `${users[i]}`;
            } else {
                aux += `${users[i]},`;
            }
        }

        if (users != "") {
            where += " AND id in (" + aux + ") ";
        }
        
        if (time == "lastMonth") {
            where += " AND h.date >= DATE_ADD(current_date, INTERVAL -30 DAY) ";
        } if (time == "lastThreeMonth") {
            where += " AND h.date >= DATE_ADD(current_date, INTERVAL -90 DAY) ";
        } if (time == "lastSixMonth") {
            where += " AND h.date >= DATE_ADD(current_date, INTERVAL -6 MONTH) ";
        } if (time == "lastYear") {
            where += " AND h.date >= DATE_ADD(current_date, INTERVAL -12 MONTH) ";
        } if (time == "other") {
            where += " AND DATE(h.date)  between STR_TO_DATE('" + dateOne + "','%d/%m/%Y') and STR_TO_DATE('" + dateTwo + "','%d/%m/%Y') ";
        }

        console.log(connection.query("select t.id AS id, t.user AS user, t.send_to_approve AS send_to_approve, t.pending_to_approve AS pending_to_approve," +
        " concat(lpad(t.days, 2, '0'), ':', lpad(t.hours, 2, '0'), ':', lpad(t.minutes, 2, '0')) AS average_time, concat(format(t.in_sla * 100, 2, 0), ' %') AS in_sla" +
        " from (select t.id, t.user, t.send_to_approve, t.pending_to_approve, t.minutes_to_approve, cast(truncate((t.minutes_to_approve / 1440), 0) as unsigned) AS days," + 
        " cast(((t.minutes_to_approve - (truncate((t.minutes_to_approve / 1440), 0) * 1440)) / 60) as unsigned) AS hours," +
        " cast((t.minutes_to_approve - (cast(((t.minutes_to_approve - (truncate((t.minutes_to_approve / 1440), 0) * 1440)) / 60) as unsigned) * 60)) as unsigned) AS minutes," +
        " t.in_sla from (select t.id, t.user, sum(t.send_to_approve) send_to_approve, sum(t.pending_to_approve) pending_to_approve, sum(t.minutes_to_approve) / sum(t.amount) minutes_to_approve," +
        " sum(t.amount_in_sla) / sum(t.amount) in_sla from vw_report_per_user t where " + where + " group by t.id, t.user) t) t", function (error, results, fields) {
            if (results == '' || results == undefined) {
                response.status(400).json(error);
            }
            else {
                response.status(200).json(results);
            }

        }));
    },

    async ReadForComplete(request, response) {
        var where = "1=1";
        var time = request.body.Time;
        var dateOne = request.body.dateOne;
        var dateTwo = request.body.dateTwo;
        var requester = request.body.requester;
        var aprover = request.body.aprover;
        var title = request.body.title;
        var aux = "";
        var auxA = "";

        for (let i = 0; i < requester.length; i++) {
            if (requester.length - 1 == i) {
                aux += `${requester[i]}`;
            } else {
                aux += `${requester[i]},`;
            }
        } for (let i = 0; i < aprover.length; i++) {
            if (aprover.length - 1 == i) {
                auxA += `${aprover[i]}`;
            } else {
                auxA += `${aprover[i]},`;
            }
        }
        if (time == "lastMonth") {
            where += " AND t.date >= DATE_ADD(current_date, INTERVAL -30 DAY) ";
        } if (time == "lastThreeMonth") {
            where += " AND t.date >= DATE_ADD(current_date, INTERVAL -90 DAY) ";
        } if (time == "lastSixMonth") {
            where += " AND t.date >= DATE_ADD(current_date, INTERVAL -6 MONTH) ";
        } if (time == "lastYear") {
            where += " AND t.date >= DATE_ADD(current_date, INTERVAL -12 MONTH) ";
        } if (time == "other") {
            where += " AND DATE(t.date)  between STR_TO_DATE('" + dateOne + "','%d/%m/%Y') and STR_TO_DATE('" + dateTwo + "','%d/%m/%Y') ";
        }
        if (requester != "") {
            console.log("entrou no solicitante")
            where += " AND requester_id in (" + aux + ") ";
            console.log(where)
        }
        if (aprover != "") {
           
            where += " AND t.approver_id in (" + auxA + ") ";
         
        }
        if (title) {
            console.log("entrou no Titulo")
            where += " AND t.title Like '%" + title + "%' ";
           
        }

      console.log( connection.query('select *  from vw_view_report_complete  t where ' + where , function (error, results, fields) {
            if (results == '' || results == undefined) {
                response.status(400).json(error);
            }
            else {
                response.status(200).json(results);
            }

        }));
    },



}