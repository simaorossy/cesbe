import React, { useState } from 'react';
import { useEffect } from 'react';
import { useLocation, useHistory } from "react-router-dom";
import Menu from '../Menu';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, responsiveFontSizes } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import BlockIcon from '@material-ui/icons/Block';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import CancelScheduleSendIcon from '@material-ui/icons/CancelScheduleSend';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Autocomplete from '@material-ui/lab/Autocomplete';

import api from '../../services/api';
//tradução
import i18n from '../../translate/i18n'

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(10),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    root2: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    typography: {
        fontSize: 24,
        fontWeight: 300,
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
    },
    typography2: {
        fontSize: 16,
        fontWeight: 300,
        marginBottom: theme.spacing(1),
    },
    typography3: {
        fontSize: 14,
        fontWeight: 300,
    },
    title: {
        fontSize: 20,
        fontWeight: 200,
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(3),
    },
    button: {
        margin: theme.spacing(1)
    }
}));

export default function DashboardDetails() {

    const classes = useStyles();
    const history = useHistory();

    const [Send, SetSend] = useState(i18n.t('tables.send'));
    const location = useLocation();
    const [buttonsApprove, setButtonsApprove] = useState(false);
    const [buttonEditApproves, setButtonEditApproves] = useState(false);
    const [buttonResend, setButtonResend] = useState(false);
    const [buttonCancelSend, setButtonCancelSend] = useState(false);
    const [Users, setUsers] = useState();
    const [descricao, setDescricao] = useState('');
    const [openAwait, setopenAwait] = React.useState(false);
    const [UsersMatriz, setUsersMatriz] = useState();
    const [OldUsersMatriz, setOldUsersMatriz] = useState(undefined);
    const [dataUsers, setDataUsers] = useState([]);
    const [editLevel, setEditLevel] = useState(0);
    const [openReject, setOpenReject] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);
    const [openMatriz, setOpenMatriz] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [DialogText, setDialogText] = useState("Tela em desenvolvimento!");
    const [RefusalsList, setRefusalsList] = useState([]);
    const [Refusal, setRefusal] = useState(0);
    const [DocCount, setDocCount] = useState(0);
    const [ClickDoc, setClickDoc] = useState(0);

    useEffect(() => {
        SetSend('Envio ' + location.state.send);
        getHistory(location.state.send);
        getApprovers(location.state.send);
        getDocs(location.state.send);
        getUsers();
        getRefusals();
    }, []);

    const [data] = useState([
        { user: 1, level: 1 },
        { user: 2, level: 2 },
        { user: 3, level: 3 },
        { user: 4, level: 0 },
    ]);

    const handleClose = (value) => {
        setOpen(false);
        if (DialogText === i18n.t("messagesText.reproved_send") || DialogText === i18n.t("messagesText.aproved_send") || DialogText === i18n.t("messagesText.reproved_send_level") || DialogText === i18n.t("messagesText.aproved_send_level")) {
            history.push({
                pathname: '/dashboard',
                state: { name: localStorage.getItem('Username') }
            });
        }
        if (DialogText === i18n.t("messagesText.cancel_send") || DialogText === i18n.t("errors.error")) {
            getHistory(location.state.send);
        }
        if (DialogText === i18n.t("messagesText.matriz_update_all") || DialogText === i18n.t("messagesText.matriz_update")) {
            getApprovers(location.state.send);
        }
    };

    const handleCloseReject = (value) => {
        setOpenReject(false);
    };

    const handleCloseEdit = (value) => {
        setOpenEdit(false);
    };

    const handleCloseMatriz = (value) => {
        setOpenMatriz(false);

        setTimeout(function () {
            setDialogText(i18n.t("messagesText.matriz_update"));
            setOpen(true);
        }, 1000);

    };

    const [stateUsers, setStateUsers] = React.useState({
        columns: [
            { title: i18n.t('tables.code'), field: 'id', hidden: true, editable: 'never' },
            { title: i18n.t('tables.name'), field: 'user', lookup: {} },
            {
                title: i18n.t('tables.new_user'), field: 'newuser', lookup: Users,
                render: rowData => {
                    if (rowData.level > location.state.current_level || rowData.level == 0) {
                        return (
                            <Autocomplete
                                options={Users}
                                style={{ width: 300 }}
                                getOptionLabel={(option) => option.name + ' (' + option.email + ')'}
                                renderInput={(params) => <TextField {...params} value={rowData.email} />}
                            />
                        )
                    } else {
                        return (
                            <Autocomplete
                                options={Users}
                                style={{ width: 300 }}
                                disabled={true}
                                getOptionLabel={(option) => option.name + ' (' + option.email + ')'}
                                renderInput={(params) => <TextField disabled={true} {...params} />}
                            />
                        )
                    }
                }

            },
            { title: i18n.t('tables.level'), field: 'level', defaultSort: 'asc', lookup: { 0: i18n.t("tables.level"), 1: i18n.t("tables.level") + '1', 2: i18n.t("tables.level") + ' 2', 3: i18n.t("tables.level") + ' 3', 4: i18n.t("tables.level") + ' 4', 5: i18n.t("tables.level") + ' 5', 6: i18n.t("tables.level") + ' 6', 7: i18n.t("tables.level") + ' 7', 8: i18n.t("tables.level") + ' 8', 9: i18n.t("tables.level") + ' 9', 10: i18n.t("tables.level") + ' 10' }, editable: 'never' },
            //{ title: 'SLA (Horas)', field: 'sla', type: 'numeric', validate: rowData => rowData.sla > 9999 ? { isValid: false, helperText: 'SLA muito grande' } : true, },
            { title: i18n.t('tables.send'), field: 'send', hidden: true, editable: 'never' },
        ],
        data: dataUsers,
    });

    var UsersList = location.state.users.reduce(function (acc, cur, i) {
        acc[cur.id] = cur.name;
        return acc;
    }, {});

    const [state, setState] = React.useState({
        columns: [
            { title: i18n.t('tables.code'), field: 'id', hidden: true, export: false },
            { title: i18n.t('tables.name'), field: 'user', lookup: UsersList },
            { title: i18n.t('tables.email'), field: 'email' },
            { title: i18n.t('tables.level'), field: 'level', defaultSort: 'asc', lookup: { 0: 'Em Cópia', 1: i18n.t("tables.level") + ' 1', 2: i18n.t("tables.level") + ' 2', 3: i18n.t("tables.level") + ' 3', 4: i18n.t("tables.level") + ' 4', 5: i18n.t("tables.level") + ' 5', 6: i18n.t("tables.level") + ' 6', 7: i18n.t("tables.level") + ' 7', 8: i18n.t("tables.level") + ' 8', 9: i18n.t("tables.level") + ' 9', 10: i18n.t("tables.level") + ' 10' } },
            { title: i18n.t('tables.matriz'), field: 'approve', hidden: true, export: false },
        ],
        data: data,
    });

    const [dataHistory] = useState([]);

    const [DocList, setDocList] = useState([]);

    const [stateHistory, setStateHistory] = React.useState({
        columns: [
            { title: i18n.t('tables.code'), field: 'id', hidden: true, export: false },
            { title: i18n.t('tables.hour_time'), field: 'date' },
            { title: i18n.t('tables.status'), field: 'status', lookup: { 0: i18n.t('titles.wait_aproved'), 2: i18n.t('title.aproved'), 3: i18n.t('title.reproved'), 5: i18n.t('title.cancel') } },
            { title: i18n.t('tables.level'), field: 'level', lookup: { 0: i18n.t('titles.sended'), 1: i18n.t('titles.level') + ' 1', 2: i18n.t('titles.level') + ' 2', 3: i18n.t('titles.level') + ' 3', 4: i18n.t('titles.level') + ' 4', 5: i18n.t('titles.level') + ' 5', 6: i18n.t('titles.level') + ' 6', 7: i18n.t('titles.level') + ' 7' } },
            { title: i18n.t('tables.user'), field: 'user', lookup: UsersList },
        ],
        data: dataHistory,
    });

    async function getRefusals() {
        const response = await api.get('refusalsactives');
        setRefusalsList(response.data);

    }

    async function getHistory(send) {
        const response = await api.post('sendgethistory', {
            send: send
        });
        setStateHistory({
            columns: [
                { title: i18n.t('tables.send'), field: 'send', hidden: true, export: true },
                { title: i18n.t('tables.hour_time'), field: 'date' },
                { title: i18n.t('tables.title'), field: 'title', hidden: true, export: true },
                { title: 'Status', field: 'status', lookup: { 0: i18n.t("status.wait_aproved"),  2:  i18n.t("status.approved"), 3:  i18n.t("status.reproved"), 5:  i18n.t("status.canceled") } },
                { title: i18n.t('tables.level'), field: 'current_level', lookup: { 0: i18n.t("titles.sended"), 1: i18n.t("tables.level") + ' 1', 2: i18n.t("tables.level") + ' 2', 3: i18n.t("tables.level") + ' 3', 4: i18n.t("tables.level") + ' 4', 5: i18n.t("tables.level") + ' 5', 6: i18n.t("tables.level") + ' 6', 7: i18n.t("tables.level") + ' 7' } },
                { title: i18n.t('tables.code'), field: 'id', hidden: true, export: false },
                { title: i18n.t('tables.user'), field: 'user', lookup: UsersList },
                { title: i18n.t('tables.description'), field: 'description', hidden: true, export: true },
                { title: i18n.t('tables.reason'), field: 'refusal_description', hidden: false, export: true },
            ],
            data: response.data,
        });

        var len = response.data.length - 1;
        getType(response.data[len].status);
    };

    async function getApprovers(send) {

        const res = await api.post('sendgettoken', {
            id: send
        });
        const response = await api.post('sendgetapprovers', {
            send: res.data[0].token
        });

        setState({
            columns: [
                { title: i18n.t('tables.code'), field: 'id', hidden: true, export: false },
                { title: i18n.t('tables.name'), field: 'user', lookup: UsersList },
                { title: i18n.t('tables.email'), field: 'email' },
                { title: i18n.t('tables.level'), field: 'level', defaultSort: 'asc', lookup: { 0: i18n.t("tables.in_copy"), 1: i18n.t("tables.level") + ' 1', 2: i18n.t("tables.level") + ' 2', 3: i18n.t("tables.level") + ' 3', 4: i18n.t("tables.level") + ' 4', 5: i18n.t("tables.level") + ' 5', 6: i18n.t("tables.level") + ' 6', 7: i18n.t("tables.level") + ' 7', 8: i18n.t("tables.level") + ' 8', 9: i18n.t("tables.level") + ' 9', 10: i18n.t("tables.level") + ' 10' } },
                { title: i18n.t('tables.matriz'), field: 'approve', hidden: true, export: false },
            ],
            data: response.data,
        });
    };

    async function getDocs(send) {

        const response = await api.post('sendgetdocs', {
            send: send
        });

        setDocList(response.data);
        setDocCount(response.data.length);
    };

    function getType(laststatus) {
        console.log(location.state)
        console.log(laststatus)
        //Editar
        if (location.state.status != 0 || location.state.type == 1 || location.state.type == 5 || location.state.type == 6 || location.state.type == 0 || location.state.type == 10 || location.state.type == 11 || location.state.type == 13 || location.state.type == 15 || location.state.type == 19) {
            setButtonEditApproves(true);
        }
        //Reenviar
        if (location.state.type != 3 || laststatus != 3) {
            setButtonResend(true);
        }
        //Cancelar
        if (location.state.status != 0 || location.state.type == 1 || location.state.type == 5 || location.state.type == 6 || location.state.type == 0 || location.state.type == 10 || location.state.type == 11 || location.state.type == 13 || location.state.type == 15 || location.state.type == 19) {
            setButtonCancelSend(true);
        }
        //Aprovar e Rejeitar
        if (location.state.status != 0 || location.state.type == 3 || location.state.type == 5 || location.state.type == 8 || location.state.type == 0 || location.state.type == 10 || location.state.type == 11 || location.state.type == 13 || location.state.type == 15 || location.state.type == 19) {
            setButtonsApprove(true);
        }
    }
    
    //pega os usuarios ativos
    async function getUsers() {
        const response = await api.get('usersactives');
        setUsers(response.data);
    }

    async function ApproveSend(e) {
        e.preventDefault();

        if(ClickDoc < DocCount){
            setDialogText('Necessário visualizar os documentos enviados para efetuar a aprovação');
            setOpen(true);
        }else{

            setopenAwait(true);

            const MyID = localStorage.getItem('id');

            const sendlevel = await api.post('getsendlevel', {
                id: location.state.id
            })

            if (sendlevel.data[0].level !== location.state.current_level) {
                setopenAwait(false);
                setDialogText(i18n.t('messagesText.aproved_send_level'));
                setOpen(true);
            } else {

                var date = location.state.last_update;

                if(date == undefined){
                    date = location.state.data;
                }

                //Salvar Histórico
                await api.post('sendhistory', {
                    status: location.state.status,
                    current_level: location.state.current_level,
                    send: location.state.id,
                    data: date
                });
                
                //Verificar o último nível da matriz
                const response = await api.post('lastlevel', {
                    id: location.state.send
                });

                const Level = location.state.current_level + 1;

                var status_level;

                //Busca o usuário que criou o envio
                const send_creator = await api.post('getcreator', {
                    id: location.state.id
                })

                if (response.data[0].last === Level) {
                    status_level = 2

                   
                    
                    //Notifica o criador do envio aprovado
                    await api.post('notifysendstatus', {
                        email: send_creator.data[0].email,
                        status: 'aprovado',
                        title: location.state.title,
                        description: location.state.description,
                        language: i18n.language,
                        id: location.state.id
                    });

                 
                } else {
                    status_level = 0
                }

                //Alterar 
                await api.post('sendupdate', {
                    id: location.state.id,
                    current_level: Level,
                    user: MyID,
                    status: status_level,
                    refusal: 0,
                    description: ''
                });

                const res = await api.post('sendgettoken', {
                    id: location.state.id
                });

               

                if(status_level == 2){

                  

                    await api.post('createpdf', {
                        id: location.state.id,
                        token: res.data[0].token,
                    });

                  
            
                }

              

                //Buscar usuários
                const resp = await api.post('userssend', {
                    current_level: (Level + 1),
                    send: res.data[0].token,
                });

                //Buscar todos usuários
                const respall = await api.post('alluserssend', {
                    send: res.data[0].token,
                });

                //Buscar usuários em cópia
                const respcopys = await api.post('userscopysend', {
                    send: res.data[0].token,
                });

                //caso o usuario anterior aprovar, ele envia email pros prox aprovadores
                let arr1 = [];
                let arr2 = [];

                resp.data.map(item => arr1.push(item.email));
                respcopys.data.map(item => arr2.push(item.email))
                if (arr1) {
                    await api.post('notifysend', {
                        email: arr1,
                        to: "",
                        cc: arr2,
                        requester: send_creator.data[0].name,
                        title: location.state.title,
                        description: location.state.description,
                        language: i18n.language,
                        id: location.state.id
                    })
                }

                //Enviar E-mail para os usuários em cópia
                if (status_level !== 2) {
                    for (let index = 0; index < respcopys.data.length; index++) {
                        await api.post('notifycopysapprovedsend', {
                            email: respcopys.data[index].email,
                            to: respcopys.data[index].name,
                            requester: send_creator.data[0].name,
                            title: location.state.title,
                            description: location.state.description,
                            language: i18n.language,
                            id: location.state.id
                        })
                    }
                } else {
                    for (let index = 0; index < respcopys.data.length; index++) {
                        await api.post('notifycopyslastapprovedsend', {
                            email: respcopys.data[index].email,
                            to: respcopys.data[index].name,
                            requester: send_creator.data[0].name,
                            title: location.state.title,
                            description: location.state.description,
                            language: i18n.language,
                            id: location.state.id
                        })
                    }
                    for (let index = 0; index < respall.data.length; index++) {
                        await api.post('notifylastapprovedsend', {
                            email: respall.data[index].email,
                            to: respall.data[index].name,
                            requester: send_creator.data[0].name,
                            title: location.state.title,
                            description: location.state.description,
                            language: i18n.language,
                            id: location.state.id
                        })
                    }
                }

                //Reload
                setopenAwait(false);
                setDialogText(i18n.t('messagesText.aproved_send'));
                setOpen(true);
            }
        }
    }

    async function RejectSend(e) {

        e.preventDefault();
       
        if(ClickDoc < DocCount){
            setDialogText('Necessário visualizar os documentos enviados para efetuar a rejeição');
            setOpen(true);
        }else{
            setopenAwait(true);

            const MyID = localStorage.getItem('id');

            const sendlevel = await api.post('getsendlevel', {
                id: location.state.id
            })

            if (sendlevel.data[0].level !== location.state.current_level) {
                setOpenReject(false);
                setopenAwait(false);
                setDialogText(i18n.t("messagesText.reproved_send_level"));
                setOpen(true);
            } else {
                //
                if (Refusal !== 0) {

                    var date = location.state.last_update;
                    
                    if(date == undefined){
                        date = location.state.data;
                    }
    
                    //Salvar Histórico
                    await api.post('sendhistory', {
                        status: location.state.status,
                        current_level: location.state.current_level,
                        send: location.state.id,
                        data: date,
                    });

                    const Level = location.state.current_level + 1;

                    //Alterar 
                    await api.post('sendupdate', {
                        id: location.state.id,
                        current_level: Level,
                        user: MyID,
                        status: 3,
                        refusal: Refusal,
                        description: descricao
                    });

                    setOpenReject(false);

                    //Busca o usuário que criou o envio
                    const send_creator = await api.post('getcreator', {
                        id: location.state.id
                    })

                    //Notifica o criador (envio rejeitado)
                    await api.post('notifysendstatus', {
                        email: send_creator.data[0].email,
                        status: 'rejeitado',
                        title: location.state.title,
                        description: location.state.description,
                        language: i18n.language,
                        id: location.state.id
                    });
                
                    const res = await api.post('sendgettoken', {
                        id: location.state.id
                    });
            
                    // await api.post('createpdf', {
                    //     id: location.state.id,
                    //     token: res.data[0].token,
                    // });
        
                    //Buscar usuários em cópia
                    const respcopys = await api.post('userscopysend', {
                        send: res.data[0].token,
                    });

                    //Buscar todos usuários
                    const respall = await api.post('alluserssend', {
                        send: res.data[0].token,
                    });

                    //Notifica os usuários em cópia
                    for (let index = 0; index < respcopys.data.length; index++) {
                        await api.post('notifycopysrejectedsend', {
                            email: respcopys.data[index].email,
                            to: respcopys.data[index].name,
                            requester: send_creator.data[0].name,
                            title: location.state.title,
                            description: location.state.description,
                            language: i18n.language,
                            id: location.state.id
                        })
                    }
                    
                    for (let index = 0; index < respall.data.length; index++) {
                        await api.post('notifyrejectedsend', {
                            email: respall.data[index].email,
                            to: respall.data[index].name,
                            requester: send_creator.data[0].name,
                            title: location.state.title,
                            description: location.state.description,
                            language: i18n.language,
                            id: location.state.id
                        })
                    }

                    //Reload
                    setTimeout(function () {
                        setopenAwait(false);
                        setDialogText(i18n.t("messagesText.reproved_send_level"));
                        setOpen(true);
                    }, 1000);
                }
            }
        }

    }
    //pode ser que de problema futuramente pois to substituindo alguns dados que podem ou não ser sensiveis
    //caso de problema no editar de uma olhada aqui
    const selectEdit = (e, j, oldRow, arr) => {

        if (j && j.email) {

            let exist = arr.find((d) => d.user == j.id);
            if (exist) {
                setDialogText(i18n.t("messagesText.user_association"));
                setOpen(true);
            } else {

                let dt = arr.find((d) => d.email == oldRow.email);
                arr[arr.indexOf(dt)].user = j.id;
                arr[arr.indexOf(dt)].email = j.email;
                arr[arr.indexOf(dt)].name = j.name;


            }
        }
    }

    async function EditModal(e) {
        e.preventDefault();

        setEditLevel(location.state.current_level);

        const res = await api.post('sendgettoken', {
            id: location.state.id
        });

        const response = await api.post('sendgetapprovers', {
            send: res.data[0].token
        });

        var UsersList = Users.reduce(function (acc, cur, i) {
            acc[cur.id] = cur.name;
            return acc;
        }, {});



        setStateUsers({
            columns: [
                { title: i18n.t('tables.code'), field: 'id', hidden: true, editable: 'never' },
                // { title: i18n.t('titles.name'), field: 'user', lookup: UsersList },
                {
                    title: i18n.t('tables.name'), field: 'newuser', lookup: Users,
                    render: (rowData) => {

                        rowData.name = Users.find((d) => d.id == rowData.user).name


                        if (rowData.level > location.state.current_level || rowData.level == 0) {
                            return (
                                <Autocomplete
                                    options={Users}
                                    style={{ width: 300 }}
                                    onChange={(e, j) => selectEdit(e, j, rowData, response.data)}
                                    value={rowData}
                                    getOptionLabel={(option) => option.name + ' (' + option.email + ')'}
                                    renderInput={(params) => <TextField  {...params} />}
                                />
                            )
                        } else {
                            return (                                
                                <Autocomplete
                                    options={Users}
                                    style={{ width: 300 }}
                                    disabled={true}
                                    value={rowData}
                                    getOptionLabel={(option) => option.name + ' (' + option.email + ')'}
                                    renderInput={(params) => <TextField disabled={true} {...params} />}
                                />
                            )
                        }
                    }

                },
                { title: i18n.t('tables.level'), field: 'level', defaultSort: 'asc', lookup: { 0: i18n.t("tables.in_copy"), 1: i18n.t("tables.level") + ' 1', 2: i18n.t("tables.level") + ' 2', 3: i18n.t("tables.level") + ' 3', 4: i18n.t("tables.level") + ' 4', 5: i18n.t("tables.level") + ' 5', 6: i18n.t("tables.level") + ' 6', 7: i18n.t("tables.level") + ' 7', 8: i18n.t("tables.level") + ' 8', 9: i18n.t("tables.level") + ' 9', 10: i18n.t("tables.level") + ' 10' }, editable: 'never' },
                //{ title: 'SLA (Horas)', field: 'sla', type: 'numeric', validate: rowData => rowData.sla > 9999 ? { isValid: false, helperText: 'SLA muito grande' } : true, },
                { title: i18n.t('tables.send'), field: 'send', hidden: true, editable: 'never' },
            ],
            data: response.data,
        })

        setUsersMatriz(response.data);

        setOpenEdit(true);

    }

    //tarefa cancelar envio 
    async function cancelSend(e) {
        e.preventDefault();

        try {
            const res = await api.post('sendhistory', {

                status: location.state.status,
                current_level: location.state.current_level,
                send: location.state.id,
                data: location.state.data
            })

            if (res.data) {
                const response = await api.post('sendupdate', {
                    user: location.state.user,
                    status: 5,
                    id: location.state.id,
                    current_level: location.state.current_level,
                    refusal: 0,
                    description: ""
                })
    
                const res = await api.post('sendgettoken', {
                    id: location.state.id
                });
        
                // await api.post('createpdf', {
                //     id: location.state.id,
                //     token: res.data[0].token,
                // });
    
                setDialogText(i18n.t("messagesText.cancel_send"));
                setOpen(true);

            }

        } catch (error) {
            setDialogText(i18n.t("errors.exist_matriz"));
            setOpen(true);
        }

    }

    function FindName(data, newData) {
        var ret = 0;
        //Verifica o nome
        for (let index = 0; index < data.length; index++) {
            var user = data[index].user;
            if (user == newData.user) {
                ret = 1;
            }
        }
        return ret
    }

    function FindLevel(data, newData) {
        var ret = 0;

        //Verifica o nível
        if (data.length > 0) {
            var LastLevel = 0;
            for (let index = 0; index < data.length; index++) {
                var level = parseInt(data[index].level);
                if (LastLevel < level) {
                    LastLevel = level;
                }
            }

            LastLevel += 1;
            if (parseInt(newData.level) > LastLevel) {
                ret = 1
            }
        } else {
            if (parseInt(newData.level) > 1) {
                ret = 1
            }
        }
        return ret
    }

    async function EditApprove(e) {

        e.preventDefault();
        let arr = [];
      
        const response = await api.post('sendgetapprovers', {
            send: UsersMatriz[0].send
        });
        setOldUsersMatriz(response.data)
        
        for (let index = 0; index < UsersMatriz.length; index++) {
            if (response.data[index].user != UsersMatriz[index].user) {
                if (UsersMatriz[index].level == (location.state.current_level + 1)) {
                    arr.push(UsersMatriz[index])
                }
            }
        }

        if (arr) {
            await api.post('notifysend', {
                email: arr,
                to: " ",
                cc: UsersMatriz.filter((d) => d.level == 0),
                requester: location.state.name,
                title: location.state.title,
                description: location.state.description,
                language: i18n.language,
                id: location.state.id
            })
        }

        await api.post('senddeleteapprovers', {
            send: UsersMatriz[0].send
        });

        for (let index = 0; index < UsersMatriz.length; index++) {

            await api.post('sendapprovers', {
                user: UsersMatriz[index].user,
                level: UsersMatriz[index].level,
                token: UsersMatriz[index].send
            })
        }

        setOpenEdit(false);
        setOpenMatriz(true);

    }

    async function EditUsersMatriz() {
        var sends;
        if (localStorage.getItem('per_docs') === '1') {
            sends = await api.get('getallsends');
        } else {
            sends = await api.post('getsends', {
                id: localStorage.getItem('id')
            });
        }
        


        setOpenMatriz(false);
       
        for (let i = 0; i < sends.data.length; i++) {
            for (let index = 0; index < UsersMatriz.length; index++) {
                if (UsersMatriz[index].user != OldUsersMatriz[index].user) {
                    try {
                        await api.post('changeapprover', {
                            old: OldUsersMatriz[index].user,
                            new: UsersMatriz[index].user,
                            send: sends.data[i].token,
                        });
                    } catch (error) {
                        console.log("erro ao editar a matriz")
                    }
                   
                }else{
                    console.log("tem algo de estranho")
                }
            }
        };

        setTimeout(function () {
            setDialogText(i18n.t('messagesText.matriz_update_all'));
            setOpen(true);
        }, 1000);

    }

    function OpenRejectModal(e) {
        e.preventDefault();

        if(ClickDoc < DocCount){
            setDialogText('Necessário visualizar os documentos enviados para efetuar a rejeição');
            setOpen(true);
        }else{
            setOpenReject(true)
        }
       
    }

    const sendAgain = (e) =>{
            e.preventDefault();
            history.push({
                pathname: '/senddocuments',
                state: { name: localStorage.getItem('Username'), users: Users, sendData: location.state.send }
            });
        
    }

    return (
        <div>
         
            <Menu />
            <Grid container justify="center">
                <Grid xs={10} className={classes.root}>
                    
                    <Typography className={classes.typography}>{Send}</Typography>
                    <Typography className={classes.typography2}>{i18n.t('tables.title')} : {location.state.title}</Typography>
                    <Typography className={classes.typography3}>{i18n.t('tables.description')} : {location.state.description}</Typography>
                    <Typography className={classes.title}>{i18n.t('messagesText.historic')}</Typography>
                  
                    <MaterialTable
                        style={{ marginBottom: 5, minWidth: 900 }}
                        localization={{
                            body: {
                                deleteTooltip: i18n.t('toolstips.delete'),
                                editTooltip: i18n.t('toolstips.edit'),
                                filterRow: {
                                    filterTooltip: 'Filtro'
                                },
                                addTooltip: i18n.t('toolstips.add'),
                                emptyDataSourceMessage: i18n.t('messagesText.register_users_matriz'),
                                editRow: {
                                    deleteText: i18n.t('toolstips.confirm_delete'),
                                    cancelTooltip: i18n.t('toolstips.cancel'),
                                    saveTooltip: i18n.t('toolstips.save'),
                                }
                            },
                            toolbar: {
                                searchTooltip: 'Pesquisar',
                                searchPlaceholder: 'Pesquisar',
                                exportTitle: 'Exportar',
                            },
                            pagination: {
                                labelRowsSelect: i18n.t("pagination.line"),
                                labelDisplayedRows: '{count} de {from}-{to}',
                                firstTooltip: i18n.t("pagination.first_page"),
                                previousTooltip: i18n.t("pagination.back_page"),
                                nextTooltip: i18n.t("pagination.next_page"),
                                lastTooltip: i18n.t("pagination.last_page")
                            },
                            header: {
                                actions: 'Ações'
                            }
                        }}
                        title=""
                        columns={stateHistory.columns}
                        data={stateHistory.data}
                        options={{
                            exportButton: location.state.status == 0 ? true : false
                        }}
                    />
                    <Grid xs={8} className={classes.root2}>
                        <Typography className={classes.title}>Documentos</Typography>
                        <Paper style={{ marginBottom: 5, minWidth: 900 }}>
                            {
                                DocList.map((item, i) => (
                                    
                                    <Chip label={item.name} key={i} color="primary" component="a" target="_blank" href={item.url} style={{ margin: 10 }} onClick={(e) => setClickDoc(ClickDoc + 1)} clickable />
                                ))
                            }
                        </Paper>
                    </Grid>
                </Grid>
                <Grid xs={10} className={classes.root2}>
                    <Typography className={classes.title}>Matriz de aprovação</Typography>
                    <MaterialTable
                        style={{ marginBottom: 5, minWidth: 900 }}
                        localization={{
                            body: {
                                deleteTooltip: i18n.t("toolstips.delete"),
                                editTooltip: i18n.t("toolstips.edit"),
                                filterRow: {
                                    filterTooltip: 'Filtro'
                                },
                                addTooltip: i18n.t("toolstips.add"),
                                emptyDataSourceMessage: i18n.t("messagesText.register_users_matriz"),
                                editRow: {
                                    deleteText: i18n.t("messagesText.confirm_delete"),
                                    cancelTooltip: i18n.t("toolstips.cancel"),
                                    saveTooltip: i18n.t("toolstips.save"),
                                }
                            },
                            toolbar: {
                                searchTooltip: 'Pesquisar',
                                searchPlaceholder: 'Pesquisar',
                                exportTitle: 'Exportar',
                            },
                            pagination: {
                                labelRowsSelect: i18n.t("pagination.line"),
                                labelDisplayedRows: '{count} de {from}-{to}',
                                firstTooltip: i18n.t("pagination.first_page"),
                                previousTooltip: i18n.t("pagination.back_page"),
                                nextTooltip: i18n.t("pagination.next_page"),
                                lastTooltip: i18n.t("pagination.last_page")
                            },
                            header: {
                                actions: 'Ações'
                            }
                        }}
                        title=""
                        columns={state.columns}
                        data={state.data}
                        options={{
                            exportButton: location.state.status == 0 ? true : false
                        }}
                    />
                </Grid>

                <Grid xs={10}
                    container
                    direction="row"
                    justify="center"
                    alignItems="center">
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        disabled={buttonEditApproves}
                        className={classes.button}
                        onClick={(e) => EditModal(e)}
                        startIcon={<PlaylistAddCheckIcon />}
                    >
                        {i18n.t('titles.edit_aprovers')}
                    </Button> 
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        disabled={buttonResend}
                        className={classes.button}
                        onClick={(e) => sendAgain(e)}
                        startIcon={<PlaylistAddCheckIcon />}
                    >
                        Reenviar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        disabled={buttonCancelSend}
                        className={classes.button}
                        onClick={(e) => cancelSend(e)}
                        startIcon={<CancelScheduleSendIcon />}
                    >
                        {i18n.t('titles.cancel_send')}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        disabled={buttonsApprove}
                        className={classes.button}
                        onClick={(e) => OpenRejectModal(e)}
                        startIcon={<BlockIcon />}
                    >
                        {i18n.t('titles.reject')}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        disabled={buttonsApprove}
                        className={classes.button}
                        onClick={(e) => ApproveSend(e)}
                        startIcon={<CheckIcon />}
                    >
                        {i18n.t('titles.aprov')}
                    </Button>
                </Grid>
            </Grid>

            <Dialog open={openAwait} aria-labelledby="form-dialog-title">
                <DialogTitle>
                    <CircularProgress />
                </DialogTitle>
            </Dialog>

            <Dialog onClose={handleCloseEdit} aria-labelledby="simple-dialog-title" open={openEdit} fullWidth={true} maxWidth='md'>
                <DialogTitle style={{ marginTop: 20 }}>
                    <Typography variant="subtitle1" component="h2">{i18n.t('titles.users_aprovers')}</Typography>
                </DialogTitle>

                <DialogContent>
                    <MaterialTable
                        localization={{
                            body: {
                                deleteTooltip: i18n.t('toolstips.delete'),
                                editTooltip: i18n.t('toolstips.edit'),
                                filterRow: {
                                    filterTooltip: 'Filtro'
                                },
                                addTooltip: i18n.t('toolstips.add'),
                                emptyDataSourceMessage: i18n.t('messagesText.register_users_matriz'),
                                editRow: {
                                    deleteText: i18n.t('messagesText.confirm_delete'),
                                    cancelTooltip: i18n.t('toolstips.cancel'),
                                    saveTooltip: i18n.t('toolstips.save'),
                                }
                            },
                            toolbar: {
                                searchTooltip: 'Pesquisar',
                                searchPlaceholder: 'Pesquisar'
                            },
                            pagination: {
                                labelRowsSelect: i18n.t("pagination.line"),
                                labelDisplayedRows: '{count} de {from}-{to}',
                                firstTooltip: i18n.t("pagination.first_page"),
                                previousTooltip: i18n.t("pagination.back_page"),
                                nextTooltip: i18n.t("pagination.next_page"),
                                lastTooltip: i18n.t("pagination.last_page")
                            },
                            header: {
                                actions: 'Ações'
                            }
                        }}
                        title=""
                        columns={stateUsers.columns}
                        data={stateUsers.data}
                    />
                </DialogContent>
                <DialogActions style={{ marginBottom: 20, marginRight: 15, marginTop: 10 }}>
                    <Button onClick={handleCloseEdit} color="primary">
                        {i18n.t('buttons.cancel')}
                    </Button>
                    <Button onClick={e => EditApprove(e)} variant="contained" color="primary">
                        {i18n.t('buttons.confirm')}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openMatriz} aria-labelledby="form-dialog-title">
                <DialogTitle>
                    <Typography variant="subtitle1" component="h2">{i18n.t("titles.changes_all")}</Typography>
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseMatriz} color="primary">
                        {i18n.t('buttons.no')}
                    </Button>
                    <Button onClick={EditUsersMatriz} variant="contained" color="primary">
                        {i18n.t('buttons.yes')}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openReject} aria-labelledby="form-dialog-title">

                <form onSubmit={RejectSend}>
                    <DialogTitle>
                        <Typography variant="subtitle1" component="h2"> {i18n.t('tables.reason')}</Typography>
                    </DialogTitle>
                    <DialogContent style={{ margin: 20 }}>
                        <Select
                            style={{ marginBottom: 20 }}
                            labelId="Recusa"
                            id="Recusa"
                            value={Refusal}
                            onChange={e => setRefusal(e.target.value)}
                            fullWidth
                            required
                        >
                            {
                                RefusalsList.map((item, i) => (
                                    <MenuItem key={i} value={item.id}>{item.name}</MenuItem>
                                ))
                            }
                        </Select>
                        <TextField
                            className={classes.margins}
                            id="description"
                            label={i18n.t('labels.description')}
                            multiline
                            fullWidth
                            required
                            value={descricao}
                            onChange={e => setDescricao(e.target.value)}
                            size="small"
                        />
                    </DialogContent>
                    <DialogActions style={{ margin: 20 }}>
                        <Button onClick={handleCloseReject} color="primary">
                            {i18n.t('buttons.cancel')}
                        </Button>
                        <Button type="submit" variant="contained" color="primary">
                            {i18n.t('buttons.confirm')}
                        </Button>
                    </DialogActions>
                </form>

            </Dialog>

            <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
                <List>
                    <ListItemText style={{ margin: 30 }} primary={DialogText} />
                </List>
            </Dialog>

        </div>

    );

}