import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { DropzoneArea } from 'material-ui-dropzone';
import { useHistory } from 'react-router-dom';
import MaterialTable from 'material-table';
import Menu from '../Menu';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Stepper from '@material-ui/core/Stepper';
import TextField from '@material-ui/core/TextField';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import { Tooltip } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

import api from '../../services/api';

//tradução
import i18n from "../../translate/i18n"

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(20),
        width: '70%',
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button2: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
    previewChip: {
        minWidth: 160,
        maxWidth: 210
    },
    cardHeader: {
        padding: theme.spacing(1, 2),
    },
    list: {
        width: 200,
        height: 230,
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
    },
    marginTop: {
        marginTop: theme.spacing(2),
    },
    marginBottom: {
        marginBottom: theme.spacing(2),
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(2),
        marginTop: theme.spacing(2),
        [theme.breakpoints.up(700 + theme.spacing(2) * 2)]: {
            width: 700,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper2: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
    },
    stepper: {
        padding: theme.spacing(3, 0, 5),
    },
}));

export default function SendDocuments() {

    //#region Variáveis
    const classes = useStyles();
    const location = useLocation();
    const history = useHistory();
    const [token] = useState(uuidv4());
    const [open, setOpen] = React.useState(false);
    const [openAwait, setopenAwait] = React.useState(false);
    const [openMatriz, setOpenMatriz] = React.useState(false);
    const [descricao, setDescricao] = useState('');
    const [title, setTitle] = useState('');
    const [ApprovesList, setApprovesList] = useState([]);
    const [DialogText, setDialogText] = useState("Tela em desenvolvimento!");
    const [checkedUnion, setCheckedUnion] = React.useState(false);
    const [name, setName] = useState('');
    const [typeDocument, setTypeDocument] = useState(1);
    const [typeDocumentList, setTypeDocumentList] = useState([]);
    const [active, setActive] = useState(1);

    const [disableButton, setDisableButton] = useState(false);
    const [disableButtonNext, setDisableButtonNext] = useState(false);

    const [dataMatriz] = useState([]);
    const [dataUsers] = useState([]);
    const [dataLevels, setDataLevels] = useState([]);

    const [matriz, setMatriz] = useState('');
    const [newMatriz, setNewMatriz] = useState({});
    const [editOldMatriz, setEditOldMatriz] = useState(false);
    const [newMatrizId, setNewMatrizId] = useState();
    const [editMatriz, setEditMatriz] = useState({ marginTop: 10, display: "none" });
    const [addMatriz, setAddMatriz] = useState({ display: "none" });
    const [addUserMatriz, setAddUserMatriz] = useState({ display: "none" });
    const [addLevelsMatriz, setAddLevelsMatriz] = useState({ display: "none" });
    const [UsersMatriz, setUsersMatriz] = useState();
    const [Users, setUsers] = useState([]);
    const [Levels, setLevels] = useState();
    const [Level, setLevel] = useState();

    const [AllFiles, setAllFiles] = useState([]);

    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();

    const stepsAdd = [i18n.t("titles.information"), i18n.t("titles.users"), i18n.t("titles.level_aprovation")];

    var UsersList = location.state.users.reduce(function (acc, cur, i) {
        acc[cur.id] = cur.name;
        return acc;
    }, {});

    const [stateMatriz, setStateMatriz] = React.useState({
        columns: [
            { title: i18n.t("tables.code"), field: 'id', hidden: true },
            { title: i18n.t("tables.name"), field: 'user', lookup: UsersList },
            { title: i18n.t("tables.level"), field: 'level', defaultSort: 'asc', lookup: { 0: i18n.t("tables.in_copy"), 1: i18n.t("tables.level") + ' 1', 2: i18n.t("tables.level") + ' 2', 3: i18n.t("tables.level") + ' 3', 4: i18n.t("tables.level") + ' 4', 5: i18n.t("tables.level") + ' 5', 6: i18n.t("tables.level") + ' 6', 7: i18n.t("tables.level") + ' 7', 8: i18n.t("tables.level") + ' 8', 9: i18n.t("tables.level") + ' 9', 10: i18n.t("tables.level") + ' 10' } },
            //{ title: 'SLA (Horas)', field: 'sla', type: 'numeric', validate: rowData => rowData.sla > 9999 ? { isValid: false, helperText: 'SLA muito grande' } : true, },
            { title: i18n.t("tables.matriz"), field: 'approve', hidden: true },
            { title: 'Email', field: 'email', hidden: true },
        ],
        data: dataMatriz,
    });

    const [stateUsers, setStateUsers] = React.useState({
        columns: [
            // { title: i18n.t("tables.code"), field: 'id', hidden: true },
            { title: i18n.t("tables.name"), field: 'id', lookup: UsersList, editable: 'never' },
            { title: i18n.t('tables.email'), field: 'email', editable: 'never' },
            { title: i18n.t("tables.level"), field: 'level', defaultSort: 'asc', lookup: { 99: i18n.t("tables.select_standart"), 0: i18n.t("tables.level"), 1: i18n.t("tables.level") + '1', 2: i18n.t("tables.level") + '2', 3: i18n.t("tables.level") + '3', 4: i18n.t("tables.level") + '4', 5: i18n.t("tables.level") + '5', 6: i18n.t("tables.level") + '6', 7: i18n.t("tables.level") + '7', 8: i18n.t("tables.level") + '8', 9: i18n.t("tables.level") + '9', 10: i18n.t("tables.level") + '10' } },
            { title: i18n.t("tables.matriz"), field: 'approve', hidden: true },
        ],
        data: dataUsers,
    });

    const [stateLevels, setStateLevels] = React.useState({
        columns: [
            { title: i18n.t("tables.code"), field: 'id', hidden: true },
            { title: i18n.t("tables.level"), field: 'level', lookup: location.state.levels },
            { title: 'SLA (Horas)', field: 'sla', type: 'numeric', validate: rowData => rowData.sla > 9999 ? { isValid: false, helperText: 'SLA muito grande' } : true, },
        ],
        data: dataLevels,
    });
    //#endregion

    useEffect(() => {

        getApproves();
        getTypeDocs();
        reloadData();
    }, []);

    //#region Handles
    const handleClose = (value) => {
        setOpen(false);
        if (DialogText === i18n.t("messagesText.document_send_success")) {
            history.push({
                pathname: '/dashboard',
                state: { name: localStorage.getItem('Username') }
            });
        }
    };

    const handleCloseMatriz = (value) => {
        setOpenMatriz(false);
        setDialogText(i18n.t("messagesText.document_send_success"));
        setOpen(true);
    };

    const handleChange = (event) => {
        setCheckedUnion(event.target.checked);
    };

    const getApproverMatriz = async (m) =>{
        const resp = await api.post("approveusers", {
            id: matriz
        })

        return resp;

    }
    const handleNext = async () => {
        if (activeStep === 2) {
            saveSend();
        } else {
            //verifica se há aprovadores na matriz
            const resp = await getApproverMatriz(matriz);
           
            if (activeStep === 0 && matriz === undefined || matriz === "") {
                setDialogText(i18n.t("messagesText.select_matriz"));
                setOpen(true);
            } else if (activeStep === 1 && AllFiles.length < 1) {

                setDialogText(i18n.t("messagesText.one_document"));
                setOpen(true);
            }else if (!resp.data[0]){
                setDialogText(i18n.t("messagesText.select_matriz_approvers"));
                setOpen(true);
            } else if (activeStep === 1) {
                setTitle(AllFiles);
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    function ChangeMatriz(value) {
        //e.preventDefault();
        setMatriz(value);
        if (value === 0) {
            setNewMatriz({ display: "none" });
            setEditMatriz({ marginTop: 10, display: "none" });
            setAddMatriz({});

            getAllSla(value)
            getAllUsers(value);
            setDisableButtonNext(true);

            //caso de problema no registro da matriz  retire
            setName("");
            setTypeDocument("");
            setEditOldMatriz(false);
            setAddUserMatriz({ display: "none" })
        } else {
            setNewMatriz({});
            setEditMatriz({ marginTop: 10, });
            setAddUserMatriz({ display: "none" })
            setAddMatriz({ display: "none" });
            getAllSla(value)
            getUsers(value);
            setDisableButtonNext(false);
        }
    }
    //#endregion

    //#region Consultas
    async function getApproves() {
        const response = await api.get('approvesactives');
        setApprovesList(response.data);
      
        if (newMatrizId !== undefined) {
            ChangeMatriz(newMatrizId);
        }
    }


    async function getApprove() {
        const response = await api.post('approve', {
            id: matriz
        });
        const Res = [response.data];
        setName(Res[0][0].name);
        setTypeDocument(Res[0][0].typedoc);
        setActive(Res[0][0].status);
    }

    async function getTypeDocs() {
        const response = await api.get('docsactives');
        setTypeDocumentList(response.data);
    }

    async function getUsers(matriz) {
        const response = await api.post('approveallusers', {
            id: matriz
        });
       
        setStateMatriz({
            columns: [
                { title: i18n.t("tables.code"), field: 'id', hidden: true },
                { title: i18n.t("tables.name"), field: 'user', lookup: UsersList },
                { title: i18n.t("tables.level"), field: 'level', defaultSort: 'asc', lookup: { 0: i18n.t("tables.in_copy"), 1: i18n.t("tables.level") + ' 1', 2: i18n.t("tables.level") + ' 2', 3: i18n.t("tables.level") + ' 3', 4: i18n.t("tables.level") + ' 4', 5: i18n.t("tables.level") + ' 5', 6: i18n.t("tables.level") + ' 6', 7: i18n.t("tables.level") + ' 7', 8: i18n.t("tables.level") + ' 8', 9: i18n.t("tables.level") + ' 9', 10: i18n.t("tables.level") + ' 10' } },
                //{ title: 'SLA (Horas)', field: 'sla', type: 'numeric', validate: rowData => rowData.sla > 9999 ? { isValid: false, helperText: 'SLA muito grande' } : true, },
                { title: i18n.t("tables.matriz"), field: 'approve', hidden: true },
                { title: 'Email', field: 'email', hidden: true },
            ],
            data: response.data,
        });
        setUsersMatriz(response.data);
    };

    async function getAllUsers(value) {
     
        const res = await api.post('approveusers', {
            id: value  
        }); 

        // caso comece a dar problema no cadastro de matriz ou no envio trocar por esse abaixo 
        //  const res = await api.post('approveusers', {
        //     id: matriz  
        // });
        const response = await api.get('usersactives');

        var level = 0;

        if (res.data.length > 0) {
            for (let index = 0; index < res.data.length; index++) {

                if (res.data[index].level > level) {
                    level = res.data[index].level;
                }

                for (let i = 0; i < response.data.length; i++) {
                    if (res.data[index].id == response.data[i].id) {
                        response.data[i].level = res.data[index].level
                    }
                }
            }
            setLevel((level));
        }
        
        setStateUsers({
            columns: [
                // { title: i18n.t("tables.code"), field: 'id', hidden: true },
                { title: i18n.t("tables.name"), field: 'id', lookup: UsersList, editable: 'never' },
                { title: i18n.t('tables.email'), field: 'email', editable: 'never' },
                { title: i18n.t("tables.level"), field: 'level', defaultSort: 'asc', lookup: { 99: i18n.t("tables.select_standart"), 0: i18n.t("tables.in_copy"), 1: i18n.t("tables.level") + ' 1', 2: i18n.t("tables.level") + ' 2', 3: i18n.t("tables.level") + ' 3', 4: i18n.t("tables.level") + ' 4', 5: i18n.t("tables.level") + ' 5', 6: i18n.t("tables.level") + ' 6', 7: i18n.t("tables.level") + ' 7', 8: i18n.t("tables.level") + ' 8', 9: i18n.t("tables.level") + ' 9', 10: i18n.t("tables.level") + ' 10' } },
                { title: i18n.t("tables.matriz"), field: 'approve', hidden: true },
            ],
            data: response.data,
        });
    };

    async function getAllSla(matriz) {
        const res = await api.post('/approveusers', {
            id: matriz
        });
        if (res.data[0]) {
            const resp = await api.post('getlevels', {
                id: res.data[0].approve
            });
            setLevels(resp.data)
            setDataLevels(resp.data)
        }

    };

    function getSteps() {
        return [i18n.t("tables.matriz_aprovation"), i18n.t("tables.send_document"), i18n.t("tables.finish")];
    }
    //#endregion

    //#region Upload    
    function DeleteFile(fileName) {
        DeleteUpload(fileName);
        return fileName + " removido! "
    }

    async function CopyUploads(files, Oldtoken) {
        const data = [];

        for (let index = 0; index < files.length; index++) {
            if (files[index].name != "Arquivos_Unidos.pdf") {
                if (files[index].name != "Versao_Final.pdf") {

                    const rep = await api.post("duplicateupload", {
                        name: files[index].name,
                        oldToken: Oldtoken,
                        newToken: token
                    })
                    data.push(files[index].name);
                }

            }
        }
        setAllFiles(data);
    }

    const reloadData = async () => {
        if (location.state.sendData !== undefined) {
            let r = await api.post("getOneSend", {
                id: location.state.sendData
            })
            let res = await api.post("sendgetdocs", {
                send: r.data[0].id
            })
            if (r.data) {
                ChangeMatriz(r.data[0].approve);
                CopyUploads(res.data, r.data[0].token);
            }
        }
    }
    async function UploadFile(files) {

        const data = [];

        setopenAwait(true);

        for (let index = 0; index < files.length; index++) {
            const formData = new FormData();
            formData.append('file', files[index]);
            const response = await api.post('upload', formData, {
                headers: {
                    token: token
                }
            });
            data.push(response.data.name);

            setAllFiles(data);

        }

        setopenAwait(false);
    }

    async function DeleteUpload(fileName) {

        try {
            await api.post('delete', {
                file: fileName,
                token: token
            });
            const data = [...AllFiles];
            data.splice(data.indexOf(fileName), 1);

            setAllFiles(data);
        } catch (error) {
            console.log("deu erro no delete : ", error)
        }



    }
    //#endregion

    //#region Chamadas dos modais
    async function GoToEditMatriz() {
        getApprove();
        getAllUsers(matriz);
        getAllSla(matriz);
        setNewMatriz({ display: "none" });
        setEditMatriz({ marginTop: 10, display: "none" });
        setAddMatriz({});
        setDisableButtonNext(true);
        setEditOldMatriz(true);
    }

    async function ModalDeleteMatriz() {

        await api.post('deleteapprove', {
            id: matriz
        });

        await api.post('deleteapprovelevels', {
            id: matriz
        });

        await api.post('deleteapproveusers', {
            id: matriz
        });

        setOpenMatriz(false);

        setTimeout(function () {
            setDialogText(i18n.t("messagesText.document_send_success"));
            setOpen(true);
        }, 1000);

    };
    //#endregion

    //#region Salva envio
    async function saveSend() {

        setopenAwait(true);

        const id = localStorage.getItem('id');
        let arr1 = [];
        let arr2 = [];
        const response = await api.post('sendadd', {
            title: title,
            description: descricao,
            approve: matriz,
            token: token,
            user: id
        });
        if (checkedUnion === false) {
            if (AllFiles != undefined) {
                for (let index = 0; index < AllFiles.length; index++) {
                    await api.post('sendfilesadd', {
                        name: AllFiles[index],
                        send: response.data,
                        token: token
                    });
                }
            }

        } else {

            if (AllFiles != undefined) {

                for (let index = 0; index < AllFiles.length; index++) {
                    await api.post('sendfilesadd', {
                        name: AllFiles[index],
                        send: response.data,
                        token: token
                    });
                }

                if (AllFiles.length > 1) {
                    //Mescla todos arquivos
                    await api.post('merge', {
                        files: AllFiles,
                        token: token
                    });

                    //Salva no B.D
                    await api.post('sendfilesadd', {
                        name: 'Arquivos_Unidos.pdf',
                        send: response.data,
                        token: token
                    });
                }
            }
        }

        if (UsersMatriz != undefined) {
            const send_user = await api.post('user', {
                id: id,
            })


            for (let index = 0; index < UsersMatriz.length; index++) {

                await api.post('sendapprovers', {
                    user: UsersMatriz[index].user,
                    level: UsersMatriz[index].level,
                    token: token
                });

            }

            let arr1 = [];
            let arr2 = [];

            let a = UsersMatriz.filter((d) => d.level == 1)
            let b = UsersMatriz.filter((d) => d.level == 0)
            a.map((d) => arr1.push(d.email));
            b.map((d) => arr2.push(d.email));
            if (a) {
                let i = await api.post('notifysend', {
                    email: arr1,
                    to: " ",
                    cc: arr2,
                    requester: send_user.data[0].name,
                    title: title,
                    description: descricao,
                    language: i18n.language,
                    id: response.data
                })
                
            }

            //Busca os levels e sla da matriz de aprovação criada temporariamente
            const levels = await api.post('getlevels', {
                id: matriz,
            });

            //Salva os levels
            for (let index = 0; index < levels.data.length; index++) {
                await api.post('sendlevels', {
                    level: levels.data[index].level,
                    sla: levels.data[index].sla,
                    token: token
                });
            }
        }

        if (editOldMatriz === true || newMatrizId !== undefined) {
            setopenAwait(false);
            setOpenMatriz(true);
        } else {
            setopenAwait(false);
            setDialogText(i18n.t("messagesText.document_send_success"));
            setOpen(true);
        }
    }
    //#endregion

    // pega os dados da da dashboard Details


    //Conteúdo
    function getStepContent(step) {
        switch (step) {
            case 0:
                return <div>
                    <Grid container style={{ marginTop: 20, marginBottom: 20 }}>

                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-autowidth-label">{i18n.t("titles.matriz_aprovation")}</InputLabel>
                                <Select
                                    labelId="Matriz"
                                    id="Matriz"
                                    value={matriz}
                                    onChange={e => ChangeMatriz(e.target.value)}
                                    fullWidth
                                    required
                                >
                                    <MenuItem value={0}>Cadastrar nova matriz</MenuItem>
                                    {
                                        ApprovesList.map((item, i) => (
                                            <MenuItem key={i} value={item.id}>{item.name}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3} style={editMatriz}>
                            <Tooltip title="Editar Matriz" aria-label="Editar">
                                <IconButton aria-label="edit" onClick={GoToEditMatriz}>
                                    <EditIcon fontSize="inherit" color="primary" />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <MaterialTable
                        style={newMatriz}
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
                                searchPlaceholder: i18n.t('placeholders.search')
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
                        columns={stateMatriz.columns}
                        data={stateMatriz.data}
                    />

                    <form style={addMatriz} onSubmit={SaveApprove}>
                        <main className={classes.layout}>
                            <Paper className={classes.paper2}>
                                <Stepper activeStep={0} className={classes.stepper}>
                                    {stepsAdd.map((label) => (
                                        <Step key={label}>
                                            <StepLabel>{label}</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="Name"
                                            name="Name"
                                            label="Nome"
                                            value={name}
                                            onBlur={e => FindApprove(e, e.target.value)}
                                            onChange={e => setName(e.target.value)}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={9}>
                                        <FormControl fullWidth>
                                            <InputLabel id="Empresa">{i18n.t("labels.type_document")}</InputLabel>
                                            <Select
                                                labelId="Doc"
                                                id="Doc"
                                                value={typeDocument}
                                                onChange={e => setTypeDocument(e.target.value)}
                                                fullWidth
                                                required
                                            >
                                                {
                                                    typeDocumentList.map((item, i) => (
                                                        <MenuItem key={i} value={item.id}>{item.name}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-autowidth-label">Status</InputLabel>
                                            <Select
                                                labelId="Status"
                                                id="Status"
                                                value={active}
                                                onChange={e => setActive(e.target.value)}
                                                fullWidth
                                                required
                                            >
                                                <MenuItem value={1}>{i18n.t("labels.active")}</MenuItem>
                                                <MenuItem value={0}>{i18n.t("labels.inactive")}</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <div className={classes.buttons}>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        color="primary"
                                        disabled={disableButton}
                                        className={classes.button2}
                                    >
                                        {i18n.t("buttons.next")}
                                    </Button>
                                </div>
                            </Paper>
                        </main>
                    </form>

                    <form style={addUserMatriz} onSubmit={GoUsersCopy}>
                        <main className={classes.layout}>
                            <Paper className={classes.paper2}>
                                <Stepper activeStep={1} className={classes.stepper}>
                                    {stepsAdd.map((label) => (
                                        <Step key={label}>

                                            <StepLabel>{label}</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </Paper>

                            <MaterialTable
                                title=""
                                columns={stateUsers.columns}
                                data={stateUsers.data}
                                cellEditable={{
                                    onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
                                        return new Promise((resolve, reject) => {
                                            if (Level === undefined) {
                                                if (newValue == 1 || newValue == 0) {
                                                    setLevel(parseInt(newValue));
                                                    rowData.level = newValue;
                                                } else {
                                                    setDialogText(i18n.t("messagesText.level_sequence"));
                                                    setOpen(true);
                                                }
                                            } else {
                                                if (newValue > Level + 1 && newValue > 1 && newValue < 99) {
                                                    setDialogText(i18n.t("messagesText.level_sequence"));
                                                    setOpen(true);
                                                } else {
                                                    if (newValue > Level) {
                                                        setLevel(parseInt(newValue));
                                                    }

                                                    rowData.level = newValue;
                                                }
                                            }
                                            setTimeout(resolve, 1000);
                                        });
                                    }
                                }}
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
                                        searchPlaceholder: i18n.t('placeholders.search'),
                                        nRowsSelected: '{0} Usuário(s) selecionado(s)',
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
                                options={{
                                    searchText: ""
                                }}

                            />

                            <div className={classes.buttons}>
                                <Button
                                    className={classes.button2}
                                    onClick={GoBack}
                                >
                                    {i18n.t("buttons.back")}
                                </Button>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    color="primary"
                                    className={classes.button2}
                                >
                                    {i18n.t("buttons.next")}
                                </Button>
                            </div>
                        </main>
                    </form>

                    <form style={addLevelsMatriz} onSubmit={Finish}>
                        <main className={classes.layout}>
                            <Paper className={classes.paper2}>
                                <Stepper activeStep={3} className={classes.stepper}>
                                    {stepsAdd.map((label) => (
                                        <Step key={label}>
                                            <StepLabel>{label}</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </Paper>

                            <MaterialTable
                                localization={{
                                    body: {
                                        deleteTooltip: i18n.t("toolstips.delete"),
                                        editTooltip: i18n.t("toolstips.edit"),
                                        filterRow: {
                                            filterTooltip: 'Filtro'
                                        },
                                        addTooltip: i18n.t("toolstips.add"),
                                        emptyDataSourceMessage: i18n.t("messagesText.never_register"),
                                        editRow: {
                                            deleteText: i18n.t("messagesText.confirm_delete"),
                                            cancelTooltip: i18n.t("toolstips.cancel"),
                                            saveTooltip: i18n.t("toolstips.save"),
                                        }
                                    },
                                    toolbar: {
                                        searchTooltip: 'Pesquisar',
                                        searchPlaceholder: i18n.t('placeholders.search')
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
                                columns={stateLevels.columns}
                                data={stateLevels.data}
                                editable={{
                                    onRowAdd: (newData) =>

                                        new Promise((resolve) => {

                                            setTimeout(() => {
                                                resolve();
                                                setStateLevels((prevState) => {

                                                    const data = [...prevState.data];
                                                    if (newData.level == "" || newData.level == undefined) {
                                                        setDialogText(i18n.t("messagesText.levels_required"));
                                                        setOpen(true);
                                                    } else {


                                                        if (Levels !== undefined) {
                                                            //tava vindo string por isso tive que converter pra int
                                                            var response = FindLevels(newData, data, 'Add');

                                                            if (response == 1) {
                                                                setDialogText(i18n.t("messagesText.level_already_registred"));
                                                                setOpen(true);
                                                            } else {
                                                                if (newData.sla === parseInt(newData.sla)) {
                                                                   
                                                                    data.push(newData);
                                                                    setLevels(data);
                                                                } else {
                                                                    setDialogText(i18n.t("messagesText.sla_not_int"));
                                                                    setOpen(true);
                                                                }
                                                            }
                                                        } else {
                                                            if (newData.sla === parseInt(newData.sla)) {

                                                                data.push(newData);
                                                                setLevels(data);
                                                            } else {
                                                                setDialogText(i18n.t("messagesText.sla_not_int"));
                                                                setOpen(true);
                                                            }
                                                        }
                                                    }
                                                    return { ...prevState, data };
                                                });
                                            }, 600);
                                        }),
                                    onRowUpdate: (newData, oldData) =>
                                        new Promise((resolve) => {
                                            setTimeout(() => {
                                                resolve();
                                                if (oldData) {

                                                    setStateLevels((prevState) => {

                                                        const data = [...prevState.data];
                                                        if (Levels !== undefined) {

                                                            var response = FindLevels(newData, oldData, 'Edit');

                                                            if (response == 1) {
                                                                setDialogText(i18n.t("messagesText.level_already_registred"));
                                                                setOpen(true);
                                                            } else {
                                                                data[data.indexOf(oldData)] = newData;
                                                                setLevels(data);
                                                            }
                                                        } else {
                                                            data[data.indexOf(oldData)] = newData;
                                                            setLevels(data);
                                                        }

                                                        return { ...prevState, data };
                                                    });
                                                }
                                            }, 600);
                                        }),
                                    onRowDelete: (oldData) =>
                                        new Promise((resolve) => {
                                            setTimeout(() => {
                                                resolve();
                                                setStateLevels((prevState) => {
                                                    const data = [...prevState.data];
                                                    data.splice(data.indexOf(oldData), 1);
                                                    setLevels(data);

                                                    return { ...prevState, data };
                                                });
                                            }, 600);
                                        }),
                                }}
                            />

                            <div className={classes.buttons}>
                                <Button
                                    className={classes.button2}
                                    onClick={GoBackUsersCopy}
                                >
                                    {i18n.t("buttons.back")}
                                </Button>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    color="primary"
                                    className={classes.button2}
                                >
                                    {i18n.t("buttons.save")}
                                </Button>
                            </div>
                        </main>
                    </form>

                </div>;
            case 1:

                return <div>
                    <DropzoneArea
                        acceptedFiles={['.pdf']}
                        showPreviews={true}
                        showPreviewsInDropzone={false}
                        //adicionei isso para fazer carregar as coisas quando ir e voltar 
                        initialFiles={AllFiles}
                        useChipsForPreview
                        maxFileSize={20000000}
                        filesLimit={20}
                        showAlerts={['error']}
                        previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
                        previewChipProps={{ classes: { root: classes.previewChip } }}
                        previewText={i18n.t("messagesText.loaded_files")}
                        dropzoneText={i18n.t("messagesText.dropzone")}
                        onChange={(files) => UploadFile(files)}
                        getFileAddedMessage={(fileName) => fileName + i18n.t("messagesText.add_success")}
                        getFileLimitExceedMessage={(filesLimit) => i18n.t("messagesText.files_limit_number") + filesLimit + i18n.t("messagesText.files_limit")}
                        getFileRemovedMessage={(fileName) => DeleteFile(fileName)}
                        getDropRejectMessage={(rejectedFile) => i18n.t("messagesText.file") + rejectedFile.name + i18n.t("messagesText.reject_file")}
                    />
                </div>;
            case 2:
                return <div>
                    <TextField
                        className={classes.marginTop}
                        id="title"
                        label="Título"
                        fullWidth

                        variant="outlined"
                        value={title.toString().substring(0,150)}
                        onChange={e => setTitle(e.target.value)}
                        size="small"
                    />
                    <TextField
                        className={classes.marginTop}
                        id="description"
                        label={i18n.t("labels.description")}
                        multiline
                        fullWidth
                        variant="outlined"
                        value={descricao}
                        onChange={e => setDescricao(e.target.value)}
                        size="small"
                    />

                    <FormControlLabel

                        control={
                            <Checkbox
                                disabled={AllFiles.length > 1 ? false : true}
                                checked={checkedUnion}
                                onChange={handleChange}
                                name="Union"
                                color="primary"
                            />
                        }
                        label="Unir arquivos"
                    />
                    <Typography>{i18n.t("messagesText.warning_document_one")}</Typography>
                    <Typography>{i18n.t("messagesText.warning_document_two")}</Typography>
                    <Typography className={classes.marginBottom}>{i18n.t("messagesText.warning_document_three")}</Typography>
                </div>
            default:
                return 'Unknown step';
        }
    }

    //#region Matriz de aprovadores (Infos)
    async function SaveApprove(e) {
        e.preventDefault();

        if (editOldMatriz === true) {
            try {
                await api.post('editapprove', {
                    id: matriz,
                    name: name.trim(),
                    typeDoc: typeDocument,
                    active: active,
                });
                GoUsers();
            } catch (err) {
                setDialogText(i18n.t("errors.error_edit"));
                setOpen(true);
            }
        } else if (newMatrizId !== undefined) {
            try {
                await api.post('editapprove', {
                    id: newMatrizId,
                    name: name.trim(),
                    typeDoc: typeDocument,
                    active: active,
                });
                GoUsers();
            } catch (err) {
                setDialogText(i18n.t("errors.error_edit"));
                setOpen(true);
            }
        } else {
            // Verifico se existe aprovadores na matriz se não existe eu removo ela do bd

            const response = await api.post('findapprove', {
                name: name.trim()
            });




            if (response.data === true) {
                const resp = await api.post("approveId", {
                    id: name.trim()
                })
                if (!resp.data[0]) {
                    const rep = await api.post('deleteapprove', {
                        id: resp.data[0].id
                    })
                }
                setName('');
                setDialogText(i18n.t("errors.exist_matriz"));
                setOpen(true);
                setDisableButton(true);
            } else {
                try {

                    let i = await api.post('addapprove', {
                        name: name.trim(),
                        typeDoc: typeDocument,
                        active: active,
                    });


                    // const r = await api.get('approvesactives');
                    // let m = r.data.find((e) => e.name === name);


                    GoUsers();
                } catch (err) {
                    setDialogText(i18n.t("errors.error_save"));
                    setOpen(true);
                }
            }
        }
    }

    async function FindApprove(e, value) {
        e.preventDefault();
        //Verifico se existe aprovadores na matriz se não existe eu removo ela do bd
        let m = ApprovesList.find((e) => e.name.trim() == value.trim());

        if (m !== undefined) {
            const resp = await api.post("approveusers", {
                id: m.id
            })


            if (!resp.data[0]) {
                const rep = await api.post('deleteapprove', {
                    id: m.id
                })
            }
        }
        const response = await api.post('findapprove', {
            name: value.trim()
        });


        if (response.data === true) {

            setName('');
            setDialogText(i18n.t("errors.exist_matriz"));
            setOpen(true);
            setDisableButton(true);
        } else {
            setDisableButton(false);
        }
    };

    async function GoUsers() {
        
        const response = await api.post('approveId', { name: name });

        setAddMatriz({ display: "none" });
        setAddUserMatriz({});
        getUsers(response.data[0].id);
        setNewMatrizId(response.data[0].id);
        setMatriz(response.data[0].id);

    }
    //#endregion

    //#region Matriz de aprovadores (Users)

    function GoBack(e) {
        e.preventDefault();

        setAddMatriz({});
        setAddUserMatriz({ display: "none" });
    }

    async function GoUsersCopy(e) {
        e.preventDefault();

        const data = Users;
        data.splice(data, data.length);

        for (let index = 0; index < stateUsers.data.length; index++) {
            if (stateUsers.data[index].level !== 99 && stateUsers.data[index].level !== "99") {
                data.push(stateUsers.data[index]);
                setUsers(data);
            }
        }

        if (Users.length === 0) {
            setDialogText(i18n.t("messagesText.least_user"));
            setOpen(true);
        } else {

            var Levels = [];

            for (let x = 0; x < Users.length; x++) {
                if (Users[x].level > 0) {
                    Levels.push({ id: Users[x].level, name: i18n.t("titles.level") + " " + Users[x].level });
                }
            }

            var obj = {};

            for (var i = 0, len = Levels.length; i < len; i++)
                obj[Levels[i]['name']] = Levels[i];

            Levels = [];

            for (var key in obj)
                Levels.push(obj[key]);

            await api.post('deleteapproveusers', {
                id: newMatrizId
            });

            for (let index = 0; index < Users.length; index++) {
                try {
                    await api.post('addapproveusers', {
                        id: Users[index].id,
                        level: Users[index].level,
                        approve: newMatrizId
                    });
                } catch (err) {
                    setDialogText(i18n.t("errors.error_save"));
                    setOpen(true);
                }
            }

            var levels = Levels.reduce(function (acc, cur, i) {
                acc[cur.id] = cur.name;
                return acc;
            }, {});


            setStateLevels({
                columns: [
                    { title: i18n.t("tables.code"), field: 'id', hidden: true },
                    { title: i18n.t("tables.level"), field: 'level', lookup: levels },
                    { title: 'SLA (Horas)', field: 'sla', type: 'numeric', validate: rowData => rowData.sla > 9999 ? { isValid: false, helperText: 'SLA muito grande' } : true, },
                ],
                data: dataLevels,
            });

            //Mostra levels
            setAddUserMatriz({ display: "none" });
            setAddLevelsMatriz({});

        }
    }
    //#endregion

    //#region Matriz de aprovadores (Levels)

    function FindLevels(row, oldRow, type) {

        if (type === 'Add') {
            for (let index = 0; index < oldRow.length; index++) {
                var level = oldRow[index].level;
                if (level == oldRow.level) {
                    return 1;
                }
            }
        } else {

            if (row.level == oldRow.level) {
                return 0;
            }

            for (let index = 0; index < Levels.length; index++) {
                var level = Levels[index].level;
                if (level == row.level) {
                    return 1;
                }
            }
            return 0;
        }
    }

    async function Finish(e) {
        e.preventDefault();
        if (Levels !== undefined) {

            await api.post('deleteapprovelevels', {
                id: newMatrizId
            });

            for (let index = 0; index < Levels.length; index++) {
                try {
                    await api.post('addapprovelevels', {
                        level: Levels[index].level,
                        sla: Levels[index].sla,
                        approve: newMatrizId
                    });
                } catch (err) {
                    setDialogText(i18n.t("errors.error_save"));
                    setOpen(true);
                }
            }
            setAddLevelsMatriz({ display: "none" });
            getApproves();
            setDisableButtonNext(false);

        } else {
            setAddLevelsMatriz({ display: "none" });
            getApproves();
            setDisableButtonNext(false);
        }
    }

    function GoBackUsersCopy(e) {
        e.preventDefault();
        setAddUserMatriz({});
        setAddLevelsMatriz({ display: "none" });
    }
    //#endregion

    return (
        <div>
            <Menu />
            <Container component="main" className={classes.paper}>
                <Card className={classes.root} style={{ padding: 15, marginBottom: 18 }}>
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                                <StepContent>
                                    <Typography>{getStepContent(index)}</Typography>
                                    <div className={classes.actionsContainer}>
                                        <div>
                                            <Button
                                                disabled={activeStep === 0}
                                                onClick={handleBack}
                                                className={classes.button}
                                            >
                                                {i18n.t("buttons.back")}
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleNext}
                                                disabled={disableButtonNext}
                                                className={classes.button}
                                            >
                                                {activeStep === steps.length - 1 ? 'Enviar' : i18n.t("buttons.next")}
                                            </Button>
                                        </div>
                                    </div>
                                </StepContent>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length && (
                        <Paper square elevation={0} className={classes.resetContainer}>
                            <Typography>{i18n.t("titles.sended")}</Typography>
                        </Paper>
                    )}
                </Card>
            </Container>
            <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
                <List>
                    <ListItemText style={{ margin: 30 }} primary={DialogText} />
                </List>
            </Dialog>

            <Dialog open={openMatriz} aria-labelledby="form-dialog-title">
                <DialogTitle>
                    <Typography variant="subtitle1" component="h2">{i18n.t("titles.save_matriz")}</Typography>
                </DialogTitle>
                <DialogActions>
                    <Button onClick={ModalDeleteMatriz} color="primary">
                        {i18n.t("buttons.no")}
                    </Button>
                    <Button onClick={handleCloseMatriz} variant="contained" color="primary">
                        {i18n.t("buttons.yes")}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openAwait} aria-labelledby="form-dialog-title">
                <DialogTitle>
                    <CircularProgress />
                </DialogTitle>
            </Dialog>

        </div>
    );
}
