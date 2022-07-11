import React, { useState } from 'react';
import { useEffect } from "react";

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

import api from '../../services/api';


//tradução
import i18n from "../../translate/i18n"

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(12)
    },

    margins:{
        marginTop: theme.spacing(3),
    },

    typography: {
        fontSize: 24,
        fontWeight: 300,
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(3),
    },

  }));

export default function Terms() {

    const classes = useStyles();
    const [tituloPT, setTituloPT] = useState('');
    const [descricaoPT, setDescricaoPT] = useState('');
    const [tituloES, setTituloES] = useState('');
    const [descricaoES, setDescricaoES] = useState('');
    const [dialogText, setDialogText] = useState(i18n.t('errors.error_save'));

    const [open, setOpen] = React.useState(false);
    const handleClose = (value) => {
        setOpen(false);
    };

    async function getTerms(){
        const response = await api.get('twotermsofuse');
        setTituloPT(response.data[0].titulo || "");
        setDescricaoPT(response.data[0].descricao || "");
        setTituloES(response.data[1].titulo || "");
        setDescricaoES(response.data[1].descricao || "");
    }

    async function UpdateTerms(e) {
        e.preventDefault();
        try {
            await api.post('termsofuseupdate', {
              tituloPT: tituloPT,
              descricaoPT: descricaoPT,
              tituloES: tituloES,
              descricaoES: descricaoES,
            });
            setDialogText(i18n.t('messagesText.data_saved'));
            setOpen(true);
        } catch (err) {
            setDialogText(i18n.t('errors.error_save'));
            setOpen(true);
        }
    
      }

    useEffect(() => {
        getTerms();
     }, []);

    return (
        <div>
            <Menu/>
            <Container component="main" maxWidth="md">
            
                <form onSubmit={UpdateTerms}>
                <Box
                className={classes.paper}
                boxShadow={3}
                bgcolor="background.paper"
                p={2}
                width={1}
                >
                <Typography align={'center'} className={classes.typography}>{i18n.t('terms.text') + " (Pt-Br)"}</Typography>
                <TextField
                className={classes.margins}
                id="title"
                label={i18n.t('tables.title')}
                multiline
                fullWidth
                variant="outlined"
                value={tituloPT}
                onChange={e => setTituloPT(e.target.value)}
                size="small"
                />
                <TextField
                className={classes.margins}
                id="description"
                label={i18n.t('tables.description')}
                multiline
                fullWidth
                variant="outlined"
                value={descricaoPT}
                rows={20}
                onChange={e => setDescricaoPT(e.target.value)}
                size="small"
                />
                </Box>
            
                <Box
                className={classes.paper}
                boxShadow={3}
                bgcolor="background.paper"
                p={2}
                width={1}
                >
                <Typography align={'center'} className={classes.typography}>{i18n.t('terms.text') + " (Es-ES)"}</Typography>
                <TextField
                className={classes.margins}
                id="title"
                label={i18n.t('tables.title')}
                multiline
                fullWidth
                variant="outlined"
                value={tituloES}
                onChange={e => setTituloES(e.target.value)}
                size="small"
                />
                <TextField
                className={classes.margins}
                id="description"
                label={i18n.t('tables.description')}
                multiline
                fullWidth
                variant="outlined"
                value={descricaoES}
                rows={20}
                onChange={e => setDescricaoES(e.target.value)}
                size="small"
                />
                </Box>
                
                <Button
                className={classes.margins}
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                >
                    {i18n.t('buttons.save')}
                </Button>
                </form>
            
            </Container>

            <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <List>
                <ListItemText style={{margin:30}} primary={dialogText} />
            </List>
            </Dialog>
        </div>
    );
    
}