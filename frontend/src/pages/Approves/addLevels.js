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

const steps = [i18n.t("titles.information"), i18n.t("titles.users"), i18n.t("titles.level_aprovation")];

export default function ApproveLevels() {

  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();

  const [data] = useState([]);

  const [state, setState] = React.useState({
    columns: [
      { title: i18n.t("titles.code"), field: 'id', hidden: true },
      { title: i18n.t("titles.level"), field: 'level', lookup: location.state.levels },
      { title: 'SLA (Horas)', field: 'sla', type: 'numeric', validate: rowData => rowData.sla > 9999 ? { isValid: false, helperText: 'SLA muito grande' } : true, },
    ],
    data: data,
  });

  const [open, setOpen] = React.useState(false);
  const [DialogText, setDialogText] = useState("Erro!");

  const [Levels, setLevels] = useState();

  const [Users, setUsers] = useState();

  const handleClose = (value) => {
    setOpen(false);
    console.log(DialogText);
    console.log(i18n.t("messagesText.success_message"));
    if (DialogText === i18n.t("messagesText.success_message")) {
      history.push({
        pathname: '/approves',
        state: { name: localStorage.getItem('Username') }
      });
    }
  };

  useEffect(() => {
    getUsers();
    getAllSla();
    try {
    } catch (error) {
      console.log(error);
    }
  }, []);

  async function getUsers() {
    const response = await api.get('usersactives');
    setUsers(response.data);
  }

  async function getAllSla() {
    const res = await api.post('/approveusers', {
        id: location.state.id
    });
    if (res.data[0]) {
        const resp = await api.post('getlevels', {
            id: res.data[0].approve
        });
        setState({
          columns: [
            { title: i18n.t("titles.code"), field: 'id', hidden: true },
            { title: i18n.t("titles.level"), field: 'level', lookup: location.state.levels },
            { title: 'SLA (Horas)', field: 'sla', type: 'numeric', validate: rowData => rowData.sla > 9999 ? { isValid: false, helperText: 'SLA muito grande' } : true, },
          ],
          data: resp.data,
        });
    }
  };

  async function Finish(e) {
    e.preventDefault();
    if (Levels !== undefined) {

      await api.post('deleteapprovelevels', {
        id: location.state.id
      });

      for (let index = 0; index < Levels.length; index++) {
        try {
          await api.post('addapprovelevels', {
            level: Levels[index].level,
            sla: Levels[index].sla,
            approve: location.state.id
          });
        } catch (err) {
          setDialogText(i18n.t("errors.error.save"));
          setOpen(true);
        }
      }
      setDialogText(i18n.t("messagesText.success_message"));
      setOpen(true);

    } else {
      setDialogText(i18n.t("messagesText.success_message"));
      setOpen(true);
    }
  }

  function GoBack(e) {
    e.preventDefault();
    history.push({
      pathname: '/approvesaddusers',
      state: { name: localStorage.getItem('Username'), id: location.state.id, users: Users }
    });
  }

  function FindLevels(name) {
    var ret = 0;
    for (let index = 0; index < Levels.length; index++) {
      var level = Levels[index].level;
      if (level === name) {
        ret = 1;
      }
    }
    return ret
  }

  return (
    <div>
      <Menu />
      <form onSubmit={Finish}>
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography className={classes.typography} align="center">{i18n.t("titles.matriz_aprovation")}</Typography>
            <Stepper activeStep={2} className={classes.stepper}>
              {steps.map((label) => (
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
                searchPlaceholder: i18n.t("placeholders.search")
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
            editable={{
              onRowAdd: (newData) =>
                new Promise((resolve) => {
                  setTimeout(() => {
                    resolve();
                    setState((prevState) => {
                      const data = [...prevState.data];
                      if (Levels !== undefined) {
                        var response = FindLevels(newData.level);
                        if (response === 1) {
                          setDialogText(i18n.t("messagesText.level_already_registred"));

                          setOpen(true);
                        } else {
                          if (newData.sla === parseInt(newData.sla)) {
                            data.push(newData);
                            setLevels(data);
                          } else {
                            setDialogText(i18n.t("messagesText.sla_number_integer"));
                            setOpen(true);
                          }
                        }
                      } else {
                        if (newData.sla === parseInt(newData.sla)) {
                          data.push(newData);
                          setLevels(data);
                        } else {
                          setDialogText(i18n.t("messagesText.sla_number_integer"));
                          setOpen(true);
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
                      setState((prevState) => {
                        const data = [...prevState.data];
                        if (Levels !== undefined) {
                          var response = FindLevels(newData.level);
                          if (response === 1) {
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
                    setState((prevState) => {
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
              {i18n.t("buttons.save")}
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