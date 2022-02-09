const express = require('express');
const app = express();

const { mongoose } = require('./db/mongoose');

const bodyParser = require('body-parser');

// Carrega os modelos do mongoose
const { List, Task } = require('./db/models');

/* MIDDLEWARE  */

// Carrega middleware
app.use(bodyParser.json());

// CORS HEADERS MIDDLEWARE
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );

    next();
});

/* ROUTE HANDLERS */

/* LIST ROUTES */

/**
 * GET /lists
 * Objetivo: Pegar todas as listas de tarefas
 */
app.get('/lists', (req, res) => {
    List.find(req.body).then((lists) => {
        res.send(lists);
    }).catch((e) => {
        res.send(e);
    });
})

/**
 * POST /lists
 * Objetivo: Criar uma lista de tarefas
 */
app.post('/lists', (req, res) => {
    try {
        let title = req.body.title;
        let newList = new List({
            title
        });
        newList.save().then((listDoc) => {
            res.send(listDoc);
        })
    } catch (err) {
        console.log("Erro ao enviar o formulário");
    }
});

/**
 * PATCH /lists/:id
 * Objetivo: Atualizar uma lista específica
 */
app.patch('/lists/:id', (req, res) => {
    List.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'Atualização realizada com sucesso!' });
    });
});

/**
 * DELETE /lists/:id
 * Objetivo: Deletar uma lista de tarefas
 */
app.delete('/lists/:id', (req, res) => {
    List.findOneAndRemove({
        _id: req.params.id,
    }).then((removedListDoc) => {
        res.send(removedListDoc);
        deleteTasksFromList(removedListDoc._id);
    })
});


/**
 * GET /lists/:listId/tasks
 * Objetivo: Pega todas as tarefas de uma lista em específico
 */
app.get('/lists/:listId/tasks', (req, res) => {
    Task.find({
        _listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks);
    })
});


/**
 * POST /lists/:listId/tasks
 * Objetivo: Cria uma nova tarefa na lista específica
 */
app.post('/lists/:listId/tasks', (req, res) => {
    List.findOne({
        _id: req.params.listId,
    }).then((list) => {
        if (list) {
            return true;
        }
        return false;
    }).then((canCreateTask) => {
        if (canCreateTask) {
            try {
                let newTask = new Task({
                    title: req.body.title,
                    date: req.body.date,
                    _listId: req.params.listId
                });
                newTask.save().then((newTaskDoc) => {
                    res.send(newTaskDoc);
                })
            } catch (err) {
                console.log("Erro ao enviar o formulário");
            }
        } else {
            res.sendStatus(404);
        }
    })
})

/**
 * PATCH /lists/:listId/tasks/:taskId
 * Objetivo: Atualiza uma tarefa existente
 */
app.patch('/lists/:listId/tasks/:taskId', (req, res) => {
    List.findOne({
        _id: req.params.listId,
    }).then((list) => {
        if (list) {
            return true;
        }
        return false;
    }).then((canUpdateTasks) => {
        if (canUpdateTasks) {
            Task.findOneAndUpdate({
                _id: req.params.taskId,
                _listId: req.params.listId
            }, {
                $set: req.body
            }).then(() => {
                res.send({ message: 'Atualização realizada com sucesso!' })
            })
        } else {
            res.sendStatus(404);
        }
    })
});

/**
 * DELETE /lists/:listId/tasks/:taskId
 * Objetivo: Deleta uma tarefa
 */
app.delete('/lists/:listId/tasks/:taskId', (req, res) => {

    List.findOne({
        _id: req.params.listId,
    }).then((list) => {
        if (list) {
            return true;
        }
        return false;
    }).then((canDeleteTasks) => {

        if (canDeleteTasks) {
            Task.findOneAndRemove({
                _id: req.params.taskId,
                _listId: req.params.listId
            }).then((removedTaskDoc) => {
                res.send(removedTaskDoc);
            })
        } else {
            res.sendStatus(404);
        }
    });
});

/* HELPER METHODS */
let deleteTasksFromList = (_listId) => {
    Task.deleteMany({
        _listId
    }).then(() => {
        console.log("Tarefa da lista id: " + _listId + " foram deletadas com sucesso!");
    })
}

app.listen(3000, () => {
    console.log("Servidor ouvindo na porta 3000");
})