import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ResponseModel, TaskModel } from 'src/app/model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly prefix = 'tasks';

  getAll(): Observable<ResponseModel<TaskModel[]>> {
    return this.http.get<ResponseModel<TaskModel[]>>(
      `${environment.apiUrl}/${this.prefix}`
    );
  }

  create(newTask: TaskModel): Observable<ResponseModel<TaskModel>> {
    return this.http.post<ResponseModel<TaskModel>>(
      `${environment.apiUrl}/${this.prefix}`,
      newTask
    );
  }

  update(
    taskId: string,
    newTask: TaskModel
  ): Observable<ResponseModel<TaskModel>> {
    return this.http.put<ResponseModel<TaskModel>>(
      `${environment.apiUrl}/${this.prefix}/${taskId}`,
      newTask
    );
  }

  delete(taskId: string): Observable<ResponseModel<TaskModel>> {
    return this.http.delete<ResponseModel<TaskModel>>(
      `${environment.apiUrl}/${this.prefix}/${taskId}`
    );
  }
}
