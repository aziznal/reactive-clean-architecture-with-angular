import { todoCore } from '@core';

export abstract class LocalTodoDataSource {
  abstract getTodo(): todoCore.entities.Todo | null;

  abstract setTodo(todo: todoCore.entities.Todo | null): void;

  abstract setTodoIfMatchesCurrentId(todo: todoCore.entities.Todo): void;

  abstract deleteTodoIfMatchesCurrentId(id: number): void;
}

export class LocalTodoDataSourceImpl implements LocalTodoDataSource {
  todo: todoCore.entities.Todo | null = null;

  getTodo(): todoCore.entities.Todo | null {
    return this.todo;
  }

  setTodo(todo: todoCore.entities.Todo | null): void {
    this.todo = todo;
  }

  setTodoIfMatchesCurrentId(todo: todoCore.entities.Todo): void {
    if (this.todo?.id === todo.id) {
      this.todo = todo;
    }
  }

  deleteTodoIfMatchesCurrentId(id: number): void {
    if (this.todo?.id === id) {
      this.todo = null;
    }
  }
}
