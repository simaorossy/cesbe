const connection = require('../database/connection');
var nodemailer = require('nodemailer');

module.exports = {
    async Approvers(request, response) {

        const email = request.body.email;
        const name = request.body.name;
        const user = request.body.user;
        const company = request.body.company;
        const language = request.body.language;

        var transporter = nodemailer.createTransport({
             host: "smtp.office365.com",
            port: 587,
            secure:false,
            requireTLS:true,
            auth: {
                user: "Sistemas@cesbe.com.br",
                pass: "Din8714!"
            },
        });
        var mailOptions;
        if (language == 'es-ES') {
            mailOptions = {
                from: "Sistemas@cesbe.com.br",
                to: email,
                subject: 'Cesbe Sign - Nueva cuenta',
                html: `
            <html>
                <head>
                    <meta charset="utf-8">
                </head>
                <body>
                
                <p>Olá ${name},</p>
                <p>Hay una nueva cuenta esperando su aprobación<br/><br/>
                    <b>Usuario:</b> ${user} <br/>
                    <b>Empresa:</b> ${company} <br/>
                </p>
                <p>Gracias,<br/>
                   Cesbe Ingenieria
                </p>
              </body>
            </html>
            `
            };
        } else {
            mailOptions = {
                from: "Sistemas@cesbe.com.br",
                to: email,
                subject: 'Cesbe Sign - Nova Conta',
                html: `
            <html>
                <head>
                    <meta charset="utf-8">
                </head>
                <body>
                
                <p>Olá ${name},</p>
                <p>Existe uma nova conta aguardando sua aprovação<br/><br/>
                    <b>Usuário:</b> ${user} <br/>
                    <b>Empresa:</b> ${company} <br/>
                </p>
                <p>Obrigado,<br/>
                   Cesbe Engenharia
                </p>
              </body>
            </html>
            `
            };
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("erro no aprover : ", error);
            }
        });

        response.status(200).json("OK");

    },
    async Send(request, response) {

        const emails = request.body.email;
        const to = request.body.to;
        const cc = request.body.cc;
        const requester = request.body.requester;
        const title = request.body.title;
        const description = request.body.description;
        const language = request.body.language;
        const id = request.body.id;
        
        var transporter = nodemailer.createTransport({
            host: "smtp.office365.com",
            port: 587,
            secure:false,
            requireTLS:true,
            auth: {
                user: "Sistemas@cesbe.com.br",
                pass: "Din8714!"
            },
        });
        var mailOptions;
        if (language == 'es-ES') {
            mailOptions = {
                from: "Sistemas@cesbe.com.br",
                to: emails,
                cc: cc,
                subject: 'Cesbe Sign - Documento de aprobación',
                html: `
            <html>
                <head>
                    <meta charset="utf-8">
                </head>
                <body>
              
                <p>Hola</p>
                <p>Hay un nuevo documento esperando su aprobación <br/><br/>
                    <b>Solicitante:</b> ${requester} <br/>
                    <b>Titulo:</b> ${title} <br/>
                    <b>Descripción:</b> ${description} <br/>
                    <br/><a href="http://docflow.cesbe.com.br:3000/readdocument/${id}">Clique aqui para acessar o documento</a>
                </p>
                <p>Gracias,<br/>
                   Cesbe Ingenieria
                </p>
              </body>
            </html>
            `,

            };
        } else {
            mailOptions = {
                from: "Sistemas@cesbe.com.br",
                to: emails,
                cc: cc,
                subject: 'Cesbe Sign - Documento para Aprovação',
                html: `
            <html>
                <head>
                    <meta charset="utf-8">
                </head>
                <body>
              
                <p>Olá</p>
                <p>Existe um novo documento aguardando sua aprovação <br/><br/>
                    <b>Solicitante:</b> ${requester} <br/>
                    <b>Título:</b> ${title} <br/>
                    <b>Descrição:</b> ${description} <br/>
                    <br/><a href="http://docflow.cesbe.com.br:3000/readdocument/${id}">Clique aqui para acessar o documento</a>
                </p>
                <p>Obrigado,<br/>
                   Cesbe Engenharia
                </p>
              </body>
            </html>
            `,

            };
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
        });

        response.status(200).json("OK");

    },
    async CopysApprovedSend(request, response) {

        const email = request.body.email;

        const to = request.body.to;
        const requester = request.body.requester;
        const title = request.body.title;
        const description = request.body.description;
        const language = request.body.language;
        const id = request.body.id;

        var transporter = nodemailer.createTransport({
             host: "smtp.office365.com",
            port: 587,
            secure:false,
            requireTLS:true,
            auth: {
                user: "Sistemas@cesbe.com.br",
                pass: "Din8714!"
            },
        });

        var mailOptions;

        if (language == 'es-ES') {
            mailOptions = {
                from: "Sistemas@cesbe.com.br",
                to: email,
                subject: 'Cesbe Sign - Copiar documento',
                html: `
            <html>
                <head>
                    <meta charset="utf-8">
                </head>
                <body>
               
                <p>Hola ${to},</p>
                <p>Un documento en el que está copiando (para seguimiento de aprobaciones), acaba de recibir una nueva aprobación <br/><br/>
                    <b>Solicitante:</b> ${requester} <br/>
                    <b>Titulo:</b> ${title} <br/>
                    <b>Descripción:</b> ${description} <br/>
                    <br/><a href="http://docflow.cesbe.com.br:3000/readdocument/${id}">Clique aqui para acessar o documento</a>
                </p>
                <p>Gracias,<br/>
                   Cesbe Ingenieria
                </p>
              </body>
            </html>
            `
            };
        } else {
            mailOptions = {
                from: "Sistemas@cesbe.com.br",
                to: email,
                subject: 'Cesbe Sign - Documento em cópia',
                html: `
            <html>
                <head>
                    <meta charset="utf-8">
                </head>
                <body>
               
                <p>Olá ${to},</p>
                <p>Um Documento ao qual você está cópia (para acompanhamento das aprovações), acaba de receber uma nova aprovação <br/><br/>
                    <b>Solicitante:</b> ${requester} <br/>
                    <b>Título:</b> ${title} <br/>
                    <b>Descrição:</b> ${description} <br/>
                    <br/><a href="http://docflow.cesbe.com.br:3000/readdocument/${id}">Clique aqui para acessar o documento</a>
                </p>
                <p>Obrigado,<br/>
                   Cesbe Engenharia
                </p>
              </body>
            </html>
            `
            };
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
        });

        response.status(200).json("OK");

    },
    async CopysLastApprovedSend(request, response) {

        const email = request.body.email;

        const to = request.body.to;
        const requester = request.body.requester;
        const title = request.body.title;
        const description = request.body.description;
        const language = request.body.language;
        const id = request.body.id;

        var transporter = nodemailer.createTransport({
             host: "smtp.office365.com",
            port: 587,
            secure:false,
            requireTLS:true,
            auth: {
                user: "Sistemas@cesbe.com.br",
                pass: "Din8714!"
            },
        });

        var mailOptions;
        if (language == 'es-ES') {
            mailOptions = {
                from: "Sistemas@cesbe.com.br",
                to: email,
                subject: 'Cesbe Sign - Copiar documento',
                html: `
            <html>
                <head>
                    <meta charset="utf-8">
                </head>
                <body>
               
                <p>Hola ${to},</p>
                <p>Un documento del que es copia (para supervisar las aprobaciones), acaba de ser aprobado en su totalidad <br/><br/>
                    <b>Solicitante:</b> ${requester} <br/>
                    <b>Titulo:</b> ${title} <br/>
                    <b>Descripción:</b> ${description} <br/>
                    <br/><a href="http://docflow.cesbe.com.br:3000/readdocument/${id}">Clique aqui para acessar o documento</a>
                </p>
                <p>Gracias,<br/>
                   Cesbe Ingenieria
                </p>
              </body>
            </html>
            `
            };
        } else {
            mailOptions = {
                from: "Sistemas@cesbe.com.br",
                to: email,
                subject: 'Cesbe Sign - Documento em cópia',
                html: `
            <html>
                <head>
                    <meta charset="utf-8">
                </head>
                <body>
               
                <p>Olá ${to},</p>
                <p>Um Documento ao qual você está cópia (para acompanhamento das aprovações), acaba de ser totalmente aprovado <br/><br/>
                    <b>Solicitante:</b> ${requester} <br/>
                    <b>Título:</b> ${title} <br/>
                    <b>Descrição:</b> ${description} <br/>
                    <br/><a href="http://docflow.cesbe.com.br:3000/readdocument/${id}">Clique aqui para acessar o documento</a>
                </p>
                <p>Obrigado,<br/>
                   Cesbe Engenharia
                </p>
              </body>
            </html>
            `
            };
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
        });

        response.status(200).json("OK");

    },

    async LastApprovedSend(request, response) {

        const email = request.body.email;

        const to = request.body.to;
        const requester = request.body.requester;
        const title = request.body.title;
        const description = request.body.description;
        const language = request.body.language;
        const id = request.body.id;

        var transporter = nodemailer.createTransport({
             host: "smtp.office365.com",
            port: 587,
            secure:false,
            requireTLS:true,
            auth: {
                user: "Sistemas@cesbe.com.br",
                pass: "Din8714!"
            },
        });

        var mailOptions;
        if (language == 'es-ES') {
            mailOptions = {
                from: "Sistemas@cesbe.com.br",
                to: email,
                subject: 'Cesbe Sign - Documento aprobado',
                html: `
            <html>
                <head>
                    <meta charset="utf-8">
                </head>
                <body>
               
                <p>Hola ${to},</p>
                <p>Un documento en el que estaba en la matriz de aprobación, acaba de ser aprobado en su totalidad <br/><br/>
                    <b>Solicitante:</b> ${requester} <br/>
                    <b>Titulo:</b> ${title} <br/>
                    <b>Descripción:</b> ${description} <br/>
                    <br/><a href="http://docflow.cesbe.com.br:3000/readdocument/${id}">Haga clic aquí para acceder al documento</a>
                </p>
                <p>Gracias,<br/>
                   Cesbe Ingenieria
                </p>
              </body>
            </html>
            `
            };
        } else {
            mailOptions = {
                from: "Sistemas@cesbe.com.br",
                to: email,
                subject: 'Cesbe Sign - Documento aprovado',
                html: `
            <html>
                <head>
                    <meta charset="utf-8">
                </head>
                <body>
               
                <p>Olá ${to},</p>
                <p>Um Documento ao qual você estava na matriz de aprovação, acaba de ser totalmente aprovado <br/><br/>
                    <b>Solicitante:</b> ${requester} <br/>
                    <b>Título:</b> ${title} <br/>
                    <b>Descrição:</b> ${description} <br/>
                    <br/><a href="http://docflow.cesbe.com.br:3000/readdocument/${id}">Clique aqui para acessar o documento</a>
                </p>
                <p>Obrigado,<br/>
                   Cesbe Engenharia
                </p>
              </body>
            </html>
            `
            };
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
        });

        response.status(200).json("OK");

    },
    async CopysRejectedSend(request, response) {

        const email = request.body.email;

        const to = request.body.to;
        const requester = request.body.requester;
        const title = request.body.title;
        const description = request.body.description;
        const language = request.body.language;
        const id = request.body.id;

        var transporter = nodemailer.createTransport({
             host: "smtp.office365.com",
            port: 587,
            secure:false,
            requireTLS:true,
            auth: {
                user: "Sistemas@cesbe.com.br",
                pass: "Din8714!"
            },
        });

        var mailOptions;

        if (language == 'es-ES') {
            mailOptions = {
                from: "Sistemas@cesbe.com.br",
                to: email,
                subject: 'Cesbe Sign - Copiar documento',
                html: `
            <html>
                <head>
                    <meta charset="utf-8">
                </head>
                <body>
                
                <p>Hola ${to},</p>
                <p>Un documento que está copiando (para supervisar las aprobaciones), acaba de ser rechazado <br/><br/>
                    <b>Solicitante:</b> ${requester} <br/>
                    <b>Titulo:</b> ${title} <br/>
                    <b>Descripción:</b> ${description} <br/>
                    <br/><a href="http://docflow.cesbe.com.br:3000/readdocument/${id}">Clique aqui para acessar o documento</a>
                </p>
                <p>Gracias,<br/>
                   Cesbe Ingenieria
                </p>
              </body>
            </html>
            `
            };
        } else {
            mailOptions = {
                from: "Sistemas@cesbe.com.br",
                to: email,
                subject: 'Cesbe Sign - Documento em cópia',
                html: `
            <html>
                <head>
                    <meta charset="utf-8">
                </head>
                <body>
                
                <p>Olá ${to},</p>
                <p>Um Documento ao qual você está cópia (para acompanhamento das aprovações), acaba de ser reprovado <br/><br/>
                    <b>Solicitante:</b> ${requester} <br/>
                    <b>Título:</b> ${title} <br/>
                    <b>Descrição:</b> ${description} <br/>
                    <br/><a href="http://docflow.cesbe.com.br:3000/readdocument/${id}">Clique aqui para acessar o documento</a>
                </p>
                <p>Obrigado,<br/>
                   Cesbe Engenharia
                </p>
              </body>
            </html>
            `
            };
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
        });

        response.status(200).json("OK");

    },

    async RejectedSend(request, response) {

        const email = request.body.email;

        const to = request.body.to;
        const requester = request.body.requester;
        const title = request.body.title;
        const description = request.body.description;
        const language = request.body.language;
        const id = request.body.id;

        var transporter = nodemailer.createTransport({
             host: "smtp.office365.com",
            port: 587,
            secure:false,
            requireTLS:true,
            auth: {
                user: "Sistemas@cesbe.com.br",
                pass: "Din8714!"
            },
        });

        var mailOptions;

        if (language == 'es-ES') {
            mailOptions = {
                from: "Sistemas@cesbe.com.br",
                to: email,
                subject: 'Cesbe Sign - Documento rechazado',
                html: `
            <html>
                <head>
                    <meta charset="utf-8">
                </head>
                <body>
                
                <p>Hola ${to},</p>
                <p>Un Documento para el que estaba en la matriz de aprobación acaba de ser rechazado <br/><br/>
                    <b>Solicitante:</b> ${requester} <br/>
                    <b>Titulo:</b> ${title} <br/>
                    <b>Descripción:</b> ${description} <br/>
                    <br/><a href="http://docflow.cesbe.com.br:3000/readdocument/${id}">Haga clic aquí para acceder al documento</a>
                </p>
                <p>Gracias,<br/>
                   Cesbe Ingenieria
                </p>
              </body>
            </html>
            `
            };
        } else {
            mailOptions = {
                from: "Sistemas@cesbe.com.br",
                to: email,
                subject: 'Cesbe Sign - Documento reprovado',
                html: `
            <html>
                <head>
                    <meta charset="utf-8">
                </head>
                <body>
                
                <p>Olá ${to},</p>
                <p>Um Documento ao qual você estava na matriz de aprovação, acaba de ser reprovado<br/><br/>
                    <b>Solicitante:</b> ${requester} <br/>
                    <b>Título:</b> ${title} <br/>
                    <b>Descrição:</b> ${description} <br/>
                    <br/><a href="http://docflow.cesbe.com.br:3000/readdocument/${id}">Clique aqui para acessar o documento</a>
                </p>
                <p>Obrigado,<br/>
                   Cesbe Engenharia
                </p>
              </body>
            </html>
            `
            };
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
        });

        response.status(200).json("OK");

    },
    async CopysNewSend(request, response) {

        const email = request.body.email;

        const to = request.body.to;
        const requester = request.body.requester;
        const title = request.body.title;
        const description = request.body.description;
        const language = request.body.language;
        const id = request.body.id;

        var transporter = nodemailer.createTransport({
             host: "smtp.office365.com",
            port: 587,
            secure:false,
            requireTLS:true,
            auth: {
                user: "Sistemas@cesbe.com.br",
                pass: "Din8714!"
            },
        });

        var mailOptions;

        if (language == 'es-ES') {
            mailOptions = {
                from: "Sistemas@cesbe.com.br",
                to: email,
                subject: 'Cesbe Sign - Copiar documento',
                html: `
            <html>
                <head>
                    <meta charset="utf-8">
                </head>
                <body>
               
                <p>Hola ${to},</p>
                <p>Se le ha "copiado" para el seguimiento de un nuevo documento enviado para su aprobación <br/><br/>
                    <b>Solicitante:</b> ${requester} <br/>
                    <b>Titulo:</b> ${title} <br/>
                    <b>Descripción:</b> ${description} <br/>
                    <br/><a href="http://docflow.cesbe.com.br:3000/readdocument/${id}">Clique aqui para acessar o documento</a>
                </p>
                <p>Gracias,<br/>
                   Cesbe Ingenieria
                </p>
              </body>
            </html>
            `
            };
        } else {
            mailOptions = {
                from: "Sistemas@cesbe.com.br",
                to: email,
                subject: 'Cesbe Sign - Documento em cópia',
                html: `
            <html>
                <head>
                    <meta charset="utf-8">
                </head>
                <body>
               
                <p>Olá ${to},</p>
                <p>Você foi colocado "em cópia", para acompanhamento, de um novo documento enviado para aprovação <br/><br/>
                    <b>Solicitante:</b> ${requester} <br/>
                    <b>Título:</b> ${title} <br/>
                    <b>Descrição:</b> ${description} <br/>
                    <br/><a href="http://docflow.cesbe.com.br:3000/readdocument/${id}">Clique aqui para acessar o documento</a>
                </p>
                <p>Obrigado,<br/>
                   Cesbe Engenharia
                </p>
              </body>
            </html>
            `
            };
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
        });

        response.status(200).json("OK");

    },
    async Recover(request, response) {
        const Email = request.body.Email;

        var min = Math.ceil(000001);
        var max = Math.floor(999999);
        const NewPassword = 'Cesbe' + Math.floor(Math.random() * (max - min)) + min;
        const language = request.body.language;

        var transporter = nodemailer.createTransport({
             host: "smtp.office365.com",
            port: 587,
            secure:false,
            requireTLS:true,
            auth: {
                user: "Sistemas@cesbe.com.br",
                pass: "Din8714!"
            },
        });

        var mailOptions;

        if (language == 'es-ES') {
            mailOptions = {
                from: "Sistemas@cesbe.com.br",
                to: Email,
                subject: 'Cesbe Sign - Recuperación de contraseña',
                html: `
            <html>
                <head>
                    <meta charset="utf-8">
                </head>
                <body>
               
                <p>Su nueva contraseña para acceder al Portal Cesbe Sign <br/><br/>
                    <b>Nueva contraseña:</b> ${NewPassword} <br/>
                </p>
                <p>Después de su primer inicio de sesión, se le pedirá que cambie su contraseña</p>
                <br/><br/>
                <p>Gracias,<br/>
                   Cesbe Ingenieria
                </p>
              </body>
            </html>
            `
            };
        } else {
            mailOptions = {
                from: "Sistemas@cesbe.com.br",
                to: Email,
                subject: 'Cesbe Sign - Recuperação de Senha',
                html: `
            <html>
                <head>
                    <meta charset="utf-8">
                </head>
                <body>
               
                <p>Sua nova senha de acesso ao Portal Cesbe Sign <br/><br/>
                    <b>Nova senha:</b> ${NewPassword} <br/>
                </p>
                <p>Após seu primeiro login, será solicitada a alteração de sua senha</p>
                <br/><br/>
                <p>Obrigado,<br/>
                   Cesbe Engenharia
                </p>
              </body>
            </html>
            `
            };
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
        });

        connection.query('UPDATE users u SET u.password = "' + NewPassword + '" WHERE u.email = "' + Email + '"', function (error, results, fields) { });

        response.status(200).json(true);

    },
    async Register(request, response) {
        const email = request.body.Email;
        const language = request.body.language;

        var transporter = nodemailer.createTransport({
             host: "smtp.office365.com",
            port: 587,
            secure:false,
            requireTLS:true,
            auth: {
                user: "Sistemas@cesbe.com.br",
                pass: "Din8714!"
            },
        });

        var mailOptions;

        if (language == 'es-ES') {
            mailOptions = {
                from: "Sistemas@cesbe.com.br",
                to: email,
                subject: 'Cesbe Sign - Nueva cuenta',
                html: `
            <html>
                <head>
                    <meta charset="utf-8">
                </head>
                <body>
                
                <p>Su nueva cuenta se ha creado con éxito, espere a que uno de nuestros administradores apruebe su acceso al Portal Cesbe Sign </p>
                <br/><br/>
                <p>Gracias,<br/>
                   Cesbe Ingenieria
                </p>
              </body>
            </html>
            `
            };
        } else {
            mailOptions = {
                from: "Sistemas@cesbe.com.br",
                to: email,
                subject: 'Cesbe Sign - Nova Conta',
                html: `
            <html>
                <head>
                    <meta charset="utf-8">
                </head>
                <body>
                
                <p>Sua nova conta foi criada com sucesso, aguarde que em breve um de nossos administradores irão aprovar o seu acesso ao Portal Cesbe Sign </p>
                <br/><br/>
                <p>Obrigado,<br/>
                   Cesbe Engenharia
                </p>
              </body>
            </html>
            `
            };
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
        });

        response.status(200).json("OK");

    },
    async Approved(request, response) {
        const Email = request.body.Email;
        const language = request.body.language;

        var min = Math.ceil(000001);
        var max = Math.floor(999999);
        const NewPassword = 'Cesbe' + Math.floor(Math.random() * (max - min)) + min;

        var transporter = nodemailer.createTransport({
             host: "smtp.office365.com",
            port: 587,
            secure:false,
            requireTLS:true,
            auth: {
                user: "Sistemas@cesbe.com.br",
                pass: "Din8714!"
            },
        });

        var mailOptions;

        if (language == 'es-ES') {
            mailOptions = {
                from: "Sistemas@cesbe.com.br",
                to: Email,
                subject: 'Cesbe Sign - Cuenta aprobada',
                html: `
            <html>
                <head>
                    <meta charset="utf-8">
                </head>
                <body>
                
                <p>Su cuenta ha sido aprobada por alguno de los administradores <br/>
                <b>Su contraseña:</b> ${NewPassword} <br/>
                </p>
                <br/><br/>
                <p>Gracias,<br/>
                   Cesbe Ingenieria
                </p>
              </body>
            </html>
            `
            };
        } else {
            mailOptions = {
                from: "Sistemas@cesbe.com.br",
                to: Email,
                subject: 'Cesbe Sign - Conta aprovada',
                html: `
            <html>
                <head>
                    <meta charset="utf-8">
                </head>
                <body>
                
                <p>Sua conta foi aprovada por algum dos administradores <br/>
                <b>Sua senha:</b> ${NewPassword} <br/>
                </p>
                <br/><br/>
                <p>Obrigado,<br/>
                   Cesbe Engenharia
                </p>
              </body>
            </html>
            `
            };
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
        });

        connection.query('UPDATE users u SET u.password = "' + NewPassword + '" WHERE u.email = "' + Email + '"', function (error, results, fields) { });

        response.status(200).json("OK");
    },
    async SendStatus(request, response) {
        const email = request.body.email;
        const status = request.body.status;
        const title = request.body.title;
        const description = request.body.description;
        const language = request.body.language;
        const id = request.body.id;

        var subjectText;
        var Descriptiontext;

        if (language == 'es-ES') {
            if (status == 'aprovado') {
                subjectText = 'Cesbe Sign - Documento aprobado';
                Descriptiontext = 'Su documento ha sido completamente aprobado por los aprobadores designados';
            } else {
                subjectText = 'Cesbe Sign - Documento rechazado';
                Descriptiontext = 'Su documento ha sido rechazado en algún nivel de aprobación';
            }
        } else {
            if (status == 'aprovado') {
                subjectText = 'Cesbe Sign - Documento Aprovado';
                Descriptiontext = 'O seu documento foi totalmente aprovado pelos aprovadores designados';
            } else {
                subjectText = 'Cesbe Sign - Documento Reprovado';
                Descriptiontext = 'O seu documento foi reprovado em algum nível de aprovação';
            }
        }

        var transporter = nodemailer.createTransport({
             host: "smtp.office365.com",
            port: 587,
            secure:false,
            requireTLS:true,
            auth: {
                user: "Sistemas@cesbe.com.br",
                pass: "Din8714!"
            },
        });

        var mailOptions;

        if (language == 'es-ES') {
            mailOptions = {
                from: "Sistemas@cesbe.com.br",
                to: email,
                subject: subjectText,
                html: `
            <html>
                <head>
                    <meta charset="utf-8">
                </head>
                <body>
                
                <p>${Descriptiontext}<br/><br/>
                    <b>Titulo:</b> ${title} <br/>
                    <b>Descripción:</b> ${description} <br/>
                    <br/><a href="http://docflow.cesbe.com.br:3000/readdocument/${id}">Clique aqui para acessar o documento</a>
                </p>
                <br/><br/>
                <p>Gracias,<br/>
                   Cesbe Ingenieria
                </p>
              </body>
            </html>
            `
            };
        } else {
            mailOptions = {
                from: "Sistemas@cesbe.com.br",
                to: email,
                subject: subjectText,
                html: `
            <html>
                <head>
                    <meta charset="utf-8">
                </head>
                <body>
                
                <p>${Descriptiontext}<br/><br/>
                    <b>Título:</b> ${title} <br/>
                    <b>Descrição:</b> ${description} <br/>
                    <br/><a href="http://docflow.cesbe.com.br:3000/readdocument/${id}">Clique aqui para acessar o documento</a>
                </p>
                <br/><br/>
                <p>Obrigado,<br/>
                   Cesbe Engenharia
                </p>
              </body>
            </html>
            `
            };
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
        });
        response.status(200).json("OK");
    },
}