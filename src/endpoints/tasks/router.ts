import express from 'express'

import getList from './getList'
import get from './get'
import update from './update'
import deleteTask from './delete'
import create from './create'

const router = express.Router()

router.get('/', getList)
router.get('/:taskid', get)
router.post('/', create)
router.patch('/:taskid', update)
router.delete('/:taskid', deleteTask)



export default router