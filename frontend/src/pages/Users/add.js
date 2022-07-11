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

export default function UserAdd() {

  const location = useLocation();
  const [username, setUsername] = useState('Nenhum');
  const [DepsList, setDepsList] = useState([]);
  const [CompanyList, setCompanysList] = useState([]);
  const [DialogText, setDialogText] = useState(i18n.t("errors.error_register"));
  const history = useHistory();

  const [open, setOpen] = React.useState(false);
  const handleClose = (value) => {
    setOpen(false);
    if (DialogText !== i18n.t("messagesText.email_same") && DialogText !== i18n.t("errors.error_cnpj")) {
      history.push({
        pathname: '/users',
        state: { name: username }
      });
    }
  };

  async function getDeps() {
    const response = await api.get('departmentsactives');
    setDepsList(response.data);
  }
  async function getCompany() {
    const response = await api.get('companysactives');
    setCompanysList(response.data);
  }

  useEffect(() => {
    try {
      getDeps();
      getCompany();
      setUsername(localStorage.getItem('Username'));
    } catch (error) {
      console.log(error);
    }
  }, [location]);

  async function SaveUser(e) {
    e.preventDefault();
    const validate = validarCNPJ(otherCNPJ.padStart(14,'0'));

    if(validate){
      if (stateOther.checkedOther === true && otherCompany === '' && otherCNPJ === '' || stateOther.checkedOther === true && otherCompany === '' || stateOther.checkedOther === true && otherCNPJ === '') {
        setDialogText(i18n.t("errors.required_cnpj"));
        setOpen(true);
      } else {
        try {
          let u = await api.post('adduser', {
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
            otherCNPJ: otherCNPJ.padStart(14,'0'),
            otherCompany: otherCompany,
            reports: stateReports.checkedReports,
          });
  
  
          // if(active === 1){
          //   //Conta aprovada
          //   await api.post('nofityapproved', {
          //     Email : email,
          //     language : i18n.language
          //   });
          // }
  
          await setDialogText(i18n.t("messagesText.register_success"));
          await setOpen(true);
  
        } catch (err) {
          setOpen(true);
        }
      }
    }else{
      setOtherCNPJ('');
      setDialogText(i18n.t("errors.error_cnpj"));
      setOpen(true);
    }
   
  }

  const classes = useStyles();

  //Infos
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState(1);
  const [department, setDepartment] = useState(1);
  const [office, setOffice] = useState('');

  const [otherCNPJ, setOtherCNPJ] = useState('');
  const [otherCompany, setOtherCompany] = useState('');

  const [disableButton, setDisableButton] = useState(false);
  const [OtherDisplay, setOtherDisplay] = useState({ display: "none" });

  const [stateOther, setStateOther] = useState({
    checkedOther: false
  });
  const [active, setActive] = useState(1);

  const handleChangeOther = (event) => {
    setStateOther({ ...stateOther, [event.target.name]: event.target.checked });

    if (stateOther.checkedOther === false) {
      setOtherDisplay({});
    } else {
      setOtherDisplay({ display: "none" });
      setOtherCNPJ('');
      setOtherCompany('');
    }

  };

  //Interfaces
  const [stateAll, setStateAll] = useState({
    checkedAll: false
  });
  const handleChangeAll = (event) => {
    setStateAll({ ...stateAll, [event.target.name]: event.target.checked });
    setStateUsers({ ...stateUsers, checkedUsers: event.target.checked });
    setStateDeps({ ...stateUsers, checkedDeps: event.target.checked });
    setStateCompanys({ ...stateUsers, checkedCompanys: event.target.checked });
    setStateRefusal({ ...stateUsers, checkedRefusal: event.target.checked });
    setStateApproved({ ...stateUsers, checkedApproved: event.target.checked });
    setStateDocs({ ...stateUsers, checkedDocs: event.target.checked });
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
  const [stateReports, setStateReports] = useState({
    checkedReports: false
  });
  const handleChangeReports = (event) => {
    //console.log("Event  : ", event.target.checked)
    setStateReports({ ...stateReports, [event.target.name]: event.target.checked });
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
      email: value
    });
    if (response.data === true) {
      setEmail('');
      setDialogText(i18n.t("errors.error_email_exist"));
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
    var ret = validarCNPJ(cnpj.toString().padStart(14,'0'));
    if (ret === false) {
      setOtherCNPJ('');
      setDialogText(i18n.t("errors.error_cnpj"));
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
                    {
                      DepsList.map((item, i) => (
                        <MenuItem key={i} value={item.id}>{item.name}</MenuItem>
                      ))
                    }
                    {/* <MenuItem value={1}>RH</MenuItem>
              <MenuItem value={2}>Financeiro</MenuItem>
              <MenuItem value={3}>Comercial</MenuItem> */}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="cargo"
                  name="cargo"
                  label={i18n.t("tables.office")}
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
                    onChange={e => setActive(e.target.value)}
                    fullWidth
                    required
                  >
                    {/* <MenuItem value={2}>Aguardando Aprovação</MenuItem> */}
                    <MenuItem value={1}>{i18n.t("labels.active")}</MenuItem>
                    <MenuItem value={0}>{i18n.t("labels.inactive")}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
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
            <Typography className={classes.typography} align="center">Permissões</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Checkbox color="primary" checked={stateAllDocs.checkedAllDocs} onChange={handleChangeAllDocs} name="checkedAllDocs" />}
                  label={i18n.t("labels.see_documents")}
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={disableButton}
            className={classes.submit}
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