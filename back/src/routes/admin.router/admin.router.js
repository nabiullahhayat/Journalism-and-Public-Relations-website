import express from "express";
import { creatAdmin, deletAdmin, gitAdmin, updateAdmin } from "../../controllers/admin.controller.js";

const AdminRouter = express.Router()

// Creat Admin Account
AdminRouter.post('/create', creatAdmin)

// Git Admin Account info
AdminRouter.get('/get', gitAdmin)

// Delete Admin By ID
AdminRouter.delete('/delete/:id', deletAdmin)

// Update Admin info
AdminRouter.put('/update/:id', updateAdmin)

export default AdminRouter;

