import React, { useState } from 'react';
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Menu from '../Menu';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';

import { useHistory } from 'react-router-dom';

import api from '../../services/api';

//tradução
import i18n from '../../translate/i18n';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(14),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  typography: {
    fontSize: 24,
    fontWeight: 300,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
}));

export default function UserEdit() {

  const location = useLocation();
  const [username, setUsername] = useState('Nenhum');
  const [DepsList, setDepsList] = useState([]);
  const [CompanyList, setCompanysList] = useState([]);
  const [disableButton, setDisableButton] = useState(false);
  const [OtherDisplay, setOtherDisplay] = useState({ display: "none" });
  const [DialogText, setDialogText] = useState(i18n.t("errors.error_edit_user"));
  const history = useHistory();

  const [DisableUsers, setDisableUsers] = useState(false);

  const [otherCNPJ, setOtherCNPJ] = useState('');
  const [otherCompany, setOtherCompany] = useState('');

  const [open, setOpen] = React.useState(false);
  const handleClose = (value) => {
    setOpen(false);
    if (DialogText === i18n.t("messagesText.success_edit_user") || DialogText === i18n.t("messagesText.user_active") || DialogText === i18n.t("messagesText.user_inactive")) {
      history.push({
        pathname: '/users',
        state: { name: username }
      });
    }
  };

  async function getDeps() {
    const response = await api.get('departmentsactives');
    setDepsList(response.data);
    getCompany();
  }
  async function getCompany() {
    const response = await api.get('companys');
    setCompanysList(response.data);
    getUser();
  }
  async function getUser() {
    const response = await api.post('user', {
      id: location.state.id
    });
    const Res = [response.data];
    setName(Res[0][0].name);
    setEmail(Res[0][0].email);
    setOffice(Res[0][0].office);
    setCompany(Res[0][0].company);
    setDepartment(Res[0][0].department);
    setActive(Res[0][0].status);

    if (Res[0][0].status === 0 || Res[0][0].status === 2) {
      setSendPasswordDisplay({ marginLeft: 10, marginBottom: 10, display: 'none' });
    }

    if (Res[0][0].status === 2) {
      setButtonsApprove({});
    }

    if (Res[0][0].in_all === 1) {
      setStateAll({ ...stateAll, checkedAll: true });
    }
    if (Res[0][0].in_users === 1) {
      setStateUsers({ ...stateUsers, checkedUsers: true });
    }
    if (Res[0][0].in_terms === 1) {
      //console.log("res :", Res);
      setStateTerms({ ...stateTerms, checkedTerms: true });
    }
    if (Res[0][0].in_deps === 1) {
      setStateDeps({ ...stateDeps, checkedDeps: true });
    }
    if (Res[0][0].in_companys === 1) {
      setStateCompanys({ ...stateCompanys, checkedCompanys: true });
    }
    if (Res[0][0].in_refusal === 1) {
      setStateRefusal({ ...stateRefusal, checkedRefusal: true });
    }
    if (Res[0][0].in_approved === 1) {
      setStateApproved({ ...stateApproved, checkedApproved: true });
    }
    if (Res[0][0].in_document === 1) {
      setStateDocs({ ...stateDocs, checkedDocs: true });
    }
    if (Res[0][0].per_docs === 1) {
      setStateAllDocs({ ...stateAllDocs, checkedAllDocs: true });
    }
    if (Res[0][0].per_report === 1) {
      setStateReports({ ...stateReports, checkedReports: true });
    }
    if (Res[0][0].per_users === 1) {
      setStateNewUsers({ ...stateNewUsers, checkedNewUsers: true });
    }
    if (Res[0][0].per_approved === 1) {
      setStateApprovers({ ...stateApprovers, checkedApprovers: true });
    }

    if (Res[0][0].other_cnpj !== '') {
      setStateOther({ ...stateOther, checkedOther: true });
      setOtherDisplay({});
      setOtherCNPJ(Res[0][0].other_cnpj);
    }

    if (Res[0][0].other_company !== '') {
      setOtherCompany(Res[0][0].other_company);
    }

  }

  useEffect(() => {
    try {
      getDeps();
      setUsername(localStorage.getItem('Username'));
      if (localStorage.getItem('per_users') == 0) { setDisableUsers(true); }
    } catch (error) {
      console.log(error);
    }
  }, [location]);

  async function SaveUser(e) {
    e.preventDefault();
    if (stateOther.checkedOther === true && otherCompany === '' && otherCNPJ === '' || stateOther.checkedOther === true && otherCompany === '' || stateOther.checkedOther === true && otherCNPJ === '') {
      setDialogText(i18n.t("messagesText.requrired_cnpj"));
      setOpen(true);
    } else {
      try {
        await api.post('edituser', {
          Id: location.state.id,
          Name: name,
          Email: email,
          Company: company,
          Department: department,
          Office: office,
          Other: stateOther.checkedOther,
          Active: active,
          All: stateAll.checkedAll,
          Terms: stateTerms.checkedTerms,
          Users: stateUsers.checkedUsers,
          Deps: stateDeps.checkedDeps,
          Companys: stateCompanys.checkedCompanys,
          Refusal: stateRefusal.checkedRefusal,
          Approved: stateApproved.checkedApproved,
          Docs: stateDocs.checkedDocs,
          AllDocs: stateAllDocs.checkedAllDocs,
          NewUsers: stateNewUsers.checkedNewUsers,
          Approvers: stateApprovers.checkedApprovers,
          otherCNPJ: otherCNPJ,
          otherCompany: otherCompany,
          reports: stateReports.checkedReports
        });
        await setDialogText(i18n.t("messagesText.success_edit_user"));
        await setOpen(true);
      } catch (err) {
        setOpen(true);
      }
    }

  }

  async function SendPassword(e) {
    e.preventDefault();
    try {
      //Recuperação de senha
      await api.post('notifyrecoverpassword', {
        Email: email,
        language: i18n.language
      });
      await setDialogText(i18n.t("messagesText.send_pass"));
      await setOpen(true);
    } catch (err) {
      setOpen(true);
    }
  }
  const classes = useStyles();

  //Infos
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState(-1);
  const [department, setDepartment] = useState(-1);
  const [office, setOffice] = useState('');
  const [SendPasswordDisplay, setSendPasswordDisplay] = useState({ marginLeft: 10, marginBottom: 10 });
  const [ButtonsApprove, setButtonsApprove] = useState({ display: "none" });

  const [active, setActive] = useState(2);
  const [stateOther, setStateOther] = useState({
    checkedOther: false
  });
  const handleChangeOther = (event) => {
    setStateOther({ ...stateOther, [event.target.name]: event.target.checked });

    if (stateOther.checkedOther === false) {
      setOtherDisplay({});
    } else {
      setOtherDisplay({ display: "none" });
      setCompany(0)
      setOtherCNPJ('');
      setOtherCompany('');
    }

  };

  function ChangeActive(value) {
    setActive(value);
    if (value === 0) {
      setSendPasswordDisplay(setSendPasswordDisplay({ marginLeft: 10, marginBottom: 10, display: 'none' }));
      setButtonsApprove({ display: "none" });
    }
    if (value === 1) {
      setSendPasswordDisplay(setSendPasswordDisplay({ marginLeft: 10, marginBottom: 10 }));
      setButtonsApprove({ display: "none" });
    }
    if (value === 2) {
      setSendPasswordDisplay(setSendPasswordDisplay({ marginLeft: 10, marginBottom: 10, display: 'none' }));
      setButtonsApprove({});
    }
  }

  async function ApproveUser(e) {
    e.preventDefault();

    //Conta aprovada
    if (stateOther.checkedOther === false) {
      if (company != -1) {
        if (department != -1) {

          await api.post('nofityapproved', {
            Email: email,
            language: i18n.language
          });
          
          SaveUser(e);  
          
          await api.post('updatestatus', {
            email: email,
            status: 1,
            company: company,
            department: department,
          });

          setDialogText(i18n.t("messagesText.user_active"));
          setOpen(true);
        } else {
          setDialogText(i18n.t("messagesText.error_select_depart"));
          setOpen(true);
        }

      } else {
        setDialogText(i18n.t("messagesText.error_select_company"));
        setOpen(true);
      }
    } else {
      if (department != -1) {
        await api.post('nofityapproved', {
          Email: email,
          language: i18n.language
        });
        
        SaveUser(e);
        
        await api.post('updatestatus', {
          email: email,
          status: 1,
          company: 0,
          department: department,
          other_company: otherCompany,
          other_cnpj: otherCNPJ
        });

        setDialogText(i18n.t("messagesText.user_active"));
        setOpen(true);
      } else {
        setDialogText(i18n.t("messagesText.error_select_depart"));
        setOpen(true);
      }
    }
  };

  async function RepproveUser(e) {
    e.preventDefault();
    if (stateOther.checkedOther === false) {
      if (company != -1) {
        if (department != -1) {

          await api.post('nofityapproved', {
            Email: email,
            language: i18n.language
          });
          
          SaveUser(e);

          await api.post('updatestatus', {
            email: email,
            status: 1,
            company: company,
            department: department,
          });
          
          setDialogText(i18n.t("messagesText.user_inactive"));
          setOpen(true);
        } else {
          setDialogText(i18n.t("messagesText.error_select_depart"));
          setOpen(true);
        }

      } else {
        setDialogText(i18n.t("messagesText.error_select_company"));
        setOpen(true);
      }
    } else {
      if (department != -1) {
        await api.post('nofityapproved', {
          Email: email,
          language: i18n.language
        });
        
        SaveUser(e);
        
        await api.post('updatestatus', {
          email: email,
          status: 1,
          company: 0,
          department: department,
          other_company: otherCompany,
          other_cnpj: otherCNPJ
        });

        setDialogText(i18n.t("messagesText.user_inactive"));
        setOpen(true);
      } else {
        setDialogText(i18n.t("messagesText.error_select_depart"));
        setOpen(true);
      }
    }

  };


  //Interfaces
  const [stateAll, setStateAll] = useState({
    checkedAll: false
  });
  const handleChangeAll = (event) => {
    setStateAll({ ...stateAll, [event.target.name]: event.target.checked });
    setStateUsers({ ...stateUsers, checkedUsers: event.target.checked });
    setStateDeps({ ...stateDeps, checkedDeps: event.target.checked });
    setStateCompanys({ ...stateCompanys, checkedCompanys: event.target.checked });
    setStateRefusal({ ...stateRefusal, checkedRefusal: event.target.checked });
    setStateApproved({ ...stateApproved, checkedApproved: event.target.checked });
    setStateDocs({ ...stateDocs, checkedDocs: event.target.checked });
    setStateReports({ ...stateReports, checkedReports: event.target.checked });
    setStateTerms({ ...stateTerms, checkedTerms: event.target.checked });
  };

  const [stateUsers, setStateUsers] = useState({
    checkedUsers: false
  });

  const handleChangeUsers = (event) => {
    setStateUsers({ ...stateUsers, [event.target.name]: event.target.checked });
  };

  const [stateTerms, setStateTerms] = useState({
    checkedTerms: false
  });

  const handleChangeTerms = (event) => {
    setStateTerms({ ...stateTerms, [event.target.name]: event.target.checked });
  };

  const [stateDeps, setStateDeps] = useState({
    checkedDeps: false
  });
  const handleChangeDeps = (event) => {
    setStateDeps({ ...stateDeps, [event.target.name]: event.target.checked });
  };
  const [stateCompanys, setStateCompanys] = useState({
    checkedCompanys: false
  });
  const handleChangeCompanys = (event) => {
    setStateCompanys({ ...stateCompanys, [event.target.name]: event.target.checked });
  };
  const [stateRefusal, setStateRefusal] = useState({
    checkedRefusal: false
  });
  const handleChangeRefusal = (event) => {
    setStateRefusal({ ...stateRefusal, [event.target.name]: event.target.checked });
  };
  const [stateApproved, setStateApproved] = useState({
    checkedApproved: false
  });
  const handleChangeApproved = (event) => {
    setStateApproved({ ...stateApproved, [event.target.name]: event.target.checked });
  };
  const [stateDocs, setStateDocs] = useState({
    checkedDocs: false
  });
  const [stateReports, setStateReports] = useState({
    checkedReports: false
  });
  const handleChangeReports = (event) => {
    setStateReports({ ...stateReports, [event.target.name]: event.target.checked });
  };
  const handleChangeDocs = (event) => {
    setStateDocs({ ...stateDocs, [event.target.name]: event.target.checked });
  };

  //Permissões
  const [stateAllDocs, setStateAllDocs] = useState({
    checkedAllDocs: false
  });
  const handleChangeAllDocs = (event) => {
    setStateAllDocs({ ...stateAllDocs, [event.target.name]: event.target.checked });
  };
  const [stateNewUsers, setStateNewUsers] = useState({
    checkedNewUsers: false
  });
  const handleChangeNewUsers = (event) => {
    setStateNewUsers({ ...stateNewUsers, [event.target.name]: event.target.checked });
  };
  const [stateApprovers, setStateApprovers] = useState({
    checkedApprovers: false
  });
  const handleChangeApprovers = (event) => {
    setStateApprovers({ ...stateApprovers, [event.target.name]: event.target.checked });
  };

  async function FindEmail(e, value) {
    e.preventDefault();
    const response = await api.post('finduser', {
      email: value,
      id: location.state.id
    });
    if (response.data === true) {
      setEmail('');
      setDialogText(i18n.t("errors.email_same"));
      setOpen(true);
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  };

  function LimitCNPJ(e) {
    if (e.target.value <= 99999999999999) {
      setOtherCNPJ(e.target.value);
    }
  }


  function otherCNPJValide(e, cnpj) {
    e.preventDefault();
    var ret = validarCNPJ(cnpj.toString().padStart(14, '0'));
    if (ret === false) {
      setOtherCNPJ('');
      setDialogText(i18n.t("errors.error_cnpj_invalid"));
      setOpen(true);
    }
  }

  function validarCNPJ(cnpj) {
    var tamanho;
    var soma;
    var numeros;
    var digitos;
    var pos;
    var resultado;

    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj == '') return false;

    if (cnpj.length != 14)
      return false;

    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
      cnpj == "11111111111111" ||
      cnpj == "22222222222222" ||
      cnpj == "33333333333333" ||
      cnpj == "44444444444444" ||
      cnpj == "55555555555555" ||
      cnpj == "66666666666666" ||
      cnpj == "77777777777777" ||
      cnpj == "88888888888888" ||
      cnpj == "99999999999999")
      return false;

    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0, tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (var i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
        pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
      return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
        pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
      return false;

    setOtherCNPJ(cnpj.toString().padStart(14, '0'))
    return true;
  }


  return (
    <div>
      <Menu />
      <main className={classes.layout}>
        <form onSubmit={SaveUser}>
          <Paper className={classes.paper}>
            <Typography className={classes.typography} align="center">{i18n.t("titles.information")}</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  id="firstName"
                  name="firstName"
                  label={i18n.t("titles.name")}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  fullWidth
                  required
                  autoComplete="given-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="email"
                  name="email"
                  label={i18n.t("tables.email")}
                  value={email}
                  onBlur={e => FindEmail(e, e.target.value)}
                  onChange={e => setEmail(e.target.value)}
                  fullWidth
                  required
                  autoComplete="email"
                />
              </Grid>
              {/* {console.log(company)} */}
              <Grid item xs={12} sm={10}>
                <FormControl fullWidth>
                  <InputLabel id="Empresa">Empresa</InputLabel>
                  <Select
                    labelId="Empresa"
                    id="Empresa"
                    value={company}
                    disabled={stateOther.checkedOther}
                    onChange={e => setCompany(e.target.value)}
                    fullWidth
                    required
                  >
                    <MenuItem key={-1} value={-1}  >Selecione</MenuItem>
                    {
                      CompanyList.map((item, i) => (
                        <MenuItem key={i} value={item.id}>{item.name}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={stateOther.checkedOther}
                      onChange={handleChangeOther}
                      name="checkedOther"
                      color="primary"
                    />
                  }
                  style={{ marginTop: 13 }}
                  label={i18n.t("labels.other")}
                />
              </Grid>
              <Grid item xs={12} style={OtherDisplay}>
                <TextField
                  id="otherCompany"
                  name="otherCompany"
                  label="Empresa"
                  value={otherCompany}
                  onChange={e => setOtherCompany(e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} style={OtherDisplay}>
                <TextField
                  id="otherCNPJ"
                  name="otherCNPJ"
                  label="CNPJ"
                  type='number'
                  value={otherCNPJ}
                  onBlur={e => otherCNPJValide(e, e.target.value)}
                  onChange={e => LimitCNPJ(e)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-autowidth-label">Departamento</InputLabel>
                  <Select
                    labelId="Dep"
                    id="Dep"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    fullWidth
                    required
                  >
                    <MenuItem key={-1} value={-1}  >Selecione</MenuItem>
                    {
                      DepsList.map((item, i) => (
                        <MenuItem key={i} value={item.id}>{item.name}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="cargo"
                  name="cargo"
                  label={i18n.t("labels.office")}
                  value={office}
                  onChange={e => setOffice(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-autowidth-label">{i18n.t("titles.status")}</InputLabel>
                  <Select
                    labelId="Status"
                    id="Status"
                    value={active}
                    disabled={DisableUsers}
                    onChange={e => ChangeActive(e.target.value)}
                    fullWidth
                    required
                  >
                    <MenuItem value={2}>{i18n.t("titles.wait_aproved")}</MenuItem>
                    <MenuItem value={1}>{i18n.t("titles.active")}</MenuItem>
                    <MenuItem value={0}>{i18n.t("titles.desactive")}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>

              </Grid>

              <Button
                variant="contained"
                color="primary"
                onClick={SendPassword}
                disabled={DisableUsers}
                style={SendPasswordDisplay}
                className={classes.submit}
              >
                Enviar senha
            </Button>
          </Grid>

          </Paper>
          <Paper className={classes.paper}>
            <Typography className={classes.typography} align="center">Interfaces</Typography>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Checkbox color="primary" checked={stateAll.checkedAll} onChange={handleChangeAll} name="checkedAll" />}
                  label="Todos"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Checkbox color="primary" checked={stateTerms.checkedTerms} onChange={handleChangeTerms} name="checkedTerms" />}
                  label={i18n.t("terms.text")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Checkbox color="primary" checked={stateUsers.checkedUsers} onChange={handleChangeUsers} name="checkedUsers" />}
                  label="Usuários"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Checkbox color="primary" checked={stateRefusal.checkedRefusal} onChange={handleChangeRefusal} name="checkedRefusal" />}
                  label={i18n.t("titles.reason_refuse")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Checkbox color="primary" checked={stateDeps.checkedDeps} onChange={handleChangeDeps} name="checkedDeps" />}
                  label="Departamento"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Checkbox color="primary" checked={stateApproved.checkedApproved} onChange={handleChangeApproved} name="checkedApproved" />}
                  label={i18n.t("titles.matriz_aprovation")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Checkbox color="primary" checked={stateCompanys.checkedCompanys} onChange={handleChangeCompanys} name="checkedCompanys" />}
                  label="Empresa"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Checkbox color="primary" checked={stateDocs.checkedDocs} onChange={handleChangeDocs} name="checkedDocs" />}
                  label="Tipo de Documento"
                />
              </Grid>
            </Grid>

          </Paper>
          <Paper className={classes.paper}>
            <Typography className={classes.typography} align="center">{i18n.t("titles.permissions")}</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Checkbox color="primary" checked={stateAllDocs.checkedAllDocs} onChange={handleChangeAllDocs} name="checkedAllDocs" />}
                  label={i18n.t("titles.view_documents")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Checkbox color="primary" checked={stateNewUsers.checkedNewUsers} onChange={handleChangeNewUsers} name="checkedNewUsers" />}
                  label={i18n.t("labels.new_users")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Checkbox color="primary" checked={stateReports.checkedReports} onChange={handleChangeReports} name="checkedReports" />}
                  label={i18n.t("titles.generate_reports")}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <FormControlLabel
                    control={<Checkbox color="primary" checked={stateApprovers.checkedApprovers} onChange={handleChangeApprovers} name="checkedApprovers"  />}
                    label="Mudar Aprovadores/Envolvidos"
                />
                </Grid> */}
            </Grid>
          </Paper>
           <div style={ButtonsApprove}>
              <Button
                variant="contained"
                onClick={e => RepproveUser(e, e.target.value)}
                style={{ color: '#FFF', backgroundColor: '#ff1744', marginBottom: 15 }}
                className={classes.submit}
              >
                {i18n.t("buttons.reject")}
              </Button>

              <Button
                variant="contained"
                onClick={e => ApproveUser(e, e.target.value)}
                style={{ color: '#FFF', backgroundColor: '#4caf50', marginLeft: 10, marginBottom: 15 }}
                className={classes.submit}
              >
                {i18n.t("buttons.aproved")}
              </Button>
          </div>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={disableButton}
            className={classes.submit}
            style={ButtonsApprove.display == "none" ? {} : { display: "none" }}
          >
            {i18n.t("buttons.save")}
          </Button>
        </form>
      </main>
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <List>
          <ListItemText style={{ margin: 30 }} primary={DialogText} />
        </List>
      </Dialog>
    </div>
  );

}