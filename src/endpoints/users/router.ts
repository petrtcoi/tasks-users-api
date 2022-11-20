import express from 'express'

// import getList from './getList'
// import get from './get'
import update from './update'
// import deleteTask from './delete'
import signup from './signup'
import login from './login'

const router = express.Router()

// router.get('/', getList)
// router.get('/:taskid', get)
router.post('/login', login)
router.post('/', signup)
router.patch('/:userid', update)
// router.delete('/:taskid', deleteTask)



export default router