import { Observable, tap } from 'rxjs';

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Router } from '@angular/router';
import { todoCore } from '@core';

import { CanDeactivateComponent } from '../../guards/can-decativate-component.template';

@Component({
  selector: 'app-todo-details-section',
  templateUrl: './todo-details-section.component.html',
  styleUrls: ['./todo-details-section.component.scss'],
})
export class TodoDetailsSectionComponent implements OnChanges, CanDeactivateComponent {
  @Input()
  id!: number;

  @Output()
  closed = new EventEmitter<void>();

  state$?: Observable<todoCore.repositories.TodoState>;

  constructor(
    private router: Router,

    private getTodoByIdUsecase: todoCore.usecases.GetTodoByIdUsecase,
  ) {}

  ngOnChanges() {
    this.#init();
  }

  #init() {
    if (this.id === null || this.id === undefined) {
      alert('Invalid todo id');
      this.closed.emit();
    }

    this.state$ = this.getTodoByIdUsecase.execute(this.id).pipe(
      tap(state => {
        if (!state.loading && state.data === null) {
          this.closed.emit();
        }

        if (state.error) {
          alert('Something went wrong. ' + state.error);
        }
      }),
    );
  }

  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    return true;
  }
}
