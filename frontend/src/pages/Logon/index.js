import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';

import Logo from '../../assets/logo.svg';

import api from '../../services/api';
import { useHistory } from 'react-router-dom';

//parte para traduzir a pagina 
//tradução
import i18n  from "../../translate/i18n"

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  idioma: {
    margin: theme.spacing(2),
  },

}));

export default function Logon() {
  const classes = useStyles();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [auth, setAuth] = useState(false);
  const history = useHistory();

  const [open, setOpen] = React.useState(false);
  const [DialogText, setDialogText] = useState(i18n.t("messagesText.login_failed"));
  const handleClose = (value) => {
    setOpen(false);
  };

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await api.post('sessions', {
        email: email,
        password: password
      });
      if (response.data[0].status === 1) {

        localStorage.setItem('id', response.data[0].id);
        localStorage.setItem('in_users', response.data[0].in_users);
        localStorage.setItem('in_terms', response.data[0].in_terms);
        localStorage.setItem('in_refusal', response.data[0].in_refusal);
        localStorage.setItem('in_document', response.data[0].in_document);
        localStorage.setItem('in_approved', response.data[0].in_approved);
        localStorage.setItem('in_companys', response.data[0].in_companys);
        localStorage.setItem('in_deps', response.data[0].in_deps);
        localStorage.setItem('per_users', response.data[0].per_users);
        localStorage.setItem('per_docs', response.data[0].per_docs);
        localStorage.setItem('per_report', response.data[0].per_report);
        localStorage.setItem('first_login', response.data[0].first_login);
        
        history.push({
          pathname: '/dashboard',
          state: { name: response.data[0].name }
        });
      }
      else {
        setDialogText("Usuário inativo ou aguardando aprovação!");
        setOpen(true);
      }
    } catch (err) {
      setDialogText(i18n.t("messagesText.login_failed"));
      setPassword('');
      //setDialogText("Não foi possível conectar-se ao banco de dados!");
      setOpen(true);
    }

  }

  const changeLanguage = (l) =>{
      localStorage.setItem('i18nextLng',l);
    window.location = window.location;
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <img src={Logo} width={200} alt="CESBE S.A Logo" />

        <form className={classes.form} onSubmit={handleLogin}>

          <TextField
            size="small"
            variant="outlined"
            margin="normal"
            fullWidth
            label="Usuário"
            value={email}
            autoComplete="email"
            onChange={e => setEmail(e.target.value)}
            autoFocus
          />

          <TextField
            size="small"
            variant="outlined"
            margin="normal"
            fullWidth
            label="Senha"
            value={password}
            autoComplete="current-password"
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
          <Grid container>
            <Grid item xs>
              <Link href="/recover" variant="body2">
                {/* Esqueci minha senha */}
                {i18n.t('titles.recover_pass')}
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                 {i18n.t('titles.create_account')}
              </Link>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
             {i18n.t('buttons.signIn')}
          </Button>

        </form>

        <ButtonGroup
          className={classes.idioma}
          variant="text"
          size="small"
        >
          <Button  onClick={() => changeLanguage('pt-BR')}>Português</Button>
          <Button onClick={() => changeLanguage('es-ES')} >Espanhol</Button>
        </ButtonGroup>

      </div>
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <List>
          <ListItemText style={{ margin: 30 }} primary={DialogText} />
        </List>
      </Dialog>
    </Container>
  );

}