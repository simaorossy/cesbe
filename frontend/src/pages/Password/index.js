import React, { useState } from 'react';
import Menu from '../Menu';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';

import { useHistory } from 'react-router-dom';

import api from '../../services/api';

//tradução
import i18n from "../../translate/i18n"

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(20),
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
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(3),
    },

}));

export default function Password() {

    const classes = useStyles();
    const [oldPass, setOldPass] = useState('');
    const [NewPass, setNewPass] = useState('');
    const [NewPassV, setNewPassV] = useState('');
    const [dialogText, setDialogText] = useState(i18n.t("errors.error_save"));
    const history = useHistory();

    const [open, setOpen] = React.useState(false);

    const handleClose = (value) => {
        if (dialogText === i18n.t("messagesText.login_update")) {
            history.push({
                pathname: '/dashboard',
                state: { name: localStorage.getItem('Username'), }
            });
        }
        setOpen(false);
    };

    async function UpdatePassword(e) {
        e.preventDefault();
        if (NewPass !== NewPassV) {
            setDialogText(i18n.t("messagesText.pass_different"));
            setOpen(true);
        } else if (NewPass === '' || NewPass === undefined) {
            setDialogText(i18n.t("messagesText.old_pass"));
            setOpen(true);
        } else if (NewPass === '' || NewPass === undefined || NewPassV === '' || NewPassV === undefined) {
            setDialogText(i18n.t("messagesText.digit_pass"));
            setOpen(true);
        } else {
            try {
                const response = await api.post('password', {
                    id: localStorage.getItem('id'),
                    oldPass: oldPass,
                    NewPass: NewPass,
                    NewPassV: NewPassV
                });
                if (response.data === 1) {
                    setDialogText(i18n.t("messagesText.login_update"));
                } else {
                    setDialogText(i18n.t("messagesText.pass_incorrect"));
                }
                setOpen(true);
            } catch (error) {
                console.log(error);
                setDialogText(i18n.t("errors.error_save"));
                setOpen(true);
            }
        }
    }

    return (
        <div>
            <Menu />
            <Container component="main" maxWidth="sm">

                <Box
                    className={classes.paper}
                    boxShadow={3}
                    bgcolor="background.paper"
                    p={2}
                    width={1}
                >

                    <Typography className={classes.typography}>{i18n.t("messagesText.alter_pass")}</Typography>
                    <form onSubmit={UpdatePassword}>
                        <TextField
                            className={classes.margins}
                            id="oldPass"
                            label={i18n.t("messagesText.old_pass")}
                            fullWidth
                            variant="outlined"
                            value={oldPass}
                            type="password"
                            onChange={e => setOldPass(e.target.value)}
                            size="small"
                        />

                        <TextField
                            className={classes.margins}
                            id="NewPass"
                            label={i18n.t("messagesText.new_pass")}
                            fullWidth
                            variant="outlined"
                            value={NewPass}
                            type="password"
                            onChange={e => setNewPass(e.target.value)}
                            size="small"
                        />

                        <TextField
                            className={classes.margins}
                            id="NewPass"
                            label={i18n.t("messagesText.new_pass_again")}
                            fullWidth
                            variant="outlined"
                            value={NewPassV}
                            type="password"
                            onChange={e => setNewPassV(e.target.value)}
                            size="small"
                        />

                        <Button
                            className={classes.margins}
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            {i18n.t("buttons.alter")}
                        </Button>
                    </form>
                </Box>
            </Container>
            <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
                <List>
                    <ListItemText style={{ margin: 30 }} primary={dialogText} />
                </List>
            </Dialog>
        </div>
    );

}