import mongoose from 'mongoose'
import request from 'supertest'
import app from '../app'

import { fakeTasks } from './fakedata/fakeTasks'
import Task, { TaskType } from '../models/task.model'


jest.mock('./../middlewares/authUser.ts', () => {
  return ({
    authUser: jest.fn((req, res, next) => next())
  })
})

const fakeTask: TaskType = {
  ownerId: 'someOwner',
  title: 'task title',
  description: 'some description',
  deadlineDayIso: new Date().toISOString()
}

describe('TASKS', () => {
  jest.setTimeout(30000)

  afterAll(async () => {
    await mongoose.connection.close()
  })

  describe('SINGLE TASK CRUD', () => {

    beforeEach(async () => {
      await Task.deleteMany({})
    })

    describe('CREATE', () => {
      test('Добавляет задачу', async () => {
        await request(app)
          .post('/tasks')
          .send(fakeTask)
          .expect(200)
      })

      test('Добавленная задача соответствует данным от пользователя', async () => {
        await request(app)
          .post('/tasks')
          .send(fakeTask)
          .expect(200)

        const dbTask = await Task.findOne({
          ownerId: fakeTask.ownerId,
          title: fakeTask.title,
          description: fakeTask.description,
          deadlineDayIso: fakeTask.deadlineDayIso
        })
        expect(dbTask).not.toBe(null)
      })

      test("Добавляет задачу без description и даты", async () => {
        const { description, deadlineDayIso, ...thinTask } = fakeTask
        await request(app)
          .post('/tasks')
          .send(thinTask)
          .expect(200)
      })

      test("Не позволяет создать задачу без TITLE", async () => {
        const { title, ...thinTask } = fakeTask
        await request(app)
          .post('/tasks')
          .send(thinTask)
          .expect(400)
      })

      test("Не позволяет создать задачу без OWNER", async () => {
        const { ownerId, ...thinTask } = fakeTask
        await request(app)
          .post('/tasks')
          .send(thinTask)
          .expect(400)
      })

      test("Не позволяет создать задачу с кривым форматом даты", async () => {
        const { deadlineDayIso, ...thinTask } = fakeTask
        await request(app)
          .post('/tasks')
          .send({ ...thinTask, deadlineDayIso: '2022-13-02' })
          .expect(400)
      })
    })

    describe('UPDATE', () => {

      let taskId: mongoose.Types.ObjectId

      beforeEach(async () => {
        const newTask = await (new Task(fakeTask)).save()
        taskId = newTask._id
      })


      test("Обновляет данные задачи", async () => {
        const updates: Partial<TaskType> = {
          title: 'new title' + fakeTask.title,
          description: 'new description' + fakeTask.description,
          deadlineDayIso: (new Date()).toISOString(),
          ownerId: 'new' + fakeTask.ownerId
        }
        await request(app)
          .patch(`/tasks/${taskId}`)
          .send(updates)
          .expect(200)

        const updatedTask = await Task.findOne({
          _id: taskId,
          title: updates.title,
          description: updates.description,
          deadlineDayIso: updates.deadlineDayIso,
          ownerId: updates.ownerId
        })
        expect(updatedTask).not.toBe(null)
      })

      test("Не позволяет делать title пустым", async () => {
        await request(app)
          .patch(`/tasks/${taskId}`)
          .send({ title: "" })
          .expect(400)
      })

      test("Не позволяет делать ownerId пустым", async () => {
        await request(app)
          .patch(`/tasks/${taskId}`)
          .send({ ownerId: "" })
          .expect(400)
      })

      test("Позволяет description делать пустым", async () => {
        await request(app)
          .patch(`/tasks/${taskId}`)
          .send({ description: "" })
          .expect(200)
      })

      test("Позволяет deadlineDayIso делать пустым - NULL", async () => {
        await request(app)
          .patch(`/tasks/${taskId}`)
          .send({ deadlineDayIso: null })
          .expect(200)
      })

    })









  })

  describe('GET LIST OF TASKS', () => {
    const totalQny = fakeTasks.length

    beforeAll(async () => {
      await Task.deleteMany({})
      for (const task of fakeTasks) {
        await (new Task(task)).save()
      }
    })

    test("Берет 11 задач", async () => {
      const tasks = await request(app)
        .get('/tasks')
        .query({ limit: 11 })
        .expect(200)
      expect(tasks.body.length).toBe(11)
    })

    test("Не позволяет ставить limit в 0", async () => {
      await request(app)
        .get('/tasks')
        .query({ limit: 0 })
        .expect(400)
    })

    test("По-умолчанию выдает 10 задач", async () => {
      const tasks = await request(app)
        .get('/tasks')
        .expect(200)
      expect(tasks.body.length).toBe(10)
    })

    test("Допускает offset = 0", async () => {
      const tasks = await request(app)
        .get('/tasks')
        .query({ offset: 0 })
        .expect(200)
    })

    test("Берет 7 задач со смещением 2", async () => {

      const tasks_1 = await request(app)
        .get('/tasks')
        .query({ limit: 7})
        .expect(200)
      const tasks_2 = await request(app)
        .get('/tasks')
        .query({ limit: 7, offset: 2 })
        .expect(200)
      console.log(tasks_1.body)
      console.log(tasks_2.body)
      expect(tasks_2.body.length).toBe(7)
      expect(tasks_2.body[0]._id).toBe(tasks_1.body[2]._id)
    })
  })

})