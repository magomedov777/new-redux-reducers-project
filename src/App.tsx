import React, { useState } from 'react';
import './App.css';
import { TaskType, Todolist } from './Todolist';
import { v1 } from 'uuid';
import { AddItemForm } from './AddItemForm';
import { AppBar, Button, Container, Grid, Paper, Toolbar, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton/IconButton";
import { Menu } from "@mui/icons-material";


export type FilterValuesType = "all" | "active" | "completed";
export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}


function App() {
    let todolistId1 = v1();
    let todolistId2 = v1();

    let [todolists, setTodolists] = useState<Array<TodolistType>>([
        { id: todolistId1, title: "What to learn", filter: "all" },
        { id: todolistId2, title: "What to buy", filter: "all" }
    ])

    let [tasks, setTasks] = useState<TasksStateType>({
        [todolistId1]: [
            { id: v1(), title: "HTML&CSS", isDone: true },
            { id: v1(), title: "JS", isDone: true }
        ],
        [todolistId2]: [
            { id: v1(), title: "Milk", isDone: true },
            { id: v1(), title: "React Book", isDone: true }
        ]
    });


    const removeTask = (id: string, todolistId: string) => {
        // let todolistTasks = tasks[todolistId];
        // tasks[todolistId] = todolistTasks.filter(t => t.id != id);
        // setTasks({...tasks});
        setTasks({ ...tasks, [todolistId]: tasks[todolistId].filter(el => el.id !== id) })
    }

    const addTask = (title: string, todolistId: string) => {
        let task = { id: v1(), title: title, isDone: false };
        // let todolistTasks = tasks[todolistId];
        // tasks[todolistId] = [task, ...todolistTasks];
        // setTasks({ ...tasks });
        setTasks({ ...tasks, [todolistId]: [...tasks[todolistId], task] })
    }

    const changeStatus = (id: string, isDone: boolean, todolistId: string) => {
        // let todolistTasks = tasks[todolistId];
        // let task = todolistTasks.find(t => t.id === id);
        // if (task) {
        //     task.isDone = isDone;
        //     setTasks({ ...tasks });
        // }
        setTasks({ ...tasks, [todolistId]: tasks[todolistId].map(el => el.id === id ? { ...el, isDone } : el) })
    }

    const changeTaskTitle = (id: string, newTitle: string, todolistId: string) => {
        // let todolistTasks = tasks[todolistId];
        // let task = todolistTasks.find(t => t.id === id);
        // if (task) {
        //     task.title = newTitle;
        //     setTasks({ ...tasks });
        // }
        setTasks({ ...tasks, [todolistId]: tasks[todolistId].map(el => el.id === id ? { ...el, title: newTitle } : el) })
    }


    function changeFilter(value: FilterValuesType, todolistId: string) {
        let todolist = todolists.find(tl => tl.id === todolistId);
        if (todolist) {
            todolist.filter = value;
            setTodolists([...todolists])
        }
    }

    function removeTodolist(id: string) {
        // засунем в стейт список тудулистов, id которых не равны тому, который нужно выкинуть
        setTodolists(todolists.filter(tl => tl.id != id));
        // удалим таски для этого тудулиста из второго стейта, где мы храним отдельно таски
        delete tasks[id]; // удаляем св-во из объекта... значением которого являлся массив тасок
        // засетаем в стейт копию объекта, чтобы React отреагировал перерисовкой
        setTasks({ ...tasks });
    }

    function changeTodolistTitle(id: string, title: string) {
        // найдём нужный todolist
        const todolist = todolists.find(tl => tl.id === id);
        if (todolist) {
            // если нашёлся - изменим ему заголовок
            todolist.title = title;
            setTodolists([...todolists]);
        }
    }

    function addTodolist(title: string) {
        let newTodolistId = v1();
        let newTodolist: TodolistType = { id: newTodolistId, title: title, filter: 'all' };
        setTodolists([newTodolist, ...todolists]);
        setTasks({
            ...tasks,
            [newTodolistId]: []
        })
    }

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu />
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{ padding: "20px" }}>
                    <AddItemForm addItem={addTodolist} />
                </Grid>
                <Grid container spacing={3}>
                    {
                        todolists.map(tl => {
                            let allTodolistTasks = tasks[tl.id];
                            let tasksForTodolist = allTodolistTasks;

                            if (tl.filter === "active") {
                                tasksForTodolist = allTodolistTasks.filter(t => t.isDone === false);
                            }
                            if (tl.filter === "completed") {
                                tasksForTodolist = allTodolistTasks.filter(t => t.isDone === true);
                            }

                            return <Grid key={tl.id} item>
                                <Paper style={{ padding: "10px" }}>
                                    <Todolist
                                        key={tl.id}
                                        id={tl.id}
                                        title={tl.title}
                                        tasks={tasksForTodolist}
                                        removeTask={removeTask}
                                        changeFilter={changeFilter}
                                        addTask={addTask}
                                        changeTaskStatus={changeStatus}
                                        filter={tl.filter}
                                        removeTodolist={removeTodolist}
                                        changeTaskTitle={changeTaskTitle}
                                        changeTodolistTitle={changeTodolistTitle}
                                    />
                                </Paper>
                            </Grid>
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}

export default App;
