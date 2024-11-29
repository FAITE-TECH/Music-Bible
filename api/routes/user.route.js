import express  from "express";
import { assignAdmin, deleteUser, forgetpassword, getAdmins, getCustomers, getUser, getUsers, resetpassword, resignAdmin, signout, test, updateResetPassword, updateUser } from "../controllers/user.controller.js";


const router = express.Router();

router.get('/test',test);
router.put("/update/:id" , updateUser);
router.delete("/delete/:id" , deleteUser);
router.put("/assignadmin/:id" , assignAdmin);
router.put("/resignadmin/:id" , resignAdmin);
router.get('/signout',signout);
router.get('/getadmins', getAdmins);
router.get('/getcustomers', getCustomers);
router.get('/getusers',getUsers);
router.post('/forgetpassword',forgetpassword);
router.get('/resetpassword/:id',resetpassword);
router.post('/updateResetPassword/:id',updateResetPassword);
router.get('/:userId', getUser);


export default router;