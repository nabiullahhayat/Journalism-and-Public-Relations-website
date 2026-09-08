import express from 'express'
import {createDepartament, deleteDepartament, updateDepartament} from '../../controllers/departaments.controller.js'


const DepartamentRouter = express.Router()

// Create new Departament
DepartamentRouter.post('/create', createDepartament)


// Update Departament
DepartamentRouter.put('/update/:id', updateDepartament)


// Delete Departament
DepartamentRouter.delete('/delete/:id', deleteDepartament)


// Get all Departaments
// Get one Departament

export default DepartamentRouter;