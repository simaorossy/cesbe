const express = require('express');
const { celebrate, Segments, Joi} = require('celebrate');

const SessionCrontroller = require('./controllers/SessionController');
const TermsController = require('./controllers/TermsController');
const DepsController = require('./controllers/DepsController');
const CompanysController = require('./controllers/CompanysController');
const UsersController = require('./controllers/UsersController');
const DocsController = require('./controllers/DocsController');
const RefusalController = require('./controllers/RefusalController');
const ApproveController = require('./controllers/ApproveController');
const NotifyController = require('./controllers/NotifyController');
const SendController = require('./controllers/SendController');
const FilterController = require('./controllers/FilterController');


const routes = express.Router();

routes.post('/sessions', SessionCrontroller.Login);

routes.get('/twotermsofuse', TermsController.All);
routes.post('/termsofuse', TermsController.Read);
routes.post('/termsofuseupdate', TermsController.Update);

//Departments
routes.get('/departments', DepsController.Read);
routes.post('/adddepartment', DepsController.Add);
routes.post('/updatedepartment', DepsController.Update);
routes.post('/deletedepartment', DepsController.Delete);

routes.get('/departmentsactives', DepsController.ReadActives);
routes.post('/finddepartment', DepsController.Find);

//Companys
routes.get('/companys', CompanysController.Read);
routes.post('/addcompany', CompanysController.Add);
routes.post('/updatecompany', CompanysController.Update);
routes.post('/deletecompany', CompanysController.Delete);

routes.get('/companysactives', CompanysController.ReadActives);
routes.post('/findcompany', CompanysController.Find);

//Users
routes.get('/users', UsersController.Read);
routes.post('/adduser', UsersController.Add);
routes.post('/edituser', UsersController.Edit);
routes.post('/deleteuser', UsersController.Delete);

routes.get('/usersactives', UsersController.ReadActives);
routes.get('/usersapprovers', UsersController.UsersApprovers);
routes.post('/userssend', UsersController.UsersSend);
routes.post('/alluserssend', UsersController.AllUsersSend);
routes.post('/userscopysend', UsersController.UsersCopySend);
routes.post('/user', UsersController.ReadUser);
routes.post('/finduser', UsersController.Find);
routes.post('/finduserdelete', UsersController.FindDelete);
routes.post('/register', UsersController.Register);
routes.post('/password', UsersController.Password);
routes.post('/updatestatus', UsersController.UpdateStatus);
routes.post('/userrecover', UsersController.Recover);
routes.post('/getfistlogin', UsersController.FistLogin);

//Docs
routes.get('/docs', DocsController.Read);
routes.post('/adddoc', DocsController.Add);
routes.post('/updatedoc', DocsController.Update);
routes.post('/deletedoc', DocsController.Delete);

routes.get('/docsactives', DocsController.ReadActives);
routes.post('/finddoc', DocsController.Find);


//Refusals
routes.get('/refusals', RefusalController.Read);
routes.get('/refusalsactives', RefusalController.ReadActives);
routes.post('/addrefusal', RefusalController.Add);
routes.post('/updaterefusal', RefusalController.Update);
routes.post('/deleterefusal', RefusalController.Delete);

routes.post('/findrefusal', RefusalController.Find);

//Approves
routes.get('/approves', ApproveController.Read);
routes.get('/approvesactives', ApproveController.ReadActives);
routes.post('/addapprove', ApproveController.Add);
routes.post('/deleteapprove', ApproveController.Delete);

routes.post('/approveId', ApproveController.GetId);
routes.post('/findapprove', ApproveController.Find);
routes.post('/approve', ApproveController.ReadApprove);
routes.post('/approvelevels', ApproveController.ApproveLevels);
routes.post('/approveusers', ApproveController.ApproveUsers);
routes.post('/approveallusers', ApproveController.ApproveAllUsers);

routes.post('/deleteapprovelevels', ApproveController.DeleteLevels);
routes.post('/deleteapproveusers', ApproveController.DeleteUsers);
routes.post('/deleteapproveuserscopy', ApproveController.DeleteUsersCopy);

routes.post('/editapprove', ApproveController.EditApprove);

routes.post('/addapprovelevels', ApproveController.AddLevels);
routes.post('/addapproveusers', ApproveController.AddUsers);

//Notify
routes.post('/notifyapprovers', NotifyController.Approvers);
routes.post('/notifysend', NotifyController.Send);
routes.post('/notifysendstatus', NotifyController.SendStatus);
routes.post('/notifycopysapprovedsend', NotifyController.CopysApprovedSend);
routes.post('/notifycopyslastapprovedsend', NotifyController.CopysLastApprovedSend);
routes.post('/notifylastapprovedsend', NotifyController.LastApprovedSend);
routes.post('/notifycopysrejectedsend', NotifyController.CopysRejectedSend);
routes.post('/notifyrejectedsend', NotifyController.RejectedSend);
routes.post('/notifycopysnewsend', NotifyController.CopysNewSend);
routes.post('/notifyrecoverpassword', NotifyController.Recover);
routes.post('/notifyregister', NotifyController.Register);
routes.post('/nofityapproved', NotifyController.Approved);

//Upload
routes.post('/upload', SendController.Upload);
routes.post('/duplicateupload', SendController.duplicateUpload);
routes.post('/delete', SendController.Delete);
routes.post('/createpdf', SendController.CreatePDF);

//Sends
routes.post('/getOneSend', SendController.GetSend);


routes.post('/sends', SendController.Read);
routes.post('/getsends', SendController.GetSends);
routes.get('/getallsends', SendController.GetAllSends);
routes.post('/sendadd', SendController.Add);
routes.post('/sendfilesadd', SendController.FilesAdd);
routes.post('/sendhistory', SendController.SaveHistory);
routes.post('/sendlevels', SendController.SaveLevels);
routes.post('/sendupdate', SendController.Update);
routes.post('/changeapprover', SendController.ChangeApprovers);
routes.post('/sendapprovers', SendController.SaveApprovers);
routes.post('/senddeleteapprovers', SendController.DeleteApprovers);
routes.post('/senddeletecopys', SendController.DeleteCopys);
routes.post('/sendgethistory', SendController.GetHistory);
routes.post('/sendgetapprovers', SendController.GetApprovers);
routes.post('/sendgetdocs', SendController.GetDocs);
routes.post('/sendgettoken', SendController.GetToken);
routes.post('/merge', SendController.Merge);
routes.post('/lastlevel', SendController.LastLevel);
routes.post('/getcreator', SendController.Creator);
routes.post('/getsendlevel', SendController.SendLevel);
routes.post('/getlevels', SendController.GetLevel);

//Filter

routes.post('/filterForSend', FilterController.ReadForSend);
routes.post('/filterForUsers', FilterController.ReadForUsers);
routes.post('/filterForCompleted', FilterController.ReadForComplete);

module.exports = routes;