import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
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
  }));

export default function Register() {

    const classes = useStyles();
    const history = useHistory();
    
    const [email, setEmail] = useState('');
    const [DialogText, setDialogText] = useState(i18n.t("errors.error_recover_pass"));
    
    const [open, setOpen] = React.useState(false);
    const handleClose = (value) => {
      setOpen(false);
      if(DialogText === i18n.t("messagesText.email_send_recover")){
        history.push({
          pathname: '/'
        });
      }      
    };

    async function RecoverPassword(e){
        e.preventDefault();
        try {
          const response = await api.post('userrecover',{
            email: email
          })
          if(response.data == "Nada"){
            setDialogText(i18n.t("messagesText.email_not_found"));
            setOpen(true);
          }else if(response.data[0].status === 1){
              //Recuperação de senha
              await api.post('notifyrecoverpassword', {
              Email : email,
              language: i18n.language
              });
              setDialogText(i18n.t("messagesText.email_send_recover"));
              setOpen(true);
            }else{
              setDialogText(i18n.t("messagesText.wait_aproved"));
              setOpen(true);
            }
        } catch (err) { 
            setOpen(true);
        }
    }

    return (
        <div>
        <main className={classes.layout}>
            <form onSubmit={RecoverPassword}>
            <Paper className={classes.paper}>
            <Typography className={classes.typography} align="center"><img src={Logo} width={150} alt="CESBE S.A Logo" /></Typography>
            <Typography className={classes.typography} style={{marginTop:50}} align="center">{i18n.t("tables.email_send")}</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
              <TextField
                  id="email"
                  name="email"
                  label="E-mail"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  fullWidth
                  required
                  autoComplete="email"
              />
              </Grid>
            </Grid>
            </Paper>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
            >
                Enviar
            </Button>
            </form>
        </main>
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
          <List>
              <ListItemText style={{margin:30}} primary={DialogText} />
          </List>
        </Dialog>
        </div>
    );
    
}