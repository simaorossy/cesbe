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
import i18n from '../../translate/i18n'

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

export default function Companys() {

    const classes = useStyles();
    const dataR = [];
    const [data] = useState([]);

    const [open, setOpen] = React.useState(false);
    const [DialogText, setDialogText] = useState("Erro!");
    const handleClose = (value) => {
        setOpen(false);
        if (DialogText === i18n.t('messagesText.alrealy_update_enterprise') || i18n.t('messagesText.alrealy_register_enterprise')) {
            getCompanys();
        }
    };

    async function getCompanys() {
        const response = await api.get('companys');
        for (let index = 0; index < response.data.length; index++) {
            dataR.push(response.data[index]);
        }
        new Promise((resolve) => {
            setTimeout(() => {
                resolve();
                setState((prevState) => {
                    const data = [];
                    for (let index = 0; index < dataR.length; index++) {
                        data.push({ id: dataR[index].id, name: dataR[index].name, cnpj: dataR[index].cnpj, status: dataR[index].status });
                    }
                    return { ...prevState, data };
                });
            }, 600);
        })
    }

    async function DeleteCompany(id) {
        try {
            await api.post('deletecompany', {
                id: id,
            });
        } catch (err) {
            setDialogText(i18n.t("errors.error_delete"));
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

    async function UpdateCompany(id, cnpj, name, status) {
        const res = validarCNPJ(cnpj.toString().padStart(14, '0'));
        if (res === false) {
            setDialogText(i18n.t("errors.error_cnpj_invalid"));
            setOpen(true);
        } else {
            const response = await api.post('findcompany', {
                id: id,
                name: name,
                cnpj: cnpj
            });

            if (response.data === true) {
                setDialogText(i18n.t("errors.error_alrealy_enterprise"));
                setOpen(true);
            } else {
                try {
                    cnpj = cnpj.toString().padStart(14, '0');
                    await api.post('updatecompany', {
                        id: id,
                        cnpj: cnpj ,
                        name: name,
                        status: status
                    });
                    setDialogText(i18n.t("messagesText.alrealy_update_enterprise"));
                    setOpen(true);
                } catch (err) {
                    setDialogText(i18n.t("errors.error_update_enterprise"));
                    setOpen(true);
                }
            }
        }
    }

    async function AddCompany(cnpj, name, status) {

        const res = validarCNPJ(cnpj.toString().padStart(14, '0'));
        if (res === false) {
            setDialogText(i18n.t("errors.error_cnpj_invalid"));
            setOpen(true);
        } else {
            const response = await api.post('findcompany', {
                id: 0,
                name: name,
                cnpj: cnpj
            });

            if (response.data === true) {
                setDialogText(i18n.t("errors.error_alrealy_enterprise"));
                setOpen(true);
            } else {
                try {
                    await api.post('addcompany', {
                        cnpj: cnpj.toString().padStart(14, '0'),
                        name: name,
                        status: status
                    });
                    setDialogText(i18n.t("messagesText.alrealy_register_enterprise"));
                    setOpen(true);
                } catch (err) {
                    setDialogText(i18n.t("errors.error_register"));
                    setOpen(true);
                }
            }
        }
    }

    useEffect(() => {
        try {
            getCompanys();
        } catch (error) {
            console.log(error);
        }
    }, []);

    const [state, setState] = React.useState({
        columns: [
            { title: 'id', field: 'id', hidden: true, export: false, filtering: false },
            { title: i18n.t('titles.name'), field: 'name', filtering: false, validate: rowData => rowData.name === '' ? { isValid: false, helperText: 'O nome não pode ser vazio' } : true, },
            { title: i18n.t('titles.cnpj'), field: 'cnpj', type: 'numeric', filtering: false },
            { title: i18n.t('titles.status'), field: 'status', lookup: { 0: i18n.t("labels.inactive"), 1: i18n.t("labels.active") }, defaultFilter: ['1'] },
        ],
        data: data,
    });

    return (
        <div>
            <Menu />
            <Container component="main">
                <div className={classes.paper}>
                    <Typography variant="body1" style={{ marginBottom: 30, fontSize: 25, fontWeight: 200 }}>{i18n.t('titles.enterprise')}</Typography>

                    <MaterialTable
                        style={{ width: '90%' }}
                        localization={{
                            body: {
                                deleteTooltip: i18n.t('toolstips.delete'),
                                editTooltip: i18n.t('toolstips.edit'),
                                filterRow: {
                                    filterTooltip: 'Filtro'
                                },
                                addTooltip: i18n.t('toolstips.add'),
                                emptyDataSourceMessage: i18n.t('messagesText.never_register'),
                                editRow: {
                                    deleteText: i18n.t('messagesText.confirm_delete'),
                                    cancelTooltip: i18n.t('toolstips.cancel'),
                                    saveTooltip: i18n.t('toolstips.save'),
                                }
                            },
                            toolbar: {
                                searchTooltip: 'Pesquisar',
                                searchPlaceholder: i18n.t("placeholders.search"),
                                exportTitle: 'Exportar',
                                exportName: 'Exportar para Excel'
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
                        // actions={[
                        //     {
                        //       icon: 'add',
                        //       tooltip: 'Adicionar',
                        //       isFreeAction: true,
                        //       onClick: (event) => alert("Tela de cadastro")
                        //     },
                        //     {
                        //         icon: 'edit',
                        //         tooltip: 'Editar',
                        //         onClick: (event, rowData) => alert("Editar: " + rowData.name)
                        //       }
                        // ]}

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
                                            if (newData.cnpj === '' || newData.cnpj === undefined) {
                                                setDialogText(i18n.t("errors.error_cnpj_format"));
                                                setOpen(true);
                                            } else {
                                                if (newData.name === '' || newData.status === '' || newData.name === undefined || newData.status === undefined) {
                                                    setDialogText(i18n.t("errors.error_cnpj_required"));
                                                    setOpen(true);
                                                } else {
                                                    AddCompany(newData.cnpj, newData.name, newData.status);
                                                    data.push(newData);
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
                                                data[data.indexOf(oldData)] = newData;
                                                UpdateCompany(newData.id, newData.cnpj, newData.name, newData.status);
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
                                            DeleteCompany(oldData.id);
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