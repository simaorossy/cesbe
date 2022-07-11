import React, { useState } from 'react';
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import MaterialTable from 'material-table';

import Menu from '../Menu';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';

import api from '../../services/api';


//tradução
import i18n from '../../translate/i18n'


import { useHistory } from 'react-router-dom';

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
      marginBottom: theme.spacing(3),
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
    marginBottom: theme.spacing(3),
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

export default function ApproveUsers() {

  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();

  const [data] = useState([]);
  const [Users, setUsers] = useState([]);

  var UsersList = location.state.users.reduce(function (acc, cur, i) {
    acc[cur.id] = cur.name;
    return acc;
  }, {});

  const [state, setState] = React.useState({
    columns: [
      // { title: 'Código', field: 'id', hidden: true },
      { title: i18n.t('titles.name'), field: 'id', lookup: UsersList, editable: 'never' },
      { title:i18n.t('tables.email') , field: 'email', editable: 'never' },
      { title: i18n.t('titles.level'), field: 'level', defaultSort: 'asc', lookup: { 99:  i18n.t("tables.select_standart"), 0:  i18n.t("tables.in_copy"), 1: i18n.t("tables.level")+ ' 1', 2: i18n.t("tables.level")+ ' 2', 3: i18n.t("tables.level")+ ' 3', 4: i18n.t("tables.level")+ ' 4', 5: i18n.t("tables.level")+ ' 5', 6: i18n.t("tables.level")+ ' 6', 7: i18n.t("tables.level")+ ' 7', 8: i18n.t("tables.level")+ ' 8', 9: i18n.t("tables.level")+ ' 9', 10: i18n.t("tables.level")+ ' 10' } },
      { title: i18n.t('titles.matriz'), field: 'approve', hidden: true },
    ],
    data: data,
  });

  const [open, setOpen] = React.useState(false);
  const [DialogText, setDialogText] = useState("Erro!");
  const [Level, setLevel] = useState();
  const handleClose = (value) => {
    setOpen(false);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  async function getAllUsers() {

    const res = await api.post('approveusers', {
      id: location.state.id
    });

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
      setLevel(parseInt(level));
    }

    setState({
      columns: [
        // { title: 'Código', field: 'id', hidden: true },
        { title: i18n.t('titles.name'), field: 'id', lookup: UsersList, editable: 'never' },
        { title: i18n.t('tables.email'), field: 'email', editable: 'never' },
        { title: i18n.t('titles.level'), field: 'level', defaultSort: 'asc', lookup: { 99: i18n.t("tables.select_standart"), 0:  i18n.t("tables.in_copy"), 1: i18n.t("tables.level")+ ' 1', 2: i18n.t("tables.level")+ ' 2', 3: i18n.t("tables.level")+ ' 3', 4: i18n.t("tables.level")+ ' 4', 5: i18n.t("tables.level")+ ' 5', 6: i18n.t("tables.level")+ ' 6', 7: i18n.t("tables.level")+ ' 7', 8: i18n.t("tables.level")+ ' 8', 9: i18n.t("tables.level")+ ' 9', 10: i18n.t("tables.level")+ ' 10' } },
        { title: i18n.t('titles.matriz'), field: 'approve', hidden: true },
      ],
      data: response.data,
    });
  };

  async function GoUsersCopy(e) {
    e.preventDefault();

    const data = Users;
    data.splice(data, data.length);

    for (let index = 0; index < state.data.length; index++) {
      if (state.data[index].level !== 99 && state.data[index].level !== "99") {
        data.push(state.data[index]);
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
          Levels.push({ id: Users[x].level, name: "Nível" + Users[x].level });
        }
      }

      var obj = {};

      for (var i = 0, len = Levels.length; i < len; i++)
        obj[Levels[i]['name']] = Levels[i];

      Levels = [];

      for (var key in obj)
        Levels.push(obj[key]);

      var LevelsList = Levels.reduce(function (acc, cur, i) {
        acc[cur.id] = cur.name;
        return acc;
      }, {});

      await api.post('deleteapproveusers', {
        id: location.state.id
      });

      for (let index = 0; index < Users.length; index++) {
        try {
          await api.post('addapproveusers', {
            id: Users[index].id,
            level: Users[index].level,
            approve: location.state.id
          });

          history.push({
            pathname: '/approvesaddlevels',
            state: { name: localStorage.getItem('Username'), id: location.state.id, levels: LevelsList }
          });
        } catch (err) {
          setDialogText('Erro!');
          setOpen(true);
        }
      }
    }
  }

  function GoBack(e) {
    e.preventDefault();
    history.push({
      pathname: '/approvesadd',
      state: { name: localStorage.getItem('Username'), id: location.state.id }
    });
  }

  return (
    <div>
      <Menu />
      <form onSubmit={GoUsersCopy}>
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography className={classes.typography} align="center">{i18n.t("titles.matriz_aprovation")}</Typography>
            <Stepper activeStep={1} className={classes.stepper}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>

          <MaterialTable
            cellEditable={{
              onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
                return new Promise((resolve, reject) => {
                  if (Level === undefined) {
                    if (newValue == 1 || newValue == 0) {
                      setLevel(parseInt(newValue));
                      rowData.level = newValue;
                    } else {
                      setDialogText(i18n.t("messagesText.register_sequence"));
                      setOpen(true);
                    }
                  } else {
                    if (newValue > Level + 1 && newValue > 1 && newValue < 99) {
                      setDialogText(i18n.t("messagesText.register_sequence"));
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
                searchPlaceholder: 'Pesquisar',
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
                actions: i18n.t("tables.actions")
              }
            }}
            title=""
            columns={state.columns}
            data={state.data}
          />

          <div className={classes.buttons}>
            <Button
              className={classes.button}
              onClick={GoBack}
            >
            {i18n.t("buttons.back")}
            </Button>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              className={classes.button}
            >
             {i18n.t("buttons.next")}
            </Button>
          </div>
        </main>
      </form>
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <List>
          <ListItemText style={{ margin: 30 }} primary={DialogText} />
        </List>
      </Dialog>
    </div>
  );

}