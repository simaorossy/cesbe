import React, { useState } from 'react';
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import clsx from 'clsx';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/Drawer';

//Icones
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AttachFileIcon from '@material-ui/icons/AttachFile';
//import SettingsIcon from '@material-ui/icons/Settings';
import PeopleIcon from '@material-ui/icons/People';
import BusinessIcon from '@material-ui/icons/Business';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import LockIcon from '@material-ui/icons/Lock';
import DescriptionIcon from '@material-ui/icons/Description';
import BlockIcon from '@material-ui/icons/Block';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import Filter from '@material-ui/icons/FindInPage';
import { useHistory } from 'react-router-dom';

import Logo from '../../assets/logoHorizontal.svg';

//tradução
import i18n from "../../translate/i18n"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    list: {
        width: 270,
    },
    fullList: {
        width: 'auto',
    },
}));

export default function Menu(props) {

    const location = useLocation();
    const history = useHistory();
    const [username, setUsername] = useState('Nenhum');
    const [id] = useState();

    const [DisableDepartments, setDisableDepartments] = useState({});
    const [DisableCompanys, setDisableCompanys] = useState({});
    const [DisableDocuments, setDisableDocuments] = useState({});
    const [DisableRefusals, setDisableRefusals] = useState({});
    const [DisableApprove, setDisableApprove] = useState({});
    const [DisableUsers, setDisableUsers] = useState({});
    const [DisableTerms, setDisableTerms] = useState({});
    const [DisableReports, setDisableReports] = useState({})

    function getDisabled() {
        if (localStorage.getItem('in_users') == 0) { setDisableUsers({ display: "none" }); }
        if (localStorage.getItem('in_terms') == 0) { setDisableTerms({ display: "none" }); }
        if (localStorage.getItem('in_refusal') == 0) { setDisableRefusals({ display: "none" }); }
        if (localStorage.getItem('in_document') == 0) { setDisableDocuments({ display: "none" }); }
        if (localStorage.getItem('in_approved') == 0) { setDisableApprove({ display: "none" }); }
        if (localStorage.getItem('in_companys') == 0) { setDisableCompanys({ display: "none" }); }
        if (localStorage.getItem('in_deps') == 0) { setDisableDepartments({ display: "none" }); }
        if (localStorage.getItem('per_report') == 0) { setDisableReports({ display: "none" }); }
    };

    useEffect(() => {
        try {
            setUsername(location.state.name);
            getDisabled();
            
            localStorage.setItem('Username', location.state.name);
        } catch (error) {
            history.push('/');
        }
    }, [location]);

    //Style
    const classes = useStyles();

    //Drawer
    const [state, setState] = React.useState({
        right: false,
    });
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };
    const list = (anchor) => (
        <div
            className={clsx(classes.list, {
                [classes.fullList]: anchor === 'top' || anchor === 'bottom',
            })}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            {/* <List>
              <ListItem button key="Process">
                <ListItemIcon><SettingsIcon color="primary"/></ListItemIcon>
                <ListItemText primary="Processos em execução" />
              </ListItem>
            </List> */}
            <Divider />
            <List>
                <ListItem button key="Terms" onClick={Terms} style={DisableTerms}>
                    <ListItemIcon><AttachFileIcon color="primary" /></ListItemIcon>
                    <ListItemText primary={i18n.t("terms.text")} />
                </ListItem>
                <ListItem button key="Departments" onClick={Departments} style={DisableDepartments}>
                    <ListItemIcon><GroupWorkIcon color="primary" /></ListItemIcon>
                    <ListItemText primary={i18n.t("titles.depart")} />
                </ListItem>
                <ListItem button key="Companys" onClick={Companys} style={DisableCompanys}>
                    <ListItemIcon><BusinessIcon color="primary" /></ListItemIcon>
                    <ListItemText primary={i18n.t("titles.companies")} />
                </ListItem>
                <ListItem button key="Documents" onClick={Documents} style={DisableDocuments}>
                    <ListItemIcon><DescriptionIcon color="primary" /></ListItemIcon>
                    <ListItemText primary={i18n.t("titles.types_documents")} />
                </ListItem>
                <ListItem button key="Refusals" onClick={Refusals} style={DisableRefusals}>
                    <ListItemIcon><BlockIcon color="primary" /></ListItemIcon>
                    <ListItemText primary={i18n.t("titles.reason_refuse")} />
                </ListItem>
                <ListItem button key="Approve" onClick={Approve} style={DisableApprove}>
                    <ListItemIcon><AssignmentTurnedInIcon color="primary" /></ListItemIcon>
                    <ListItemText primary={i18n.t("titles.matriz_aprovation")} />
                </ListItem>
                <ListItem button key="Users" onClick={Users} style={DisableUsers}>
                    <ListItemIcon><PeopleIcon color="primary" /></ListItemIcon>
                    <ListItemText primary={i18n.t("titles.user")} />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button key="change" onClick={Filters} style={DisableReports}  >
                    <ListItemIcon><Filter color="primary" /></ListItemIcon>
                    <ListItemText primary={i18n.t("tables.reports")} />
                </ListItem> 
                <ListItem button key="change" onClick={Password}>
                    <ListItemIcon><LockIcon color="primary" /></ListItemIcon>
                    <ListItemText primary={i18n.t("titles.change_pass")} />
                </ListItem>
                <ListItem button key="Logout" onClick={Logout}>
                    <ListItemIcon><ExitToAppIcon color="primary" /></ListItemIcon>
                    <ListItemText primary={i18n.t("titles.quit")} />
                </ListItem>
            </List>
        </div>
    );

    //Dashboard
    function Dashboard(e) {
        e.preventDefault();
        history.push({
            pathname: '/dashboard',
            state: { name: username }
        });
    }

    //Logout
    function Logout(e) {
        e.preventDefault();
        localStorage.clear();
        history.push('/');
    }

    //Terms
    function Terms(e) {
        e.preventDefault();
        history.push({
            pathname: '/termsofuse',
            state: { name: username }
        });
    }

    //Departments
    function Departments(e) {
        e.preventDefault();
        history.push({
            pathname: '/departments',
            state: { name: username }
        });
    }

    //Companys
    function Companys(e) {
        e.preventDefault();
        history.push({
            pathname: '/companys',
            state: { name: username }
        });
    }

    //Documents
    function Documents(e) {
        e.preventDefault();
        history.push({
            pathname: '/documents',
            state: { name: username }
        });
    }

    //Refusals
    function Refusals(e) {
        e.preventDefault();
        history.push({
            pathname: '/refusals',
            state: { name: username }
        });
    }

    //Approve
    function Approve(e) {
        e.preventDefault();
        history.push({
            pathname: '/approves',
            state: { name: username }
        });
    }

    //Users
    function Users(e) {
        e.preventDefault();
        history.push({
            pathname: '/users',
            state: { name: username }
        });

    }//Password
    function Password(e) {
        e.preventDefault();
        history.push({
            pathname: '/password',
            state: { name: username, id: id }
        });
    }

    function Filters(e) {
        e.preventDefault();
        history.push({
            pathname: '/filter',
            state: { name: username, id: id }
        })
    }

    return (
        <div className={classes.root}>
            <AppBar>
                <Toolbar style={{ backgroundColor: '#FFF' }}>
                    <Grid container
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                    >

                        <Grid item>
                            <Button aria-haspopup="true">
                                <img src={Logo} width={200} alt="CESBE S.A Logo" onClick={Dashboard} />
                            </Button>
                        </Grid>

                    </Grid>
                    <Grid container
                        direction="row"
                        justify="flex-end"
                        alignItems="center"
                    >
                      
                        <Grid item>
                            <Button aria-haspopup="true">
                                {username}
                            </Button>
                        </Grid>

                        <Grid item>
                            <React.Fragment key="right">
                                <Button onClick={toggleDrawer("right", true)}><MenuIcon color="primary" /></Button>
                                <Drawer anchor={"right"} open={state["right"]} onClose={toggleDrawer("right", false)}>
                                    {list("right")}
                                </Drawer>
                            </React.Fragment>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </div>
    );

}