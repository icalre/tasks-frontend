import {Component, EventEmitter, Input, Output, ChangeDetectorRef, inject} from '@angular/core';

import {TaskModel, TaskStatus} from '../../../../model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent {
  @Input('task') task: TaskModel;
  @Output() delete: EventEmitter<TaskModel> = new EventEmitter();
  @Output() edit: EventEmitter<TaskModel> = new EventEmitter();
  @Output() toggle: EventEmitter<TaskModel> = new EventEmitter();

  private readonly changeDetectorRef: ChangeDetectorRef =
    inject(ChangeDetectorRef);

  isCompleted: boolean = false;

  ngAfterViewChecked(): void {
    this.isCompleted = this.task.status === TaskStatus.COMPLETED;

    this.changeDetectorRef.detectChanges();
  }

}
