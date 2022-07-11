import React, { useState } from 'react';
import { useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';

import Logo from '../../assets/logo.svg';
import api from '../../services/api';


//tradução
import i18n from "../../translate/i18n"

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
  descricao: {
    fontSize: 16,
    fontWeight: 300,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  List: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
  },
}));

export default function Register() {

  const classes = useStyles();
  const history = useHistory();

  //Infos
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emails] = useState([]);
  const [names] = useState([]);
  const [company, setCompany] = useState(-1);
  const [department, setDepartment] = useState(-1);
  const [DepsList, setDepsList] = useState([]);
  const [CompanyList, setCompanysList] = useState([]);
  const [office, setOffice] = useState('');

  const [otherCNPJ, setOtherCNPJ] = useState('');
  const [otherCompany, setOtherCompany] = useState('');

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [DialogText, setDialogText] = useState(i18n.t("errors.error_register"));
  const [disableButton, setDisableButton] = useState(false);
  const [OtherDisplay, setOtherDisplay] = useState({ display: "none" });
  const [stateOther, setStateOther] = useState({
    checkedOther: false
  });

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

  const [stateTerms, setStateTerms] = useState({
    checkedTerms: false
  });

  const handleChangeTerms = (event) => {
    setStateTerms({ ...stateTerms, [event.target.name]: event.target.checked });
  };

  const [open, setOpen] = React.useState(false);
  const handleClose = (value) => {
    setOpen(false);
    if (DialogText === i18n.t("messagesText.register_success")) {
      history.push({
        pathname: '/',
        state: {}
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

  async function getTerms() {
    const response = await api.post('termsofuse', { language: i18n.language });
    setTitulo(response.data[0].titulo);
    setDescricao(response.data[0].descricao);
  }

  async function getUsersApprovers() {
    const response = await api.get('usersapprovers');
    for (let index = 0; index < response.data.length; index++) {
      emails.push(response.data[index].email);
      names.push(response.data[index].name);
    }
  }

  async function FindEmail(e, value) {
    e.preventDefault();
    const response = await api.post('finduser', {
      email: value
    });
    if (response.data === true) {
      setEmail('');
      setDialogText(i18n.t("messagesText.email_same"));
      setOpen(true);
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  };

  useEffect(() => {
    try {
      getDeps();
      getCompany();
      getTerms();
      getUsersApprovers();
    } catch (error) {
      console.log(error);
    }
  }, []);

  async function RegisterUser(e) {
    e.preventDefault();
    const response = await api.post('finduser', {
      email: email
    });
    if (response.data === true) {
      setEmail('');
      setDialogText(i18n.t("messagesText.email_same"));
      setOpen(true);
      setDisableButton(true);
    } else {
      setDisableButton(false);
      if (stateTerms.checkedTerms === false) {
      setDialogText(i18n.t("messagesText.accept_term"));
      setOpen(true);
      } else {
      if (stateOther.checkedOther === true && otherCompany === '' && otherCNPJ === '' || stateOther.checkedOther === true && otherCompany === '' || stateOther.checkedOther === true && otherCNPJ === '') {
        setDialogText(i18n.t("messagesText.required_cnpj"));
        setOpen(true);
      } else {
        try {
          await api.post('register', {
            Name: name,
            Email: email,
            Company: company,
            Department: department,
            Office: office,
            Other: stateOther.checkedOther,
            otherCNPJ: otherCNPJ,
            otherCompany: otherCompany
          });

          var Comp;
          if (stateOther.checkedOther === true) {
            Comp = otherCompany
          } else {
            Comp = company
          };

          await api.post('notifyregister', {
            email: email,
            language: i18n.language
          })

          for (let index = 0; index < emails.length; index++) {
            await api.post('notifyapprovers', {
              email: emails[index],
              name: names[index],
              user: name,
              company: Comp,
              language: i18n.language
            })
          }

          setDialogText(i18n.t("messagesText.register_success"));
          setOpen(true);
        } catch (err) {
          setOpen(true);
        }
      }
    }
    }
  }

  function LimitCNPJ(e) {
    if (e.target.value <= 99999999999999) {
      setOtherCNPJ(e.target.value);
    }
  }

  function otherCNPJValide(e, cnpj) {
    e.preventDefault();
    var ret = validarCNPJ(cnpj);
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
      <main className={classes.layout}>
        <form onSubmit={RegisterUser}>
          <Paper className={classes.paper}>
            <Typography className={classes.typography} align="center"><img src={Logo} width={150} alt="CESBE S.A Logo" style={{cursor: "pointer"}} onClick={e => history.push({pathname: '/', state: {}})}/></Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  id="firstName"
                  name="firstName"
                  label="Nome"
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
                  label="E-mail"
                  value={email}
                  onBlur={e => FindEmail(e, e.target.value)}
                  onChange={e => setEmail(e.target.value)}
                  fullWidth
                  required
                  autoComplete="email"
                />
              </Grid>
              {/* <Grid item xs={12} sm={10}>
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
              </Grid> */}
              {/* <Grid item xs={12} sm={2}>
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
                  label="Outra"
                />
              </Grid> */}

              {/* <Grid item xs={12} style={OtherDisplay}>
                <TextField
                  id="otherCompany"
                  name="otherCompany"
                  label="Empresa"
                  value={otherCompany}
                  onChange={e => setOtherCompany(e.target.value)}
                  fullWidth
                />
              </Grid> */}

              {/* <Grid item xs={12} style={OtherDisplay}>
                <TextField
                  id="otherCNPJ"
                  name="otherCNPJ"
                  label="CNPJ"
                  type='number'
                  max={1}
                  value={otherCNPJ}
                  onBlur={e => otherCNPJValide(e, e.target.value)}
                  onChange={e => LimitCNPJ(e)}
                  fullWidth
                />
              </Grid> */}

              {/* <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-autowidth-label">{i18n.t("titles.depart")}</InputLabel>
                  <Select
                    labelId="Dep"
                    id="Dep"
                    value={department}
                    required
                    onChange={e => setDepartment(e.target.value)}
                    fullWidth
                  >
                    {
                      DepsList.map((item, i) => (
                        <MenuItem key={i} value={item.id}>{item.name}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid> */}
              <Grid item xs={12}>
                <TextField
                  id="cargo"
                  name="cargo"
                  label="Cargo"
                  value={office}
                  required
                  onChange={e => setOffice(e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper className={classes.paper}>
            <Grid item xs={12}>
              <Typography className={classes.typography} align="center">{titulo}</Typography>
              <Typography className={classes.descricao} align="center">{descricao}</Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={stateTerms.checkedTerms}
                    onChange={handleChangeTerms}
                    name="checkedTerms"
                    color="primary"
                  />
                }
                style={{ marginTop: 13 }}
                label={i18n.t("tables.accept_term")}
              />
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
            Cadastrar
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