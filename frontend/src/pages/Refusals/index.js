import React, { useState } from 'react';
import { useEffect } from "react";

import Menu from '../Menu';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MaterialTable from 'material-table';
import Typography from '@material-ui/core/Typography';

import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';

import api from '../../services/api';


//tradução
import i18n from "../../translate/i18n"

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(14),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

    margins: {
        margin: theme.spacing(1),
    },

    typography: {
        fontSize: 24,
        fontWeight: 300,
        marginBottom: theme.spacing(3),
    },

}));

export default function Refusals() {

    const classes = useStyles();
    const dataR = [];
    const [data] = useState([]);

    const [open, setOpen] = React.useState(false);
    const [DialogText, setDialogText] = useState("Erro!");
    const handleClose = (value) => {
        setOpen(false);
        if (DialogText === i18n.t("messagesText.reason_refused_update") || i18n.t("messagesText.reason_refused_register")) {
            getRefusals();
        }
    };

    async function getRefusals() {
        const response = await api.get('refusals');
        for (let index = 0; index < response.data.length; index++) {
            dataR.push(response.data[index]);
        }
        new Promise((resolve) => {
            setTimeout(() => {
                resolve();
                setState((prevState) => {
                    const data = [];
                    for (let index = 0; index < dataR.length; index++) {
                        data.push({ id: dataR[index].id, nome: dataR[index].name, status: dataR[index].status });
                    }
                    return { ...prevState, data };
                });
            }, 600);
        })
    }
    async function DeleteRefusal(id) {
        try {
            await api.post('deleterefusal', {
                id: id
            });
        } catch (err) {
            setDialogText(i18n.t("errors.error_delete"));
            setOpen(true);
        }
    }
    async function UpdateRefusal(id, name, status) {
        const response = await api.post('findrefusal', {
            id: id,
            name: name,
        });
        if (response.data === true) {
            setDialogText(i18n.t("messagesText.reason_refused_same"));
            setOpen(true);
        } else {
            try {
                await api.post('updaterefusal', {
                    id: id,
                    name: name,
                    status: status
                });
                setDialogText(i18n.t("messagesText.reason_refused_update"));
                setOpen(true);
            } catch (err) {
                setDialogText(i18n.t("errors.error_update"));
                setOpen(true);
            }
        }
    }
    async function AddRefusal(name, status) {
        const response = await api.post('findrefusal', {
            id: 0,
            name: name,
        });
        if (response.data === true) {
            setDialogText(i18n.t("messagesText.reason_refused_same"));
            setOpen(true);
        } else {
            try {
                await api.post('addrefusal', {
                    name: name,
                    status: status
                });
                setDialogText(i18n.t("messagesText.reason_refused_register"));
                setOpen(true);
            } catch (err) {
                setDialogText(i18n.t("messagesText.reason_refused_error"));
                setOpen(true);
            }
        }
    }

    useEffect(() => {
        try {
            getRefusals();
        } catch (error) {
            console.log(error);
        }
    }, []);

    const [state, setState] = React.useState({
        columns: [
            { title: i18n.t("tables.code"), field: 'id', hidden: true, export: false, filtering: false },
            { title: i18n.t("tables.name"), field: 'nome', filtering: false, validate: rowData => rowData.nome === '' ? { isValid: false, helperText: 'O nome não pode ser vazio' } : true, },
            { title: i18n.t("tables.status"), field: 'status', lookup: { 0: i18n.t("labels.inactive"), 1: i18n.t("labels.active") }, defaultFilter: ['1'] },
        ],
        data: data,
    });

    return (
        <div>
            <Menu />
            <Container component="main">
                <div className={classes.paper}>

                    <Typography variant="body1" style={{ marginBottom: 30, fontSize: 25, fontWeight: 200 }}>{i18n.t("tables.reason_refused")}</Typography>
                    <MaterialTable
                        style={{ width: '90%' }}
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
                                actions: i18n.t("titles.actions")
                            }
                        }}
                        title=""
                        columns={state.columns}
                        data={state.data}
                        options={{
                            exportButton: true,
                            filtering: true
                        }}
                        editable={{
                            onRowAdd: (newData) =>
                                new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve();
                                        setState((prevState) => {
                                            const data = [...prevState.data];
                                            if (newData.nome === '' || newData.status === '' || newData.nome === undefined || newData.status === undefined) {
                                                setDialogText(i18n.t("messagesText.fields_required"));
                                                setOpen(true);
                                            } else {
                                                AddRefusal(newData.nome, newData.status);
                                                data.push(newData);
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
                                                data[data.indexOf(oldData)] = newData;
                                                UpdateRefusal(newData.id, newData.nome, newData.status);
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
                                            DeleteRefusal(oldData.id);
                                            data.splice(data.indexOf(oldData), 1);
                                            return { ...prevState, data };
                                        });
                                    }, 600);
                                }),
                        }}
                    />
                </div>
                <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
                    <List>
                        <ListItemText style={{ margin: 30 }} primary={DialogText} />
                    </List>
                </Dialog>
            </Container>
        </div>
    );

}