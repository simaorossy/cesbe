import React, { useState } from 'react';
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Menu from '../Menu';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';  

import { useHistory } from 'react-router-dom';
import api from '../../services/api';


//tradução
import i18n from '../../translate/i18n'

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
      },
      layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        marginTop: theme.spacing(14),
        [theme.breakpoints.up(700 + theme.spacing(2) * 2)]: {
          width: 700,
          marginLeft: 'auto',
          marginRight: 'auto',
        },
      },
      paper: {
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

const steps = [i18n.t('titles.information'), i18n.t('titles.users'), i18n.t('titles.level_aprovation')];

export default function ApproveAdd() {

    const history = useHistory();
    const classes = useStyles();
    const location = useLocation();

    //Infos
    const [name, setName] = useState('');
    const [typeDocument, setTypeDocument] = useState(1);
    const [typeDocumentList, setTypeDocumentList] = useState([]);
    const [active, setActive] = useState(1);
    
    const [disableButton, setDisableButton] = useState(false);

    const [open, setOpen] = React.useState(false);
    const [DialogText, setDialogText] = useState("Erro!");
    
    const [Users, setUsers] = useState();
    
    const handleClose = (value) => {
        setOpen(false);
    };

    useEffect(() => {
      try {
        getUsers();
        getTypeDocs();
        if(location.state.id > 0){
          getApprove();
        }
      } catch (error) {
          console.log(error);
      } 
    }, []);

    async function getUsers(){
      const response = await api.get('usersactives');
      setUsers(response.data);
    }

    async function getApprove(){
      const response = await api.post('approve', {
          id: location.state.id
      });
      const Res = [response.data];
      setName(Res[0][0].name);
      setTypeDocument(Res[0][0].typedoc);
      setActive(Res[0][0].status);
    }

    async function getTypeDocs(){
      const response = await api.get('docsactives');
      setTypeDocumentList(response.data);
    } 

    async function SaveApprove(e){
      e.preventDefault();

      if(location.state.id > 0){
        try {
          await api.post('editapprove', {
            id : location.state.id,
            name : name,
            typeDoc : typeDocument,
            active: active,
          });
          GoUsers();
        } catch (err) {
          setDialogText(i18n.t("errors.error_edit"));
          setOpen(true);
        }
      }else{
        const response = await api.post('findapprove', {
          name: name
        });
        if(response.data === true){
          setName('');
          setDialogText(i18n.t("errors.exist_matriz"));
          setOpen(true);
          setDisableButton(true);
        }else{
          try {
            await api.post('addapprove', {
              name : name,
              typeDoc : typeDocument,
              active: active,
            });
            GoUsers();
          } catch (err) {
            setDialogText(i18n.t("errors.error_save"));
            setOpen(true);
          }
        }
      }
    }

    async function GoUsers(){
      const response = await api.post('approveId', { name : name });
      history.push({
        pathname: '/approvesaddusers',
        state: { name: localStorage.getItem('Username'), id: response.data[0].id, users: Users, data: [] }
      });
    }

    async function FindApprove(e, value){
      e.preventDefault();
      const response = await api.post('findapprove', {
        name: value
      });
      if(response.data === true){
        setName('');
        setDialogText(i18n.t("errors.exist_matriz"));
        setOpen(true);
        setDisableButton(true);
      }else{
        setDisableButton(false);
      }
    };

    return (
        <div>
        <Menu/>
          <form onSubmit={SaveApprove}>
            <main className={classes.layout}>
        <Paper className={classes.paper}>
        <Typography className={classes.typography} align="center">{i18n.t("titles.matriz_aprovation")}</Typography>
          <Stepper activeStep={0} className={classes.stepper}>
            {steps.map((label) => (
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
                label={i18n.t('labels.name')}
                value={name}
                onBlur={e => FindApprove(e, e.target.value)}
                onChange={e => setName(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={9}>
            <FormControl fullWidth>
            <InputLabel id="Empresa">{i18n.t('titles.type_document')}</InputLabel>
            <Select
              labelId="Doc"
              id="Doc"
              value={typeDocument}
              onChange={e => setTypeDocument(e.target.value)}
              fullWidth
              required
            >
              {
              typeDocumentList.map((item, i)=>(
                <MenuItem key={i} value={item.id}>{item.name}</MenuItem>
              ))
              }
            </Select>
          </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-autowidth-label">{i18n.t('titles.status')}</InputLabel>
                <Select
                  labelId="Status"
                  id="Status"
                  value={active}
                  onChange={e => setActive(e.target.value)}
                  fullWidth
                  required
                >
                  <MenuItem value={1}>{i18n.t('titles.active')}</MenuItem>
                  <MenuItem value={0}>{i18n.t('titles.desactive')}</MenuItem>
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
              className={classes.button}
            >
            {i18n.t("buttons.next")}
            </Button>
          </div>
        </Paper>
        </main>
          </form>
          <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
                <List>
                    <ListItemText style={{margin:30}} primary={DialogText} />
                </List>
          </Dialog>
        </div>
    );
    
}