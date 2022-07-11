import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Logon from './pages/Logon';
import Register from './pages/Register';
import TermsOfUse from './pages/TermsOfUse';
import Departments from './pages/Departments';
import Companys from './pages/Companys';
import Recover from './pages/Recover';
import Dashboard from './pages/Dashboard';
import DashboardDetails from './pages/DashboardDetails';
import Users from './pages/Users';
import UsersEdit from './pages/Users/edit.js';
import UsersAdd from './pages/Users/add.js';
import Password from './pages/Password';
import Refusals from './pages/Refusals';
import Documents from './pages/Documents';
import Approves from './pages/Approves';
import ApprovesAdd from './pages/Approves/add';
import ApprovesAddLevels from './pages/Approves/addLevels';
import ApprovesAddUsers from './pages/Approves/addUsers';
import ApprovesAddUsersCopy from './pages/Approves/addUsersCopys';
import SendDocuments from './pages/SendDocuments';
import ReadDocument from './pages/ReadDocument';
import Filter from './pages/Filter';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Logon} />
                <Route path="/register" component={Register} />
                <Route path="/termsofuse" component={TermsOfUse} />
                <Route path="/departments" component={Departments} />
                <Route path="/companys" component={Companys} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/dashboarddetails" component={DashboardDetails} />
                <Route path="/users" component={Users} />
                <Route path="/usersedit" component={UsersEdit} />
                <Route path="/usersadd" component={UsersAdd} />
                <Route path="/recover" component={Recover} />
                <Route path="/password" component={Password} />
                <Route path="/refusals" component={Refusals} />
                <Route path="/documents" component={Documents} />
                <Route path="/approves" component={Approves} />
                <Route path="/approvesadd" component={ApprovesAdd} />
                <Route path="/approvesaddlevels" component={ApprovesAddLevels} />
                <Route path="/approvesaddusers" component={ApprovesAddUsers} />
                <Route path="/approvesadduserscopy" component={ApprovesAddUsersCopy} />
                <Route path="/senddocuments" component={SendDocuments} />
                <Route path="/readdocument/:id" component={ReadDocument} />
                <Route path="/filter" component={Filter} />
            </Switch>
        </BrowserRouter>
    );
}