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
import i18n from '../../translate/i18n';

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

export default function Users() {

    const classes = useStyles();
    const dataR = [];
    const [data] = useState([]); 
    const [open, setOpen] = React.useState(false);
    const [DialogText, setDialogText] = useState("Erro!");
    const [StatusApprove, setStatusApprove] = useState(false);
    
    const handleClose = (value) => {
        setOpen(false);
    };

    async function getUsers(){
        const response = await api.get('users');
        for (let index = 0; index < response.data.length; index++) {
            dataR.push(response.data[index]);
        }
        console.log(dataR)
        new Promise((resolve) => {
            setTimeout(() => {
            resolve();
            setState((prevState) => {
                const data = [];
                for (let index = 0; index < dataR.length; index++) {
                    data.push({id: dataR[index].id, name: dataR[index].name, email: dataR[index].email, company: dataR[index].company,
                        office: dataR[index].office,
                        department: dataR[index].department,
                        status: dataR[index].status,
                        other_company: dataR[index].other_company,
                        other_cnpj: dataR[index].other_cnpj,
                        in_users: dataR[index].in_users,
                        in_refusal: dataR[index].in_refusal,
                        in_document: dataR[index].in_document,
                        in_approved: dataR[index].in_approved,
                        in_companys: dataR[index].in_companys,
                        in_deps: dataR[index].in_deps,
                        per_docs: dataR[index].per_docs,
                        per_users: dataR[index].per_users,
                        per_approved: dataR[index].per_approved,});
                        if(dataR[index].status == 2){
                            if(localStorage.getItem('per_users') == 1){
                                setDialogText(i18n.t("messagesText.users_pendent"));
                                setOpen(true);
                            }
                        }
                    }
                return { ...prevState, data };
            });
            }, 600);
        })
    }

    const history = useHistory();
    const [username, setUsername] = useState('Nenhum');

    async function DeleteUser(id, status, email){

        const response = await api.post('finduserdelete', {
            id: id
        });

        if (response.data === true && status === 0){
            setDialogText(i18n.t("messagesText.users_not_exclude"));
            setOpen(true);
            getUsers();
        }else if (response.data === true){
            setDialogText(i18n.t("messagesText.users_inactive"));
            setOpen(true);
            await api.post('updatestatus', {
                email: email,
                status: 0
            });
            getUsers();
        }else{
            setDialogText('OK');
            setOpen(true);
            await api.post('deleteuser', {
                id: id
            });
        }
    }

    useEffect(() => {
        try {
            getUsers();
            setUsername(localStorage.getItem('Username'));
        } catch (error) {
            console.log(error);
        }
     }, []);

    var StatusFilter;
    
    if(localStorage.getItem('per_users') == 1){
        StatusFilter = ['2', '1'];
    }else{
        StatusFilter = ['1'];
    }

    const [state, setState] = React.useState({
        columns: [
          { title: 'id', field: 'id', hidden: true, export: false, filtering: false },
          { title: i18n.t("tables.name"), field: 'name', filtering: false },
          { title: i18n.t("tables.email"), field: 'email', filtering: false  },
          { title: 'Empresa', field: 'company', filtering: false , hidden:false},
          { title:  i18n.t("tables.office"), field: 'office', hidden: true, export: true },
          { title: 'Departamento', field: 'department', hidden: true, export: true },
          { title:  i18n.t("tables.status"), field: 'status', export: true, defaultSort: 'asc', defaultFilter: StatusFilter, lookup: { '0': i18n.t("labels.inactive"), '1': i18n.t("labels.active"), '2': i18n.t("status.wait_aproved") } },
          { title: 'Empresa', field: 'other_company', hidden:true , export: true },
          { title: 'CNPJ', field: 'other_cnpj', hidden: true, export: true },
          { title: i18n.t("tables.user"), field: 'in_users', hidden: true, export: true, lookup: { 0: i18n.t("tables.without_access"), 1: i18n.t("tables.with_access")} },
          { title: i18n.t("tables.reason_refused"), field: 'in_refusal', hidden: true, export: true, lookup: { 0: i18n.t("tables.without_access"), 1: i18n.t("tables.with_access") } },
          { title: i18n.t("tables.types_documents"), field: 'in_document', hidden: true, export: true, lookup: { 0: i18n.t("tables.without_access"), 1: i18n.t("tables.with_access") } },
          { title: i18n.t("tables.matriz_aprovation"), field: 'in_approved', hidden: true, export: true, lookup: { 0: i18n.t("tables.without_access"), 1: i18n.t("tables.with_access") } },
          { title: 'Empresas', field: 'in_companys', hidden: true, export: true, lookup: { 0: i18n.t("tables.without_access"), 1: i18n.t("tables.with_access") } },
          { title: 'Departamentos', field: 'in_deps', hidden: true, export: true, lookup: { 0: i18n.t("tables.without_access"), 1: i18n.t("tables.with_access") } },
          { title:  i18n.t("tables.see_document"), field: 'per_docs', hidden: true, export: true, lookup: { 0: i18n.t("tables.no"), 1: i18n.t("tables.yes") } },
          { title:  i18n.t("tables.new_users"), field: 'per_users', hidden: true, export: true, lookup: { 0: i18n.t("tables.no"), 1: i18n.t("tables.yes") } },
          { title: i18n.t("tables.change_aprovers"), field: 'per_approved', hidden: true, export: true, lookup: { 0: i18n.t("tables.no"), 1: i18n.t("tables.yes") } },
        ],
        data: data,
    });

    return (
        <div>
            <Menu/>
            <Container component="main">
            <div className={classes.paper}>
                <Typography variant="body1" style={{marginBottom:30, fontSize:25, fontWeight: 200}}>Usuários</Typography>
                
                <MaterialTable
                style={{minWidth: 700}}
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
                        actions: i18n.t("titles.actions"),
                    }
                }}
                actions={[
                    {
                      icon: 'add',
                      tooltip: i18n.t("toolstips.add"),
                      isFreeAction: true,
                      onClick: (event) =>  history.push({
                        pathname: '/usersadd',
                        state: { name: username }
                        })
                    },
                    {
                        icon: 'edit',
                        tooltip: 'Editar',
                        onClick: (event, rowData) => history.push({
                            pathname: '/usersedit',
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
                options={{
                    exportButton: true,
                    filtering: true
                  }}
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
                                DeleteUser(oldData.id, oldData.status, oldData.email);
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