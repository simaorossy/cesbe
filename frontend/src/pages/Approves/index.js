import React, { useState } from 'react';
import { useEffect } from "react";

import Menu from '../Menu';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MaterialTable from 'material-table';
import { useHistory } from 'react-router-dom';
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

    margins:{
        margin: theme.spacing(1),
    },

    typography: {
        fontSize: 24,
        fontWeight: 300,
        marginBottom: theme.spacing(3),
    },

  }));

export default function Approves() {

    const classes = useStyles();
    const dataR = [];
    const [data] = useState([]); 
    const [open, setOpen] = React.useState(false);
    const [DialogText, setDialogText] = useState("Erro!");
    
    const handleClose = (value) => {
        setOpen(false);
    };

    async function getApproves(){
        const response = await api.get('approves');
        for (let index = 0; index < response.data.length; index++) {
            dataR.push(response.data[index]);
        }
        new Promise((resolve) => {
            setTimeout(() => {
            resolve();
            setState((prevState) => {
                const data = [...prevState.data];
                for (let index = 0; index < dataR.length; index++) {
                    data.push({id: dataR[index].id, name: dataR[index].name, status: dataR[index].status,  typedoc: dataR[index].typedoc});
                }
                return { ...prevState, data };
            });
            }, 600);
        })
    }

    const history = useHistory();
    const [username, setUsername] = useState('Nenhum');

    async function DeleteApprover(id){
        try {
            
            await api.post('deleteapprove', {
                id: id
            });
            
            await api.post('deleteapprovelevels', {
                id: id
            });

            await api.post('deleteapproveusers', {
                id: id
            });

        } catch (err) {
            setDialogText(i18n.t("errors.error_delete"));
            setOpen(true);
        }
    }

    useEffect(() => {
        try {
            getApproves();
            setUsername(localStorage.getItem('Username'));
        } catch (error) {
            console.log(error);
        }
     }, []);

    const [state, setState] = React.useState({
        columns: [
          { title: 'id', field: 'id', hidden: true, export: false, filtering: false },
          { title: i18n.t('titles.name'), field: 'name', filtering: false },
          { title: i18n.t('titles.status'), field: 'status', lookup: { 0: i18n.t("labels.inactive"), 1: i18n.t("labels.active") }, defaultFilter: ['1'] },
          { title: i18n.t('titles.type_document'), field: 'typedoc', hidden: true, export: true, filtering: false },
        ],
        data: data,
    });

    return (
        <div>
            <Menu/>
            <Container component="main">
            <div className={classes.paper}>
                <Typography variant="body1" style={{marginBottom:30, fontSize:25, fontWeight: 200}}>{i18n.t("titles.matriz_aprovation")}</Typography>
                
                <MaterialTable
                style={{width:'90%'}}
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
                            saveTooltip:  i18n.t("toolstips.save"),
                        } 
                    },
                    toolbar: {
                        searchTooltip: 'Pesquisar',
                        searchPlaceholder:i18n.t("placeholders.search"),
                        exportTitle: 'Exportar',
                    },
                    pagination: {
                        labelRowsSelect:i18n.t("pagination.line"),
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
                options={{
                    exportButton: true,
                    filtering: true
                }}
                actions={[
                    {
                      icon: 'add',
                      tooltip:i18n.t("toolstips.add") ,
                      isFreeAction: true,
                      onClick: (event) =>  history.push({
                        pathname: '/approvesadd',
                        state: { name: username }
                        })
                    },
                    {
                        icon: 'edit',
                        tooltip: i18n.t("toolstips.edit"),
                        onClick: (event, rowData) => history.push({
                            pathname: '/approvesadd',
                            state: { name: username, id: rowData.id }
                        })
                    }
                ]}
                // onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow.tableData.id))}
                // options={{
                //     rowStyle: rowData => ({
                //       color: (selectedRow === rowData.tableData.id) ? '#F00' : '#000'
                //     })
                // }}
                title=""
                columns={state.columns}
                data={state.data}
                editable={{
                    // onRowUpdate: (newData, oldData) =>
                    // new Promise((resolve) => {
                    //     setTimeout(() => {
                    //     resolve();
                    //     if (oldData) {
                    //         setState((prevState) => {
                    //         const data = [...prevState.data];
                    //         data[data.indexOf(oldData)] = newData;
                    //         return { ...prevState, data };
                    //         });
                    //     }
                    //     }, 600);
                    // }),
                    onRowDelete: (oldData) =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                        resolve();
                        setState((prevState) => {
                            const data = [...prevState.data];
                            DeleteApprover(oldData.id);
                            data.splice(data.indexOf(oldData), 1);
                            return { ...prevState, data };
                        });
                        }, 600);
                    }),}}
                />

            </div> 
            <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
                <List>
                    <ListItemText style={{margin:30}} primary={DialogText} />
                </List>
            </Dialog>
            </Container>
        </div>
    );
    
}