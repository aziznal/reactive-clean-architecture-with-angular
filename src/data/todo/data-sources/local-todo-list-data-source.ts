import { todoCore } from '@core';

export abstract class LocalTodoListDataSource {
  abstract getTodoList(): todoCore.entities.Todo[] | null;

  abstract setTodoList(todoList: todoCore.entities.Todo[] | null): void;

  abstract createToDo(todo: todoCore.entities.Todo): void;

  abstract updateTodo(todo: todoCore.entities.Todo): void;

  abstract reorderTodo(from: number, to: number): void;

  abstract deleteTodo(id: number): void;
}

export class LocalTodoListDataSourceImpl implements LocalTodoListDataSource {
  todoList: todoCore.entities.Todo[] | null = null;

  getTodoList(): todoCore.entities.Todo[] | null {
    return this.todoList;
  }

  setTodoList(todoList: todoCore.entities.Todo[] | null): void {
    this.todoList = todoList;
  }

  createToDo(todo: todoCore.entities.Todo): void {
    if (this.todoList === null || this.todoList === undefined) {
      this.todoList = [];
    }
    this.todoList?.push(todo);
  }

  updateTodo(todo: todoCore.entities.Todo): void {
    if (this.todoList === null || this.todoList === undefined) {
      throw new Error('Cannot Update Todo!');
    }
    const index = this.todoList.findIndex(t => t.id === todo.id);
    this.todoList[index] = todo;
  }

  reorderTodo(from: number, to: number): void {
    if (this.todoList === null || this.todoList === undefined) {
      throw new Error('Cannot Reorder Todo!');
    }
    const todo = this.todoList.splice(from, 1)[0];
    this.todoList.splice(to, 0, todo);
  }

  deleteTodo(id: number): void {
    if (this.todoList === null || this.todoList === undefined) {
      throw new Error('Cannot Reorder Todo!');
    }
    const index = this.todoList.findIndex(t => t.id === id);
    this.todoList.splice(index, 1);
  }
}
