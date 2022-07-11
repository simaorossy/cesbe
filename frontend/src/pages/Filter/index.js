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
import Search from '@material-ui/icons/Search';
import { FormHelperText, Input, InputAdornment, ListItem, ListItemIcon, Radio, RadioGroup, Tooltip } from '@material-ui/core';

import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import api from '../../services/api';


//tradução
import i18n from "../../translate/i18n"

const useStyles = makeStyles((theme) => ({
    paper: {
        flexGrow: 1,
        marginTop: theme.spacing(20),
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
    list: {
        width: '100%',
        maxWidth: "100%",
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
        marginLeft: 20,
    },
    stepper: {
        padding: theme.spacing(3, 0, 5),
    },
    marginR: {
        marginRight: theme.spacing(3),
    },
    margin: {
        marginTop: theme.spacing(20),
    },
    form1: {
        marginLeft: 35,
    },
    Butons: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',


    },
    ButonsF: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',


    },
    typography: {
        fontSize: 24,
        fontWeight: 300,
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
        display: 'flex',
        justifyContent: 'center',
    },
    typographyF: {
        fontSize: 24,
        fontWeight: 300,
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        marginLeft: 190,

    },
    search: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginRight: 10,
    },
    StepsCenter:{
        display: 'flex',
        justifyContent:'center',
        paddingLeft:150,
        paddingRight:150,

        alignItems:'center',
    },
    root: {
        flexGrow: 1,
    },
}));

export default function Filter() {

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
    const [checkedUnion, setCheckedUnion] = React.useState(true);
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
    const [UsersS, setUsersS] = useState([]);
    const [UsersP, setUsersP] = useState([]);
    const [OldUsers, setOldUsers] = useState([]);
    const [Levels, setLevels] = useState();
    const [Level, setLevel] = useState();

    const [AllFiles, setAllFiles] = useState([]);

    const [activeStep, setActiveStep] = useState(0);


    const [openFilter, setOpenFilter] = useState(false);
    const [valueFilter, setValueFilter] = useState(false);
    const [radioButton, setRadioButton] = useState('lastMonth');
    const [radioButtonR, setRadioButtonR] = useState('forSend');
    const [checkedFilter, setCheckedFilter] = useState([]);
    const [checkedCopyFilter, setCheckedCopyFilter] = useState([]);
    const [titleFilter, setTitleFilter] = useState('');
    const [btnFilter, setBtnFilter] = useState(true);
    const [state, setState] = useState({});
    const [filterSearchP, setFilterSearchP] = useState('');
    const [filterSearchS, setFilterSearchS] = useState('');
    const [dateFilterOne, setDateFilterOne] = useState(null);
    const [dateFilterTwo, setDateFilterTwo] = useState(null);
    const [disableWizard, setDisableWizard] = useState(null);

//#endregion

    const [skipped, setSkipped] = React.useState(new Set());
    const steps = getSteps();

    useEffect(() => {
        getUsersActives();
        if (radioButtonR == "forUser") {
            
            setDisableWizard(true);
        } else {
            setDisableWizard(false);
        }
    }, [checkedFilter, disableWizard, radioButton, radioButtonR, checkedCopyFilter, titleFilter])

    function resetVars(e){
        setRadioButtonR(e.target.value)
        if(e.target.value == "forUser"){
            setCheckedFilter([])
            setCheckedCopyFilter([]);
        }
        if(e.target.value == "forSend"){
            setCheckedFilter([])
            setCheckedCopyFilter([]);
        }
         if(e.target.value == "completed"){
            setCheckedFilter([])
            setCheckedCopyFilter([]);
        }
       
    }
    function getSteps() {
        if (disableWizard) {
            return [i18n.t('tables.type_report'), i18n.t('titles.users'), i18n.t('tables.season')];
        } else {
            return [i18n.t('tables.type_report'), i18n.t('titles.users'), i18n.t('tables.aprover'), i18n.t('tables.season'), i18n.t('tables.title')];
        }
    }
    async function getUsersActives() {
        const response = await api.get('usersactives');
        setUsersS(response.data);
        setUsersP(response.data);
        setOldUsers(response.data);
    }

    function filterForUsers(value) {
        const currentIndex1 = checkedFilter.indexOf(value);
        const newChecked1 = [...checkedFilter];
        if (currentIndex1 === -1) {
            newChecked1.push(value);
        } else {
            newChecked1.splice(currentIndex1, 1);
        }
        setCheckedFilter(newChecked1);


    } function filterForCopy(value) {
        const currentIndex = checkedCopyFilter.indexOf(value);
        const newChecked = [...checkedCopyFilter];
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setCheckedCopyFilter(newChecked);

    }

    function searchFilter(e) {
        setFilterSearchS(e.target.value)
        let arr = UsersS.filter((j) => j.name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1);
        if (arr[0]) {
            setUsersS(arr);
        } if (e.target.value == "") {
            setUsersS(OldUsers);
        }



    }
    function searchFilterP(e) {
        setFilterSearchP(e.target.value)
        let arr1 = UsersP.filter((j) => j.name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1);
        if (arr1[0]) {
            setUsersP(arr1);
        } if (e.target.value == "") {
            setUsersP(OldUsers);
        }
    }
    function getStepContent(step) {
        switch (step) {
            case 0:
                return (
                    <FormControl component="fieldset" style={{ height: 150, marginLeft: 30, width: "100%", overflow: "hidden" }}>
                        <RadioGroup aria-label="gender" name="Relatorios " value={radioButtonR} onChange={(e) => resetVars(e)} >
                            <FormControlLabel value="forSend" control={<Radio />} label="Por Envio" />
                            <FormControlLabel value="forUser" control={<Radio />} label="Por Usuário" />
                            <FormControlLabel value="completed" control={<Radio />} label="Completo" />
                        </RadioGroup>
                    </FormControl>
                );
            case 1:
                return (
                    <List className={classes.list}>
                        <div className={classes.search}>
                            <TextField
                                onChange={(e) => searchFilter(e)}
                                label="Pesquisar"
                                value={filterSearchS}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search></Search>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                        {UsersS.map((user) => {
                            const labelId = `checkbox-list-label-${user.id}`;
                            return (
                                <ListItem key={user.id} role={undefined} dense button onClick={() => filterForUsers(user.id)}>
                                    <ListItemIcon >
                                        <Checkbox
                                            edge="start"
                                            checked={checkedFilter.indexOf(user.id) !== -1}
                                            disableRipple
                                            defaultValue={false}
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText id={labelId} primary={user.name + `(${user.email})`} />

                                </ListItem>
                            );
                        })}
                    </List>

                );
            case 2:
                return (
                    <List className={classes.list} >
                        <div className={classes.search}>
                            <TextField
                                onChange={(e) => searchFilterP(e)}
                                label="Pesquisar"
                                value={filterSearchP}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search></Search>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                        {UsersP.map((user) => {
                            const labelId = `checkbox-list-label-${user.id}`;
                            return (
                                <ListItem key={user.id} role={undefined} dense button onClick={() => filterForCopy(user.id)}>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={checkedCopyFilter.indexOf(user.id) !== -1}
                                            disableRipple
                                            defaultValue={false}
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText id={labelId} primary={user.name + `(${user.email})`} />

                                </ListItem>
                            );
                        })}
                    </List>)
            case 3:
                return (
                    <Grid>
                        <FormControl className={classes.form1}>
                            <RadioGroup aria-label="gender" name="Relatorios " value={radioButton} onChange={(e) => setRadioButton(e.target.value)} >
                                <FormControlLabel value="lastMonth" control={<Radio />} label="Últimos 30 Dias" />
                                <FormControlLabel value="lastThreeMonth" control={<Radio />} label="Últimos 90 Dias" />
                                <FormControlLabel value="lastSix" control={<Radio />} label="Últimos 6 meses" />
                                <FormControlLabel value="lastYear" control={<Radio />} label="Último Ano" />
                                <FormControlLabel value="other" control={<Radio />} label="Outro" />
                            </RadioGroup>
                            {radioButton == "other" &&
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <Grid container justify="space-around">
                                        <KeyboardDatePicker

                                            disableToolbar
                                            variant="inline"
                                            format="MM/dd/yyyy"
                                            margin="normal"
                                            id="date-picker-inline"
                                            label="Date picker inline"
                                            value={dateFilterOne}
                                            onChange={(e) => setDateFilterOne(Intl.DateTimeFormat('pt-BR').format(e))}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        /> <KeyboardDatePicker
                                            disableToolbar
                                            // minDate={`${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear() - 1}`}
                                            // maxDate={`${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`}
                                            variant="inline"
                                            format="MM/dd/yyyy"
                                            margin="normal"
                                            id="date-picker-inline"
                                            label="Date picker inline"
                                            value={dateFilterTwo}
                                            onChange={(e) => setDateFilterTwo(Intl.DateTimeFormat('pt-BR').format(e))}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />


                                    </Grid>
                                </MuiPickersUtilsProvider>
                            }
                        </FormControl>
                    </Grid>

                );
            case 4:
                return (
                    <FormControl style={{ height: 60, marginLeft: 30, width: "100%", overflow: "hidden" }} >
                        <InputLabel htmlFor="my-input">{i18n.t('placeholders.digit_title')} </InputLabel>
                        <Input id="my-input" value={titleFilter} onChange={(e) => setTitleFilter(e.target.value)} aria-describedby="my-helper-text" />
                        <FormHelperText id="my-helper-text"></FormHelperText>
                    </FormControl>
                );
            default:
                return 'Unknown step';
        }
    }
    const isStepOptional = (step) => {
        return step === 1;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        
        if (radioButton == "other") {

            if (dateFilterOne == "" || dateFilterTwo == "" || dateFilterTwo == null || dateFilterOne == null) {
                setOpen(true);
                setDialogText("Preencha as duas datas");
            } else {
                if (isStepSkipped(activeStep)) {
                    newSkipped = new Set(newSkipped.values());
                    newSkipped.delete(activeStep);
                }
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
                setSkipped(newSkipped);
            }
        } else {
            if (disableWizard && activeStep == 1) {
                setActiveStep(3);
            }   
            else if (disableWizard && activeStep == 3) {
                setActiveStep(5);
            }           
            else {
                if (isStepSkipped(activeStep)) {
                    newSkipped = new Set(newSkipped.values());
                    newSkipped.delete(activeStep);
                }
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
                setSkipped(newSkipped);
            }

        }
    };

    const handleBack = () => {
        if (disableWizard && activeStep == 2) {
            setActiveStep(activeStep - 1);
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
        }

    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            throw new Error("You can't skip a step that isn't optional.");
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        if (disableWizard) {
            setActiveStep(0);
        } else {
            setActiveStep(0);
        }
    };

    async function getDataFilter() {

        handleNext();

        let response = [];
        
        if (radioButtonR == "forSend") {
            response = await api.post("/filterForSend", {
                lastMonth: radioButton,
                requester: checkedFilter,
                aprover: checkedCopyFilter,
                title: titleFilter,
                dateOne: dateFilterOne,
                dateTwo: dateFilterTwo,
            })

            setState({
                columns: [
                    { title: 'ID', field: 'id', editable: 'never', hidden: true, filtering: false },
                    { title: i18n.t('tables.send'), field: 'send', editable: 'never', filtering: false },
                    { title: i18n.t('tables.title'), field: 'title', editable: 'never', filtering: false },
                    { title: i18n.t('tables.date_send'), field: 'date', editable: 'never', filtering: false },
                    { title: i18n.t('tables.last_update'), field: 'last_update', editable: 'never', filtering: false },
                    { title: i18n.t('tables.requester'), field: 'requester', editable: 'never', filtering: false },
                    {
                        title: i18n.t('tables.status'),
                        field: 'status',

                        filtering: false
                    },
                    { title: i18n.t('tables.reason'), field: 'reason', editable: 'never', filtering: false, hidden: false },
                    { title: i18n.t('tables.time_aprover'), field: 'time_to_approve', editable: 'never', filtering: false, hidden: false },
                ],
                data: response.data,
            });
        }
        
        console.log(radioButtonR);

        if (radioButtonR == "forUser") {
            response = await api.post("/filterForUsers", {
               requester: checkedFilter,
               lastMonth: radioButton,
               dateOne: dateFilterOne,
               dateTwo: dateFilterTwo
            })
            setState({
                columns: [
                    { title: 'ID', field: 'id', editable: 'never', hidden: true, filtering: false },
                    { title: i18n.t('tables.name'), field: 'user', editable: 'never', filtering: false },
                    { title: i18n.t('tables.send_for_aprovation'), field: 'send_to_approve', editable: 'never', filtering: false },
                    { title: i18n.t('tables.pending_aprovation'), field: 'pending_to_approve', editable: 'never', filtering: false },
                    { title: i18n.t('tables.media_time'), field: 'average_time', editable: 'never', filtering: false },
                    { title: i18n.t('tables.inside_sla'), field: 'in_sla', editable: 'never', filtering: false, hidden: false },
                ],
                data: response.data,
            });
        }

        if (radioButtonR == "completed") {
            response = await api.post("/filterForCompleted", {
                lastMonth: radioButton,
                requester: checkedFilter,
                aprover: checkedCopyFilter,
                title: titleFilter,
                dateOne: dateFilterOne,
                dateTwo: dateFilterTwo,

            })

            setState({
                columns: [
                    { title: 'ID', field: 'id', editable: 'never', hidden: true, filtering: false },
                    { title: i18n.t('tables.send'), field: 'send', editable: 'never', filtering: false },
                    { title: i18n.t('tables.title'), field: 'title', editable: 'never', filtering: false },
                    {
                        title: i18n.t('tables.status'),
                        field: 'status',
                        filtering: false
                    },
                    { title: i18n.t('tables.levels'), field: 'levels', editable: 'never', filtering: false },
                    { title: i18n.t('tables.date_send'), field: 'date', editable: 'never', filtering: false },
                    { title: i18n.t('tables.last_update'), field: 'last_update', editable: 'never', filtering: false },
                    { title: i18n.t('tables.time_aprover'), field: 'time_to_approve', editable: 'never', filtering: false, hidden: false },
                    { title: i18n.t('tables.inside_sla'), field: 'in_sla', editable: 'never', filtering: false, hidden: false },
                    { title: i18n.t('tables.requester'), field: 'requester', editable: 'never', filtering: false, hidden: false },
                    { title: i18n.t('tables.aprover'), field: 'approver', editable: 'never', filtering: false, hidden: false },
                    { title: i18n.t('tables.reason'), field: 'reason', editable: 'never', filtering: false, hidden: false },
                    { title: i18n.t('tables.level_aprover'), field: 'level', editable: 'never', filtering: false, hidden: false },
                ],
                data: response.data,
            });
        }

    }
    if (activeStep != 5) {
        return (
        <div>
            <Menu />
            <div className={classes.root}>
            <Grid container justify="center" className={classes.margin}>
            <Grid item xs={11}>
            <Typography className={classes.typography}>Relatórios</Typography>
            <Card style={{ padding: 15, marginBottom: 18 }}>
                <div>
                    <Stepper className={disableWizard && classes.StepsCenter} activeStep={activeStep}>
                        {steps.map((label, index) => {
                            const stepProps = {};
                            const labelProps = {};

                            if (isStepSkipped(index)) {
                                stepProps.completed = false;
                            }
                            return (
                                <Step key={label} {...stepProps}>
                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    <div>
                        {activeStep === steps.length && disableWizard === false || activeStep === steps.length + 3 && disableWizard === true ? (
                            <div>
                                <Button onClick={handleReset} className={classes.Butons}>
                                    Pesquisar
                         </Button>
                            </div>
                        ) : (
                            <div>
                                    <div >
                                    <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                                    </div>
                                    <div className={classes.Butons}>
                                        <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                                            {i18n.t("buttons.back")}
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={activeStep === steps.length - 1 && disableWizard === false || activeStep === steps.length && disableWizard === true ? getDataFilter : handleNext}
                                            className={classes.button}
                                        >
                                            {activeStep === steps.length - 1 && disableWizard === false || activeStep === steps.length && disableWizard === true ? i18n.t('placeholders.search') : i18n.t('buttons.next')}
                                        </Button>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </Card>
            </Grid>
            <Dialog onClose={() => setOpen(false)} aria-labelledby="simple-dialog-title" open={open}>
                <List>
                    <ListItemText style={{ margin: 30 }} primary={DialogText} />
                </List>
            </Dialog>
            </Grid>
            </div>
        </div>
        );
    } if (activeStep == 5 || activeStep == 2) {
        return (
            <div>
                <Menu />
                <Grid container justify="center" className={classes.margin}>
                
                    <Grid item xs={11} className={classes.ButonsF}>
                        <Typography className={classes.typographyF}>Relatórios</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleReset}
                            style={{ marginBottom: 10, }}
                            className={classes.button}>
                            {i18n.t("buttons.filter_again")}
                        </Button>
                    </Grid>
                    <Grid item xs={11}>
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
                                filtering: false,
                            }}
                        />
                    <Typography variant="subtitle1" component="h2">* Envios 'Cancelados' são ignorados em todos os relatórios e indicadores estabelecidos</Typography>
                    <Typography variant="subtitle1" component="h2">* Caso o documento ainda não tenha sido aprovado sua SLA é contabilizada utilizando a data atual</Typography>
                    </Grid>
                </Grid>
            </div>
        )
    }
}