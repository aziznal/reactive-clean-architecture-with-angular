import { BehaviorSubject, Observable } from 'rxjs';
import { todoCore } from '@core';
import { RemoteTodoDataSource } from '../data-sources';
import { LocalTodoListDataSource, LocalTodoDataSource } from '../data-sources';

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

  constructor(
    private remoteTodoDataSource: RemoteTodoDataSource,
    private localTodoListDataSource: LocalTodoListDataSource,
    private localTodoDataSource: LocalTodoDataSource,
  ) {}

  async loadAllTodos(): Promise<void> {
    this.#emitTodoListState({ loading: true, error: null });

    const todos = await this.remoteTodoDataSource.getAllTodos();

    // local update
    this.localTodoListDataSource.setTodoList(todos);

    const currentTodo = this.localTodoDataSource.getTodo();

    if (currentTodo) {
      const todo = todos.find(t => t.id === currentTodo.id);

      if (todo) {
        this.localTodoDataSource.setTodoIfMatchesCurrentId(todo);
      }
    }

    this.#emitTodoListState({ data: todos, loading: false });
  }

  async loadTodoById(id: number): Promise<void> {
    this.#emitTodoState({ loading: true });

    const todo = await this.remoteTodoDataSource.getTodoById(id);

    this.localTodoDataSource.setTodo(todo);

    this.#emitTodoState({ data: this.localTodoDataSource.getTodo(), loading: false });
  }

  async create(todo: todoCore.entities.Todo): Promise<void> {
    // local update
    this.localTodoListDataSource.createToDo(todo);
    this.#emitTodoListState({ data: this.localTodoListDataSource.getTodoList() });

    this.#emitTodoListState({ loading: true });

    await this.remoteTodoDataSource.createTodo(todo).catch(error => {
      this.#emitTodoListState({ loading: false, error });
      this.loadAllTodos();
    });

    this.#emitTodoListState({ loading: false });
  }

  async update(todo: todoCore.entities.Todo): Promise<void> {
    // local update
    this.localTodoListDataSource.updateTodo(todo);

    this.localTodoDataSource.setTodoIfMatchesCurrentId(todo);

    this.#emitTodoListState({ data: this.localTodoListDataSource.getTodoList() });
    this.#emitTodoState({ data: this.localTodoDataSource.getTodo() });

    this.#emitTodoListState({ loading: true });

    await this.remoteTodoDataSource.updateTodo(todo).catch(error => {
      this.#emitTodoListState({ loading: false, error });
      this.loadAllTodos();
    });

    this.#emitTodoListState({ loading: false });
  }

  async reorder(from: number, to: number): Promise<void> {
    // local update
    this.localTodoListDataSource.reorderTodo(from, to);
    this.#emitTodoListState({ data: this.localTodoListDataSource.getTodoList() });

    this.#emitTodoListState({ loading: true });

    await this.remoteTodoDataSource.reorderTodo(from, to).catch(error => {
      this.#emitTodoListState({ loading: false, error });

      // reset local
      this.loadAllTodos();
    });

    this.#emitTodoListState({ loading: false });
  }

  async delete(id: number): Promise<void> {
    // local update
    this.localTodoListDataSource.deleteTodo(id);
    this.localTodoDataSource.deleteTodoIfMatchesCurrentId(id);

    this.#emitTodoListState({ data: this.localTodoListDataSource.getTodoList() });
    this.#emitTodoState({ data: this.localTodoDataSource.getTodo() });

    this.#emitTodoListState({ loading: true });

    await this.remoteTodoDataSource.deleteTodo(id).catch(error => {
      this.#emitTodoListState({ loading: false, error });
      this.loadAllTodos();
    });

    this.#emitTodoListState({ loading: false });
  }

  #emitTodoListState(newState: Partial<todoCore.repositories.TodoListState>) {
    this.todoListState$.next({ ...this.todoListState$.getValue(), ...newState });
  }

  #emitTodoState(newState: Partial<todoCore.repositories.TodoState>) {
    this.todoState$.next({ ...this.todoState$.getValue(), ...newState });
  }
}
