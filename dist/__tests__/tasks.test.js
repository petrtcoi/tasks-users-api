"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const fakeTasks_1 = require("./fakedata/fakeTasks");
const task_model_1 = __importDefault(require("../models/task.model"));
jest.mock('./../middlewares/authUser.ts', () => {
    return ({
        authUser: jest.fn((req, res, next) => next())
    });
});
const fakeTask = {
    ownerId: 'someOwner',
    title: 'task title',
    description: 'some description',
    deadlineDayIso: new Date().toISOString()
};
describe('TASKS', () => {
    jest.setTimeout(30000);
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
    }));
    describe('SINGLE TASK CRUD', () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield task_model_1.default.deleteMany({});
        }));
        describe('CREATE', () => {
            test('Добавляет задачу', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, supertest_1.default)(app_1.default)
                    .post('/tasks')
                    .send(fakeTask)
                    .expect(200);
            }));
            test('Добавленная задача соответствует данным от пользователя', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, supertest_1.default)(app_1.default)
                    .post('/tasks')
                    .send(fakeTask)
                    .expect(200);
                const dbTask = yield task_model_1.default.findOne({
                    ownerId: fakeTask.ownerId,
                    title: fakeTask.title,
                    description: fakeTask.description,
                    deadlineDayIso: fakeTask.deadlineDayIso
                });
                expect(dbTask).not.toBe(null);
            }));
            test("Добавляет задачу без description и даты", () => __awaiter(void 0, void 0, void 0, function* () {
                const { description, deadlineDayIso } = fakeTask, thinTask = __rest(fakeTask, ["description", "deadlineDayIso"]);
                yield (0, supertest_1.default)(app_1.default)
                    .post('/tasks')
                    .send(thinTask)
                    .expect(200);
            }));
            test("Не позволяет создать задачу без TITLE", () => __awaiter(void 0, void 0, void 0, function* () {
                const { title } = fakeTask, thinTask = __rest(fakeTask, ["title"]);
                yield (0, supertest_1.default)(app_1.default)
                    .post('/tasks')
                    .send(thinTask)
                    .expect(400);
            }));
            test("Не позволяет создать задачу без OWNER", () => __awaiter(void 0, void 0, void 0, function* () {
                const { ownerId } = fakeTask, thinTask = __rest(fakeTask, ["ownerId"]);
                yield (0, supertest_1.default)(app_1.default)
                    .post('/tasks')
                    .send(thinTask)
                    .expect(400);
            }));
            test("Не позволяет создать задачу с кривым форматом даты", () => __awaiter(void 0, void 0, void 0, function* () {
                const { deadlineDayIso } = fakeTask, thinTask = __rest(fakeTask, ["deadlineDayIso"]);
                yield (0, supertest_1.default)(app_1.default)
                    .post('/tasks')
                    .send(Object.assign(Object.assign({}, thinTask), { deadlineDayIso: '2022-13-02' }))
                    .expect(400);
            }));
        });
        describe('UPDATE', () => {
            let taskId;
            beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                const newTask = yield (new task_model_1.default(fakeTask)).save();
                taskId = newTask._id;
            }));
            test("Обновляет данные задачи", () => __awaiter(void 0, void 0, void 0, function* () {
                const updates = {
                    title: 'new title' + fakeTask.title,
                    description: 'new description' + fakeTask.description,
                    deadlineDayIso: (new Date()).toISOString(),
                    ownerId: 'new' + fakeTask.ownerId
                };
                yield (0, supertest_1.default)(app_1.default)
                    .patch(`/tasks/${taskId}`)
                    .send(updates)
                    .expect(200);
                const updatedTask = yield task_model_1.default.findOne({
                    _id: taskId,
                    title: updates.title,
                    description: updates.description,
                    deadlineDayIso: updates.deadlineDayIso,
                    ownerId: updates.ownerId
                });
                expect(updatedTask).not.toBe(null);
            }));
            test("Не позволяет делать title пустым", () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, supertest_1.default)(app_1.default)
                    .patch(`/tasks/${taskId}`)
                    .send({ title: "" })
                    .expect(400);
            }));
            test("Не позволяет делать ownerId пустым", () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, supertest_1.default)(app_1.default)
                    .patch(`/tasks/${taskId}`)
                    .send({ ownerId: "" })
                    .expect(400);
            }));
            test("Позволяет description делать пустым", () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, supertest_1.default)(app_1.default)
                    .patch(`/tasks/${taskId}`)
                    .send({ description: "" })
                    .expect(200);
            }));
            test("Позволяет deadlineDayIso делать пустым - NULL", () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, supertest_1.default)(app_1.default)
                    .patch(`/tasks/${taskId}`)
                    .send({ deadlineDayIso: null })
                    .expect(200);
            }));
        });
    });
    describe('GET LIST OF TASKS', () => {
        const totalQny = fakeTasks_1.fakeTasks.length;
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield task_model_1.default.deleteMany({});
            for (const task of fakeTasks_1.fakeTasks) {
                yield (new task_model_1.default(task)).save();
            }
        }));
        test("Берет 11 задач", () => __awaiter(void 0, void 0, void 0, function* () {
            const tasks = yield (0, supertest_1.default)(app_1.default)
                .get('/tasks')
                .query({ limit: 11 })
                .expect(200);
            expect(tasks.body.length).toBe(11);
        }));
        test("Не позволяет ставить limit в 0", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.default)
                .get('/tasks')
                .query({ limit: 0 })
                .expect(400);
        }));
        test("По-умолчанию выдает 10 задач", () => __awaiter(void 0, void 0, void 0, function* () {
            const tasks = yield (0, supertest_1.default)(app_1.default)
                .get('/tasks')
                .expect(200);
            expect(tasks.body.length).toBe(10);
        }));
        test("Допускает offset = 0", () => __awaiter(void 0, void 0, void 0, function* () {
            const tasks = yield (0, supertest_1.default)(app_1.default)
                .get('/tasks')
                .query({ offset: 0 })
                .expect(200);
        }));
        test("Берет 7 задач со смещением 2", () => __awaiter(void 0, void 0, void 0, function* () {
            const tasks_1 = yield (0, supertest_1.default)(app_1.default)
                .get('/tasks')
                .query({ limit: 7 })
                .expect(200);
            const tasks_2 = yield (0, supertest_1.default)(app_1.default)
                .get('/tasks')
                .query({ limit: 7, offset: 2 })
                .expect(200);
            console.log(tasks_1.body);
            console.log(tasks_2.body);
            expect(tasks_2.body.length).toBe(7);
            expect(tasks_2.body[0]._id).toBe(tasks_1.body[2]._id);
        }));
    });
});
