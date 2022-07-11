const connection = require('../database/connection');
const PDFMerger = require('pdf-merger-js');
const PDFKit = require('pdfkit');
const fs = require("fs")
module.exports = {
    async duplicateUpload(req, res) {
        const tokenOld = req.body.oldToken;
        const newToken = req.body.newToken
        let n = req.body.name;
        if (tokenOld !== undefined) {
            var dir = `uploads/${newToken}/`;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }

            name = n.replace(/\s/g, '');

            fs.copyFile(`uploads/${tokenOld}/${name}`, `uploads/${newToken}/${name}`, (err) => console.log("erro", err));
        }

        return res.send("Funcionou!");
    },
    async Upload(req, res) {

        if (!req.files) {
            //console.log('ERRO');
            return res.status(500).send({ msg: "Não foi possível fazer upload do arquivo" })
        }
        //console.log('FOI');

        var dir = `uploads/${req.headers.token}/`;

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        const myFile = req.files.file;
        const name = myFile.name.replace(/\s/g, '');

        if (!fs.existsSync(`uploads/${req.headers.token}/${name}`)) {
            myFile.mv(`uploads/${req.headers.token}/${name}`, function (error) {
                if (error) {
                    console.log(error)
                }
                return res.send({ name: name, path: `/${name}` });
            });
        } else {
            res.send({ name: name, path: `/${name}` })
        }
    },
    async Delete(req, res) {

        const name = req.body.file.replace(/\s/g, '');
        const path = `uploads/${req.body.token}/${name}`
        try {
            fs.unlinkSync(path)
            res.status(200).send("deletou")
        } catch (error) {
            console.log(error)
            res.status(200).send("deu erro no delete do file")
        }
    },
    async Merge(request, response) {
        const files = request.body.files;
        const token = request.body.token;

        var merger = new PDFMerger();

        (async () => {
            for (let index = 0; index < files.length; index++) {
                const name = files[index].replace(/\s/g, '');
                // merger.add('C:/portal/www/cesbe-sign/backend/uploads/' + token + '/' + name);
                merger.add(process.cwd().concat(`/uploads/${token}/${name}`));
            }
            try {
                // await merger.save('C:/portal/www/cesbe-sign/backend/uploads/' + token + '/Arquivos_Unidos.pdf');
                await merger.save(process.cwd().concat(`/uploads/${token}/Arquivos_Unidos.pdf`));
            } catch (error) {
                console.log("erro no unir arquivos", error);
            }

            //await merger.save(process.cwd().concat(`/uploads/${token}/Arquivos_Unidos.pdf`));
        })();

        response.status(200).json('Unidos!');
    },
    async CreatePDF(request, response) {
        const id = request.body.id;
        const token = request.body.token;
        var merger = new PDFMerger();
        const pdf = new PDFKit();

        function row(pdf, heigth) {
            pdf.lineJoin('miter')
                .lineWidth(0.1)
                .rect(55, heigth, 500, 30)
                .stroke()
            return pdf
        }

        function textInRowFirst(pdf, text, heigth, font) {
            pdf.y = heigth;
            pdf.x = 55;
            pdf.fontSize(font || 10);
            pdf.font('Times-Italic');
            pdf.fillColor('black');
            pdf.text(text, {
                paragraphGap: 10,
                indent: 10,
                align: 'center',
                columns: 1,
            });
            return pdf
        }

        function textInRowFirst2(pdf, text, heigth, font) {
            pdf.moveDown(1);
            pdf.y = heigth;
            pdf.x = 45;
            pdf.fontSize(font || 11);
            pdf.font('Times-Roman');
            pdf.fillColor('black');
        
            pdf.text(text, {
                paragraphGap:10,
                indent: 10,
                align: 'center',
                columns: 1,
            });
            pdf.heightOfString(text, {paragraphGap: 10,
                indent: 10,
                align: 'justify',
                lineBreak:true,
                columns: 1,})
            return pdf
        }

        function textInRowEnd(pdf, text, heigth) {
            pdf.y = heigth;
            pdf.x = 45;
            pdf.fontSize(11);
            pdf.font('Times-Roman');
            pdf.fillColor('black');
            pdf.text(text, {
                paragraphGap: 10,
                indent: 10,
                align: 'justify',
                
                columns: 1,
                
            });
           pdf.heightOfString(text, {paragraphGap: 10,
                indent: 10,
                align: 'justify',
                lineBreak:true,
                columns: 1,})
            return pdf
        }

        //Busca os dados do envio
        connection.query('SELECT CONCAT(SUBSTRING(s.date, 9, 2), "/", SUBSTRING(s.date, 6, 2), "/", SUBSTRING(s.date, 1, 4), " - ",SUBSTRING(s.date, 12, 8)) AS date, IF(s.status = 0 && s.current_level > 0, 2, s.status) AS status, s.current_level, concat(u.name, "(", u.email, ")") AS user,s.send,"---" as title, "---" as description, "---" as refusal_description FROM send_history s JOIN users u ON s.user = u.id WHERE s.send = ' + id + ' UNION SELECT CONCAT(SUBSTRING(s.last_update, 9, 2), "/", SUBSTRING(s.last_update, 6, 2), "/", SUBSTRING(s.last_update, 1, 4), " - ", SUBSTRING(s.last_update, 12, 8)) AS date,  IF(s.status = 0 && s.current_level > 0, 2, s.status) AS status, s.current_level, concat(u.name, "(", u.email, ")") AS user, s.id,s.title,s.description,s.refusal_description FROM send s JOIN users u ON s.user = u.id WHERE s.id = ' + id, function (error, results, fields) {

           
            let pdfHeight1 = 70;
            let pdfHeight2 = 70;
            let makePdf = fs.createWriteStream(`uploads/${token}/Fim_do_envio.pdf`, { autoClose: true });
            textInRowFirst2(pdf, 'Envio: ' + results[0].send, 30, 20);
         
            for (let index = 0; index < results.length; index++) {
               
                if (results[index].title !== '---') {
                    //pdf.text('Título: ' + results[index].title);
                    pdfHeight1 = textInRowFirst2(pdf, 'Título: ' + results[index].title, 50, 15);
                 
                }

                if (results[index].description != '' && results[index].description != '---') {
                    //pdf.text('Descrição: ' + results[index].description);
                    pdfHeight2 = textInRowFirst2(pdf, 'Descrição: ' + results[index].description, pdfHeight1.y, 15);
                }
            }
            
            var y = Math.trunc(pdfHeight2.y || pdfHeight1.y);
            var last_date = "";
            for (let index = 0; index < results.length; index++) {
                row(pdf, y);
                y += 10;
          
                if (results[index].current_level == 0) {
                    //pdf.text('Status: Enviado | ' + 'Data: ' + results[index].date + ' | Nível: ' + results[index].current_level + ' | Usuário: ' + results[index].user);
                    textInRowFirst(pdf, 'Enviado   -   ' + 'Em: ' + results[index].date + '   -   Enviado   -   ' + results[index].user, y);
                } else {
                    last_date = results[index].date;
                    if (results[index].status == 0) {
                        //pdf.text('Status: Aguardando aprovação | ' + 'Data: ' + results[index].date + ' | Nível: ' + results[index].current_level + ' | Usuário: ' + results[index].user);
                        textInRowFirst(pdf, 'Aguardando aprovação   -   ' + 'Em: ' + results[index].date + '   -   Nível: ' + results[index].current_level + '   -   ' + results[index].user, y);
                    } else if (results[index].status == 2) {
                        //pdf.text('Status: Aprovado | ' + 'Data: ' + results[index].date + ' | Nível: ' + results[index].current_level + ' | Usuário: ' + results[index].user);
                        textInRowFirst(pdf, 'Aprovado   -   ' + 'Em: ' + results[index].date + '   -   Nível: ' + results[index].current_level + '   -   ' + results[index].user, y);
                    } else if (results[index].status == 3) {
                        //pdf.text('Status: Rejeitado | ' + 'Data: ' + results[index].date + ' | Nível: ' + results[index].current_level + ' | Usuário: ' + results[index].user);
                        textInRowFirst(pdf, 'Rejeitado   -   ' + 'Em: ' + results[index].date + '   -   Nível: ' + results[index].current_level + '   -   ' + results[index].user, y);
                    }
                }
                if (results[index].refusal_description != '' && results[index].refusal_description != '---') {
                    y += 20;
                    row(pdf, y);
                    y += 10;
                    //pdf.text('Motivo de recusa: ' + results[index].refusal_description);
                    textInRowFirst(pdf, 'Motivo de recusa: ' + results[index].refusal_description + results[index].user, y);
                }
                //pdf.text(' ');
                y += 20;
            }

            textInRowEnd(pdf, 'Cesbe Engenharia', 680);
            textInRowEnd(pdf, 'Data: ' + last_date, 700);


            let pi = pdf.pipe(makePdf).on('finish', () => {

                connection.query('SELECT s.name, s.url FROM send_documents s WHERE s.send ="' + id + '"', function (error, results, fields) {

                    let x = 0;
                    //Mescla tudo
                    for (let index = 0; index < results.length; index++) {

                        if (results[index].name !== "Arquivos_Unidos.pdf") {
                            merger.add(process.cwd().concat(`/uploads/${results[index].url}`));
                        }
                    }
                    let Teste = merger.add(process.cwd().concat(`/uploads/${token}/Fim_do_envio.pdf`));
                    (async () => {
                        //console.log("entrou nessa função",results)
                        try {


                            let Teste2 = await merger.save(process.cwd().concat(`/uploads/${token}/Versao_Final.pdf`));


                            // merger.add('C:/portal/www/cesbe-sign/backend/uploads/'+ token +'/Fim_do_envio.pdf');
                            // await merger.save('C:/portal/www/cesbe-sign/backend/uploads/'+ token +'/Versao_Final.pdf');
                        } catch (erro) {
                            console.log(erro);
                        }

                        //await  merger.add(process.cwd().concat(`/uploads/${token}/Fim_do_envio.pdf`));
                        //console.log("entrou nessa função 1 :", merger)
                        //await merger.save(process.cwd().concat(`/uploads/${token}/Versao_Final.pdf`));
                        //console.log("entrou nessa função 2: ", merger)
                    })();
                    //Salva no B.D a mesclagem
                    connection.query('INSERT INTO send_documents (name, url, send) VALUES ("Versao_Final.pdf","' + token + '/Versao_Final.pdf",' + id + ')');
                    response.status(200).json(results);
                });
            });
          

            pdf.end();


        });
    },
    async Add(request, response) {
        const title = request.body.title;
        const description = request.body.description;
        const status = 0;
        const approve = request.body.approve;
        const current_level = 0;
        const token = request.body.token;
        const user = request.body.user;
		
		
   
        connection.query('INSERT INTO send (title, date, description, last_update, status, approve, current_level, token, user) VALUES ("' + title+ '",NOW(),"' + description + '",NOW(),' + status + ',' + approve + ',' + current_level + ', "' + token + '", ' + user + ')', function (error, results, fields) {
            if (results == '' || results == undefined) {
                console.log(error)
                response.status(400).json(error);
            }
            else {
                console.log(results)
                response.status(200).json(results.insertId);
            }
        });

    },
    async FilesAdd(request, response) {
        const name = request.body.name;
        const send = request.body.send;
        const Newname = name.replace(/\s/g, '');
        const url = `${request.body.token}/${Newname}`
        connection.query('INSERT INTO send_documents (name, url, send) VALUES ("' + Newname + '","' + url + '",' + send + ')', function (error, results, fields) {
            if (results == '' || results == undefined)
                response.status(400).json(error);
            else {
                console.log(results)
                response.status(200).json(results.insertId);
            }

        });

    },
    async SaveHistory(request, response) {
        const status = request.body.status;
        const current_level = request.body.current_level;
        const send = request.body.send;
        const data = request.body.data;

        connection.query('SELECT s.user, s.last_update FROM send s WHERE s.id = ' + send, function (error, results, fields) {
            if (results) {
                var User = results[0].user;
                var LastUpdate = results[0].last_update;
                connection.query('INSERT INTO send_history (date, status, current_level, user, send) VALUES ("' + LastUpdate + '",' + status + ',' + current_level + ',' + User + ',' + send + ')', function (error, results, fields) {
                    if (results == '' || results == undefined)
                        response.status(400).json(error);
                    else
                        response.status(200).json(results);
                });
            } else {
                response.status(200).json("NADA");
            }
        });
    },
    async SaveLevels(request, response) {
        const level = request.body.level;
        const sla = request.body.sla;
        const token = request.body.token;
        connection.query('INSERT INTO send_levels (level, sla, send) VALUES (' + level + ',' + sla + ',"' + token + '")', function (error, results, fields) {
            if (results == '' || results == undefined)
                response.status(400).json(error);
            else
                response.status(200).json(results);
        });

    },
    async SaveApprovers(request, response) {
        const user = request.body.user;
        const level = request.body.level;
        const token = request.body.token;
        connection.query('INSERT INTO send_approvers (user, level, send) VALUES (' + user + ',' + level + ',"' + token + '")', function (error, results, fields) {
            if (results == '' || results == undefined)
                response.status(400).json(error);
            else
                response.status(200).json(results);
        });

    },
    async DeleteApprovers(request, response) {
        const send = request.body.send;
        //connection.query('DELETE FROM send_approvers s WHERE s.send ="'+ send +'" AND s.level > 0', function(error, results, fields){
        connection.query('DELETE FROM send_approvers s WHERE s.send ="' + send + '"', function (error, results, fields) {
            response.status(200).json(results);
        });

    },
    async DeleteCopys(request, response) {
        const send = request.body.send;

        connection.query('DELETE FROM send_approvers s WHERE s.send ="' + send + '" AND s.level = 0', function (error, results, fields) {
            response.status(200).json(results);
        });

    },
    async Update(request, response) {
        const id = request.body.id;
        const status = request.body.status;
        const current_level = request.body.current_level;
        const user = request.body.user;
        const refusal = request.body.refusal;
        const description = request.body.description;
        connection.query('UPDATE send SET status = ' + status + ', current_level = ' + current_level + ', user = ' + user + ', last_update = NOW(), refusal = ' + refusal + ', refusal_description = "' + description + '" WHERE id =' + id, function (error, results, fields) {
            if (results == '' || results == undefined)
                response.status(400).json(error);
            else
                response.status(200).json(results);
        });

    },
    async ChangeApprovers(request, response) {
        const Old = request.body.old;
        const New = request.body.new;
        const Send = request.body.send;
        connection.query('UPDATE send_approvers SET user = ' + New + ' WHERE send ="' + Send + '" AND user =' + Old, function (error, results, fields) {
            response.status(200).json(results);
        });

    },
    async Read(request, response) {
        const id = request.body.id;
        connection.query("SELECT s.id, CONCAT(SUBSTRING(s.last_update, 9, 2), '/', SUBSTRING(s.last_update, 6, 2), '/', SUBSTRING(s.last_update, 1, 4),' - ', SUBSTRING(s.last_update, 12, 8)) AS date, CONCAT('Há ', IF(TIMESTAMPDIFF(HOUR, s.last_update, NOW()) > 2, (TIMESTAMPDIFF(HOUR, s.last_update, NOW())) -3, (TIMESTAMPDIFF(HOUR, s.last_update, NOW()))),' Hora(s) - ', IF(s.current_level = 0, 'Enviado', CONCAT('Nível ', s.current_level))) AS late, LPAD(s.id, 6, 0) AS send,SUBSTRING( s.title, 1, 150) AS title, SUBSTRING(s.description, 1, 150) AS description, s.status, IF(s.sla IS NULL, NULL, CONCAT(s.sla, ' Hora(s)')) AS sla, s.current_level, s.user, s.date AS data, SUM(TYPE) AS type, s.pending_to_approve, s.in_copy, s.approved, s.reproved, s.my_sends FROM vw_itens_send s where s.userid = " + id + " GROUP BY s.id, s.last_update, s.current_level, s.title, s.description, s.status, s.sla, s.user, s.date, s.pending_to_approve, s.in_copy, s.approved, s.reproved, s.my_sends", function (error, results, fields) {
            response.status(200).json(results);
        });
    },
    // Criei novo aqui essa função, desculpa kk
    async GetSend(request, response) {
        const id = request.body.id;
        connection.query("SELECT * FROM send s WHERE s.id = " + id, function (error, results, fields) {
            response.status(200).json(results);
        });
    },
    async GetSends(request, response) {
        const id = request.body.id;
        connection.query('SELECT s.token FROM send s WHERE s.status = 0 AND s.user = ' + id + ' UNION SELECT s.token FROM send_history sh JOIN send s ON s.id = sh.send WHERE sh.status = 0 AND sh.user = ' + id, function (error, results, fields) {
            response.status(200).json(results);
        });

    },
    async GetAllSends(request, response) {
        connection.query('SELECT s.token FROM send s WHERE s.status = 0 UNION SELECT s.token FROM send_history sh JOIN send s ON s.id = sh.send WHERE sh.status = 0', function (error, results, fields) {
            response.status(200).json(results);
        });
    },
    async GetHistory(request, response) {
        const send = request.body.send;
        connection.query('SELECT CONCAT(SUBSTRING(s.date, 9, 2), "/", SUBSTRING(s.date, 6, 2), "/", SUBSTRING(s.date, 1, 4)," - ", SUBSTRING(s.date, 12, 8)) AS date, IF(s.status = 0 && s.current_level > 0, 2 ,s.status) AS status,s.current_level, s.user , s.send,"---" as title, "---" as description, "---" as refusal_description FROM send_history s WHERE s.send = ' + send + ' UNION SELECT CONCAT(SUBSTRING(s.last_update, 9, 2), "/", SUBSTRING(s.last_update, 6, 2), "/", SUBSTRING(s.last_update, 1, 4)," - ", SUBSTRING(s.last_update, 12, 8)) AS date, IF(s.status = 0 && s.current_level > 0, 2 ,s.status) AS status, s.current_level, s.user , s.id, s.title, s.description, s.refusal_description FROM send s WHERE s.id =' + send, function (error, results, fields) {
            response.status(200).json(results);
        });

    },
    async GetApprovers(request, response) {
        const send = request.body.send;
        connection.query('SELECT sa.id, sa.user, sa.level, u.email, sa.send FROM send_approvers sa JOIN users u ON sa.user = u.Id WHERE send ="' + send + '" GROUP BY sa.id, sa.user, sa.level, u.email, sa.send', function (error, results, fields) {
            response.status(200).json(results);
        });
    },
    async GetDocs(request, response) {
        const send = request.body.send;
        connection.query('SELECT s.name, CONCAT("http://docflow-api.cesbe.com.br:3333/", s.url) AS url FROM send_documents s WHERE s.send ="' + send + '"', function (error, results, fields) {
            response.status(200).json(results);
        });
    },
    async GetToken(request, response) {
        const id = request.body.id;
        connection.query('SELECT s.token FROM send s WHERE id =' + id, function (error, results, fields) {
            response.status(200).json(results);
        });
    },
    async LastLevel(request, response) {
        const id = request.body.id;
        connection.query('SELECT MAX(sa.level) AS last FROM send s JOIN send_approvers sa ON sa.send = s.token WHERE s.id = ' + id, function (error, results, fields) {
            response.status(200).json(results);
        });
    },
    async Creator(request, response) {
        const id = request.body.id;
        connection.query('SELECT u.email, u.name FROM send s JOIN users u ON u.id = s.user WHERE s.id = ' + id + ' AND s.current_level = 0 UNION SELECT u.email, u.name FROM send_history s JOIN users u ON u.id = s.user WHERE s.send = ' + id + ' AND s.current_level = 0', function (error, results, fields) {
            response.status(200).json(results);
        });
    },
    async SendLevel(request, response) {
        const id = request.body.id;
        connection.query('SELECT current_level AS level FROM send WHERE id = ' + id, function (error, results, fields) {
            response.status(200).json(results);
        });
    },
    async GetLevel(request, response) {
        const id = request.body.id;
        connection.query('SELECT * FROM levels WHERE approve = ' + id, function (error, results, fields) {
            response.status(200).json(results);
        });
    },
}