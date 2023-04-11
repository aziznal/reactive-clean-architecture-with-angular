import { BehaviorSubject, Observable } from 'rxjs';

import { todoCore } from '@core';

import { RemoteTodoDataSource } from '../data-sources';

export class TodoRepositoryImpl implements todoCore.repositories.TodoRepository {
  todoListState$ = new BehaviorSubject<todoCore.repositories.TodoListState>({
    loading: false,
    error: null,
    data: null,
  });

  todoState$ = new BehaviorSubject<todoCore.repositories.TodoState>({
    loading: false,
    error: null,
    data: null,
  });

  constructor(private remoteTodoDataSource: RemoteTodoDataSource) {}

  async loadAllTodos(): Promise<void> {
    this.#emitTodoListState({ loading: true });

    const todos = await this.remoteTodoDataSource.getAllTodos();

    this.#emitTodoListState({ data: todos, loading: false });
  }

  async loadTodoById(id: number): Promise<void> {
    this.#emitTodoState({ loading: true });

    const todo = await this.remoteTodoDataSource.getTodoById(id);

    this.#emitTodoState({ data: todo, loading: false });
  }

  async create(todo: todoCore.entities.Todo): Promise<void> {
    this.#emitTodoListState({ loading: true });

    await this.remoteTodoDataSource.createTodo(todo);

    // local update
    this.#emitTodoListState({ loading: false, data: [...(this.todoListState$.getValue().data || []), todo] });
  }

  async update(todo: todoCore.entities.Todo): Promise<void> {
    this.#emitTodoListState({ loading: true });

    await this.remoteTodoDataSource.updateTodo(todo);

    // local update
    const todos = this.todoListState$.getValue().data || [];
    const index = todos.findIndex(t => t.id === todo.id);
    todos[index] = todo;

    this.#emitTodoListState({ loading: false, data: todos });
  }

  async reorder(from: number, to: number): Promise<void> {
    this.#emitTodoListState({ loading: true });

    await this.remoteTodoDataSource.reorderTodo(from, to);

    // local update
    const todos = this.todoListState$.getValue().data || [];
    const todo = todos.splice(from, 1)[0];
    todos.splice(to, 0, todo);

    this.#emitTodoListState({ loading: false, data: todos });
  }

  async delete(id: number): Promise<void> {
    this.#emitTodoListState({ loading: true });

    await this.remoteTodoDataSource.deleteTodo(id);

    // local update
    const todos = this.todoListState$.getValue().data || [];
    const index = todos.findIndex(t => t.id === id);
    todos.splice(index, 1);

    this.#emitTodoListState({ loading: false, data: todos });
  }

  #emitTodoListState(newState: Partial<todoCore.repositories.TodoListState>) {
    this.todoListState$.next({ ...this.todoListState$.getValue(), ...newState });
  }

  #emitTodoState(newState: Partial<todoCore.repositories.TodoState>) {
    this.todoState$.next({ ...this.todoState$.getValue(), ...newState });
  }
}
