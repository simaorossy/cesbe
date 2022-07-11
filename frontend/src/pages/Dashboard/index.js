import React, { useState } from 'react';
import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Menu from '../Menu';
import MaterialTable from 'material-table';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import { Grid, Modal, Button, InputLabel, FormControl, Select, MenuItem, FormHelperText, FormLabel, FormGroup, FormControlLabel, Radio, RadioGroup, TextField, Input } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';


//tradução
import i18n from '../../translate/i18n'


import api from '../../services/api';

const useStyles = makeStyles((theme) => ({
    float: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },

    margin: {
        marginTop: theme.spacing(10),
    },

    root: {
        flexGrow: 1,
    },

    marginR: {
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing(1),
    },
    paper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.background.paper,
        outline: 0,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    modal: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

    },
    containerInputs: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'space-between'
    },
    button: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        marginLeft: 10,

    },
    formControlSelect: {
        height: 130,
    },
    gridList: {
        minWidth: 400,
    },
    formDate: {
        display: 'flex',
        width: "100%",
    },
    textField: {



    }


}));

export default function Dashboard() {

    const history = useHistory();
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [Users, setUsers] = useState();
    const [AllUsers, setAllUsers] = useState();
    const [DialogText, setDialogText] = useState("Tela em desenvolvimento!");

    //#region 
    const handleClose = (value) => {
        setOpen(false);
        if (DialogText === i18n.t('messagesText.default_pass')) {
            history.push({
                pathname: '/password',
                state: { name: localStorage.getItem('Username'), id: localStorage.getItem('id') }
            });
        }
    };

    useEffect(() => {
        
        getLogin();
        getUsers();
        getUsersAll();
        getSends();
       
    }, []);

    async function goToSend(id, sends) {
        localStorage.removeItem('SendID');

        const response = await api.get('users');

        for (let index = 0; index < sends.length; index++) {
            if (id == sends[index].id) {

                history.push({
                    pathname: '/dashboarddetails',
                    state: { name: localStorage.getItem('Username'), id: sends[index].id, send: sends[index].send, type: sends[index].type, status: sends[index].status, users: response.data, data: sends[index].data, title: sends[index].title, description: sends[index].description, current_level: sends[index].current_level, user: sends[index].user, last_update: sends[index].last_update }
                })
            }
        }
    }

    const [WaitingApprover, setWaitingApprovers] = useState(0);
    const [Copys, setCopys] = useState(0);
    const [Approvers, setApprovers] = useState(0);
    const [Faileds, setFaileds] = useState(0);
    const [MySends, setMySends] = useState(0);
    const [AllSends, setAllSends] = useState(0);
    const [Sends, setSends] = useState();

    async function getLogin() {
        const response = await api.post('getfistlogin', {
            id: localStorage.getItem('id')
        })
        if (response.data[0].first_login === 0) {
            setDialogText(i18n.t('messagesText.default_pass'));
            setOpen(true);
        }
    }

    async function getUsers() {
        const response = await api.get('usersactives');
        setUsers(response.data);
    }

    async function getUsersAll() {
        const response = await api.get('users');
        setAllUsers(response.data);
    }

    async function GetSendsType(e, type) {
        e.preventDefault();

        const response = await api.post('sends', {
            id: localStorage.getItem('id')
        });

        var data = [];

        for (let index = 0; index < response.data.length; index++) {
            if (type === 'WaitingApprover') {
                if (response.data[index].type === 1 && response.data[index].pending_to_approve === 1 || 
                    response.data[index].type === 4 && response.data[index].pending_to_approve === 1 || 
                    response.data[index].type === 6 && response.data[index].pending_to_approve === 1 || 
                    response.data[index].type === 9 && response.data[index].pending_to_approve === 1) {
                    data.push(response.data[index]);
                }
            } else if (type === 'Copys') {
                if (response.data[index].type === 5 && response.data[index].in_copy === 1 || 
                    response.data[index].type === 6 && response.data[index].in_copy === 1 || 
                    response.data[index].type === 8 && response.data[index].in_copy === 1 || 
                    response.data[index].type === 9 && response.data[index].in_copy === 1) {
                    data.push(response.data[index]);
                }
            } else if (type === 'Approvers') {
                if (response.data[index].status === 2 
                    && response.data[index].user == localStorage.getItem('id')
                    && response.data[index].approved === 1) {
                    data.push(response.data[index]);
                } else{
                    if (response.data[index].type === 10 && response.data[index].status === 0 && response.data[index].approved === 1 || 
                        response.data[index].type === 10 && response.data[index].status === 2 && response.data[index].approved === 1 ) {
                        data.push(response.data[index]);
                    }
                }
            } else if (type === 'Faileds') {
                if (response.data[index].status === 3 && response.data[index].user == localStorage.getItem('id') && response.data[index].reproved === 1) {
                    data.push(response.data[index]);
                }else{
                    if (response.data[index].type === 10 && response.data[index].status === 3 && response.data[index].reproved === 1) {
                        data.push(response.data[index]);
                    }
                }
            } else if (type === 'AllSends') {
                data.push(response.data[index]);
            }
            else if (type === 'MySends'){
                if(response.data[index].type === 3 && response.data[index].my_sends === 1 || 
                   response.data[index].type === 4 && response.data[index].my_sends === 1 || 
                   response.data[index].type === 8 && response.data[index].my_sends === 1 || 
                   response.data[index].type === 9 && response.data[index].my_sends === 1 && response.data[index].user == localStorage.getItem('id')){
                    data.push(response.data[index]);
                }
            }
        }

        setState({
            columns: [
                { title: 'ID', field: 'id', editable: 'never', hidden: true, filtering: false },
                { title: i18n.t('tables.data'), field: 'date', editable: 'never', filtering: false },
                { title: i18n.t('tables.last_update'), field: 'late', editable: 'never', filtering: false },
                { title: i18n.t('tables.send'), field: 'send', editable: 'never', defaultSort:'desc' ,filtering: false },
                { title: i18n.t('tables.title'), field: 'title', editable: 'never', filtering: false },
                { title: i18n.t('tables.description'), field: 'description', editable: 'never', filtering: false },
                {
                    title: i18n.t('tables.status'),
                    field: 'status',
                    lookup: { 0: i18n.t('status.wait_aproved'), 1: i18n.t('status.in_copy'), 2: i18n.t('status.approved'), 3: i18n.t('status.reproved'), 4: 'Em rascunho', 5: i18n.t('status.canceled') },
                    filtering: false
                },
                { title: 'SLA', field: 'sla', editable: 'never', filtering: false },
                { title: i18n.t('tables.type'), field: 'type', editable: 'never', filtering: false, hidden: true },
                { title: i18n.t('tables.standart'), field: 'current_level', editable: 'never', filtering: false, hidden: true },
                { title: i18n.t('tables.matrix'), field: 'approve', editable: 'never', filtering: false, hidden: true },
                { title: i18n.t('tables.user'), field: 'user', editable: 'never', filtering: false, hidden: true },
                { title: i18n.t('tables.last'), field: 'last_update', editable: 'never', filtering: false, hidden: true },
                { title: i18n.t('tables.data'), field: 'data', editable: 'never', filtering: false, hidden: true },
            ],
            data: data,
        });

    }

    async function getSends() {

        const response = await api.post('sends', {
            id: localStorage.getItem('id')
        });

        if (response !== undefined) {
            let WaitingApproverCount = 0;
            let CopysCount = 0;
            let ApproversCount = 0;
            let FailedsCount = 0;
            let MySendsCount = 0;

            for (let index = 0; index < response.data.length; index++) {
                if (response.data[index].type === 1 && response.data[index].status === 0 && response.data[index].pending_to_approve === 1  || 
                    response.data[index].type === 4 && response.data[index].status === 0 && response.data[index].pending_to_approve === 1  || 
                    response.data[index].type === 6 && response.data[index].status === 0 && response.data[index].pending_to_approve === 1  || 
                    response.data[index].type === 9 && response.data[index].status === 0 && response.data[index].pending_to_approve === 1) {
                    WaitingApproverCount += 1;
                } else if (response.data[index].type === 5 && response.data[index].in_copy === 1 || 
                           response.data[index].type === 6 && response.data[index].in_copy === 1 || 
                           response.data[index].type === 8 && response.data[index].in_copy === 1 || 
                           response.data[index].type === 9 && response.data[index].in_copy === 1 ) {
                    CopysCount += 1;
                } else if (response.data[index].status === 2 && response.data[index].user == localStorage.getItem('id') && response.data[index].approved === 1) {
                    ApproversCount += 1;
                    if (response.data[index].type === 3 &&
                        response.data[index].my_sends === 1) {
                            MySendsCount += 1;
                    }
                } else if (response.data[index].status === 3 && response.data[index].user == localStorage.getItem('id') && response.data[index].reproved === 1) {
                    FailedsCount += 1;
                    if (response.data[index].type === 3 &&
                        response.data[index].my_sends === 1) {
                            MySendsCount += 1;
                    }
                } else if (response.data[index].type === 3 &&
                           response.data[index].my_sends === 1) {
                                MySendsCount += 1;
                } else if (response.data[index].type === 10 && response.data[index].status === 0 && response.data[index].approved === 1 || 
                           response.data[index].type === 10 && response.data[index].status === 2 && response.data[index].approved === 1) {
                    ApproversCount += 1;
                    if (response.data[index].type === 3 &&
                        response.data[index].my_sends === 1) {
                        MySendsCount += 1;
                    }
                } else if (response.data[index].type === 10 && response.data[index].status === 3 && response.data[index].reproved === 1) {
                    FailedsCount += 1;
                    if (response.data[index].type === 3 &&
                        response.data[index].my_sends === 1) {
                        MySendsCount += 1;
                    }
                }
            }

            setWaitingApprovers(WaitingApproverCount);
            setCopys(CopysCount);
            setApprovers(ApproversCount);
            setFaileds(FailedsCount);
            setMySends(MySendsCount);
            setAllSends(response.data.length);

            // setWaitingApprovers(''+ WaitingApproverCount +' / '+ response.data.length +'');
            // setCopys(''+ CopysCount +' / '+ response.data.length +'');
            // setApprovers(''+ ApproversCount +' / '+ response.data.length +'');
            // setFaileds(''+ FailedsCount +' / '+ response.data.length +'');
            // setMySends(''+ MySendsCount +' / '+ response.data.length +'');

            setState({
                columns: [
                    { title: 'ID', field: 'id', editable: 'never', hidden: true, filtering: false },
                    { title: i18n.t('tables.data'), field: 'date', editable: 'never', filtering: false },
                    { title: i18n.t('tables.last_update'), field: 'late', editable: 'never', filtering: false },
                    { title: i18n.t('tables.send'), field: 'send', editable: 'never',  defaultSort:'desc' ,filtering: false },
                    { title: i18n.t('tables.title'), field: 'title', editable: 'never', filtering: false },
                    { title: i18n.t('tables.description'), field: 'description', editable: 'never', filtering: false },
                    {
                        title: i18n.t('tables.status'),
                        field: 'status',
                        lookup: { 0: i18n.t('status.wait_aproved'), 1: i18n.t('status.in_copy'), 2: i18n.t('status.approved'), 3: i18n.t('status.reproved'), 4: 'Em rascunho', 5: i18n.t('status.canceled') },
                        filtering: false
                    },
                    { title: 'SLA', field: 'sla', editable: 'never', filtering: false },
                    { title: i18n.t('tables.type'), field: 'type', editable: 'never', filtering: false, hidden: true },
                    { title: i18n.t('tables.standart'), field: 'current_level', editable: 'never', filtering: false, hidden: true },
                    { title: i18n.t('tables.matrix'), field: 'approve', editable: 'never', filtering: false, hidden: true },
                    { title: i18n.t('tables.user'), field: 'user', editable: 'never', filtering: false, hidden: true },
                    { title: i18n.t('tables.last_update'), field: 'last_update', editable: 'never', filtering: false, hidden: true },
                    { title: i18n.t('tables.data'), field: 'data', editable: 'never', filtering: false, hidden: true },
                ],
                data: response.data,
            });
        } else {
            var data = [];
            setWaitingApprovers(0);
            setCopys(0);
            setApprovers(0);
            setFaileds(0);
            setMySends(0);
            setAllSends(0);

            setState({
                columns: [
                    { title: 'ID', field: 'id', editable: 'never', hidden: true, filtering: false },
                    { title: i18n.t('tables.data'), field: 'date', editable: 'never', filtering: false },
                    { title: i18n.t('tables.last_update'), field: 'late', editable: 'never', filtering: false },
                    { title: i18n.t('tables.send'), field: 'send', editable: 'never', filtering: false },
                    { title: i18n.t('tables.title'), field: 'title', editable: 'never', filtering: false },
                    { title: i18n.t('tables.description'), field: 'description', editable: 'never', filtering: false },
                    {
                        title: i18n.t('tables.status'),
                        field: 'status',
                        lookup: { 0: i18n.t('status.wait_aproved'), 1: i18n.t('status.in_copy'), 2: i18n.t('status.approved'), 3: i18n.t('status.reproved'), 4: 'Em rascunho', 5: i18n.t('status.canceled') },
                        filtering: false
                    },
                    { title: 'SLA', field: 'sla', editable: 'never', filtering: false },
                    { title: i18n.t('tables.type'), field: 'type', editable: 'never', filtering: false, hidden: true },
                    { title: i18n.t('tables.standart'), field: 'current_level', editable: 'never', filtering: false, hidden: true },
                    { title: i18n.t('tables.matrix'), field: 'approve', editable: 'never', filtering: false, hidden: true },
                    { title: i18n.t('tables.user'), field: 'user', editable: 'never', filtering: false, hidden: true },
                    { title: i18n.t('tables.last'), field: 'last_update', editable: 'never', filtering: false, hidden: true },
                    { title: i18n.t('tables.data'), field: 'data', editable: 'never', filtering: false, hidden: true },
                ],
                data: data,
            });
        }

        if (localStorage.getItem('SendID') !== null)
            goToSend(localStorage.getItem('SendID'), response.data);

    }

    function SendDocuments(e) {
        e.preventDefault();

        history.push({
            pathname: '/senddocuments',
            state: { name: localStorage.getItem('Username'), users: Users, }
        });
    }

    const [data] = useState([]);

    const [state, setState] = React.useState({
        columns: [
            { title: 'ID', field: 'id', editable: 'never', hidden: true, filtering: false },
            { title: i18n.t('tables.data'), field: 'data', editable: 'never', filtering: false },
            { title: i18n.t('tables.last_update'), field: 'late', editable: 'never', filtering: false },
            { title: i18n.t('tables.send'), field: 'send', editable: 'never', filtering: false },
            { title: i18n.t('tables.title'), field: 'title', editable: 'never', filtering: false },
            { title: i18n.t('tables.description'), field: 'description', editable: 'never', filtering: false },
            {
                title: i18n.t('tables.status'),
                field: 'status',
                lookup: { 0: i18n.t('status.wait_aproved'), 1: i18n.t('status.in_copy'), 2: i18n.t('status.approved'), 3: i18n.t('status.reproved'), 4: 'Em rascunho', 5: i18n.t('status.canceled') },
                filtering: false
            },
            { title: 'SLA', field: 'sla', editable: 'never', filtering: false },
            { title: i18n.t('tables.type'), field: 'type', editable: 'never', filtering: false, hidden: true },
            { title: i18n.t('tables.standart'), field: 'current_level', editable: 'never', filtering: false, hidden: true },
            { title: i18n.t('tables.matrix'), field: 'approve', editable: 'never', filtering: false, hidden: true },
            { title: i18n.t('tables.user'), field: 'user', editable: 'never', filtering: false, hidden: true },
            { title: i18n.t('tables.last'), field: 'last_update', editable: 'never', filtering: false, hidden: true },
            { title: i18n.t('tables.data'), field: 'data', editable: 'never', filtering: false, hidden: true },
        ],
        data: data,
    });

    function GoToDetails(data) {
        history.push({
            pathname: '/dashboarddetails',
            state: { name: localStorage.getItem('Username'), id: data.id, send: data.send, type: data.type, status: data.status, users: AllUsers, data: data.data, title: data.title, description: data.description, current_level: data.current_level, user: data.user, last_update: data.last_update}            
        });
    }
    //#endregion

    return (
        <div>
            <Menu/>
            <div className={classes.root}>
                <Grid container justify="center" className={classes.margin}>
                    <Grid item xs={2} className={classes.marginR}>
                        <Card className={classes.root} style={{ padding: 15, marginBottom: 10, textAlign: 'center', cursor: 'pointer' }} onClick={e => GetSendsType(e, 'WaitingApprover')}>
                            <Typography color="textSecondary">
                                {i18n.t('titles.wait_aproved')}
                            </Typography>
                            <Typography variant="h5">
                                {WaitingApprover}
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={2} className={classes.marginR}>
                        <Card className={classes.root} style={{ padding: 15, marginBottom: 10, textAlign: 'center', cursor: 'pointer' }} onClick={e => GetSendsType(e, 'Copys')}>
                            <Typography color="textSecondary">
                                {i18n.t('titles.in_copy')}
                            </Typography>
                            <Typography variant="h5">
                                {Copys}
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={2} className={classes.marginR}>
                        <Card className={classes.root} style={{ padding: 15, marginBottom: 10, textAlign: 'center', cursor: 'pointer' }} onClick={e => GetSendsType(e, 'Approvers')}>
                            <Typography color="textSecondary">
                                {i18n.t('titles.approved')}
                            </Typography>
                            <Typography variant="h5">
                                {Approvers}
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={2} className={classes.marginR}>
                        <Card className={classes.root} style={{ padding: 15, marginBottom: 10, textAlign: 'center', cursor: 'pointer' }} onClick={e => GetSendsType(e, 'Faileds')}>
                            <Typography color="textSecondary">
                                {i18n.t('titles.reproved')}
                            </Typography>
                            <Typography variant="h5">
                                {Faileds}
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={2} className={classes.marginR}>
                        <Card className={classes.root} style={{ padding: 15, marginBottom: 10, textAlign: 'center', cursor: 'pointer' }} onClick={e => GetSendsType(e, 'MySends')}>
                        <Typography color="textSecondary">
                        Meus envios
                        </Typography>
                        <Typography variant="h5">
                            {MySends}   
                        </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={1}>
                        <Card className={classes.root} style={{padding:15, marginBottom: 10, textAlign: 'center', cursor: 'pointer'}} onClick={e => GetSendsType(e, 'AllSends')}>
                        <Typography color="textSecondary">
                            {i18n.t('titles.all')}
                        </Typography>
                        <Typography variant="h5">
                            {AllSends}
                        </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <MaterialTable
                            style={{marginLeft: 15, marginRight: 15}}
                            onRowClick={(event, rowData) => GoToDetails(rowData)}
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
                                    searchPlaceholder: i18n.t("placeholders.search"),
                                    nRowsSelected: '{0} Envio(s) selecionado(s)',
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
                                //selection: true,
                                exportButton: true,
                                sorting:true,
                                filtering: false,
                            }}
                        />
                        <Tooltip title={i18n.t("labels.send_doc")}>
                            <Fab color="primary" aria-label="add" onClick={SendDocuments} className={classes.float}>
                                <NoteAddIcon />
                            </Fab>
                        </Tooltip>
                    </Grid>
                </Grid>
            </div>

            <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
                <List>
                    <ListItemText style={{ margin: 30 }} primary={DialogText} />
                </List>
            </Dialog>

     
        </div>
    );

}