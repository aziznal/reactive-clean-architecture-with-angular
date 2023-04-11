import { NgModule, Provider } from '@angular/core';
import { todoCore as todoCore } from '@core';
import { todoData as todoData } from '@data';
const providers: Provider[] = [
  // Data Source injections
  {
    provide: todoData.dataSources.RemoteTodoDataSource,
    useFactory: () => new todoData.dataSources.RemoteTodoDataSourceImpl(),
  },
  {
    provide: todoData.dataSources.LocalTodoListDataSource,
    useFactory: () => new todoData.dataSources.LocalTodoListDataSourceImpl(),
  },
  {
    provide: todoData.dataSources.LocalTodoDataSource,
    useFactory: () => new todoData.dataSources.LocalTodoDataSourceImpl(),
  },

  // Repository injections
  {
    provide: todoCore.repositories.TodoRepository,
    useFactory: (
      remoteDataSource: todoData.dataSources.RemoteTodoDataSource,
      localListDataSource: todoData.dataSources.LocalTodoListDataSource,
      localDataSource: todoData.dataSources.LocalTodoDataSource,
    ) => new todoData.repositories.TodoRepositoryImpl(remoteDataSource, localListDataSource, localDataSource),
    deps: [
      todoData.dataSources.RemoteTodoDataSource,
      todoData.dataSources.LocalTodoListDataSource,
      todoData.dataSources.LocalTodoDataSource,
    ],
  },
  // Usecase injections
  {
    provide: todoCore.usecases.GetTodoListUsecase,
    useFactory: (repo: todoCore.repositories.TodoRepository) => new todoCore.usecases.GetTodoListImpl(repo),
    deps: [todoCore.repositories.TodoRepository],
  },
  {
    provide: todoCore.usecases.GetTodoByIdUsecase,
    useFactory: (repo: todoCore.repositories.TodoRepository) => new todoCore.usecases.GetTodoByIdUsecaseImpl(repo),
    deps: [todoCore.repositories.TodoRepository],
  },
  {
    provide: todoCore.usecases.CreateTodoUsecase,
    useFactory: (repo: todoCore.repositories.TodoRepository) => new todoCore.usecases.CreateTodoUsecaseImpl(repo),
    deps: [todoCore.repositories.TodoRepository],
  },
  {
    provide: todoCore.usecases.DeleteTodoUsecase,
    useFactory: (repo: todoCore.repositories.TodoRepository) => new todoCore.usecases.DeleteTodoUsecaseImpl(repo),
    deps: [todoCore.repositories.TodoRepository],
  },
  {
    provide: todoCore.usecases.UpdateTodoUsecase,
    useFactory: (repo: todoCore.repositories.TodoRepository) => new todoCore.usecases.UpdateTodoUsecaseImpl(repo),
    deps: [todoCore.repositories.TodoRepository],
  },
  {
    provide: todoCore.usecases.ReorderTodoUsecase,
    useFactory: (repo: todoCore.repositories.TodoRepository) => new todoCore.usecases.ReorderTodoUsecaseImpl(repo),
    deps: [todoCore.repositories.TodoRepository],
  },
];
@NgModule()
export class DependencyInjectionModule {
  static forRoot() {
    return {
      ngModule: DependencyInjectionModule,
      providers: [...providers],
    };
  }
}
