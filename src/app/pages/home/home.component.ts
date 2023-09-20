import {Component, OnDestroy, inject} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatTabChangeEvent} from '@angular/material/tabs';
import {Subscription, take} from 'rxjs';
import {TaskModel, TaskStatus} from "../../model";
import {MatDialog} from "@angular/material/dialog";
import {TaskService} from "../../services";
import {HomeTabs} from "./models";
import {FormComponent} from "./components/form/form.component";
import {showErrorSnackbar, showSnackbar} from '../../utilities';
import {createTasksAdapter} from "../../adapters";


type HomeTab = { tabName: HomeTabs; set: TaskModel[] };

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    host: {
        class: 'home-container',
    }
})

export class HomeComponent {

    private readonly dialog: MatDialog = inject(MatDialog);
    private readonly taskService: TaskService = inject(TaskService);
    private readonly resolverDataSubscription: Subscription;
    private readonly snackBar: MatSnackBar = inject(MatSnackBar);

    private pendingTasks: TaskModel[] = [];
    private completedTasks: TaskModel[] = [];

    loading: boolean = false;

    constructor() {
        this.taskService.getAll().subscribe({
            next: (result: any) => {
                if (result.success) {
                    const tasks = createTasksAdapter(result.data);
                    tasks.forEach((task: TaskModel) => {
                        if (task.status == TaskStatus.PENDING) {
                            this.pendingTasks.push(task);
                        } else {
                            this.completedTasks.push(task);
                        }
                    });
                }
            },
            error: (_error) => {
                showErrorSnackbar(this.snackBar);
            },
        });
    }

    ngOnDestroy(): void {
        this.resolverDataSubscription.unsubscribe();
    }

    tabs: HomeTab[] = [
        {
            tabName: HomeTabs.PENDING,
            set: this.pendingTasks,
        },
        {
            tabName: HomeTabs.COMPLETED,
            set: this.completedTasks,
        },
    ];

    private selectedTab: HomeTab = this.tabs[0];

    tabChanged(tabChangeEvent: MatTabChangeEvent) {
        this.selectedTab = this.tabs[tabChangeEvent.index];
    }

    add() {
        const dialogRef = this.dialog.open(FormComponent, {
            width: '40vw',
        });

        dialogRef.afterClosed().subscribe({
            next: (result: TaskModel | undefined) => {
                if (result) {
                    const tabToUse = this.tabs.find(
                        (tab) => (tab.tabName as string) === result.status
                    );
                    showSnackbar(this.snackBar, 'Saved successfully.');
                    tabToUse?.set.push(result);
                }
            },
            error: (_error) => {
                showErrorSnackbar(this.snackBar);
            },
        });
    }

    toggleTask(task: TaskModel) {
        // CHANGE VALUE
        this.loading = true;
        const isCompleted = task.status === TaskStatus.COMPLETED;
        let resultingStatus;
        if (isCompleted) {
            resultingStatus = TaskStatus.PENDING;
        } else {
            resultingStatus = TaskStatus.COMPLETED;
        }
        const newTask = {title: task.title, description: task.description, status: resultingStatus};

        this.taskService
            .update(task.id as string, newTask)
            .pipe(take(1))
            .subscribe({
                next: (response) => {
                    const {data: newTask} = response;
                    task = newTask as TaskModel;
                    this.changeTaskTab(task);
                    showSnackbar(this.snackBar, 'Changed successfully.');
                    this.loading = false;
                },
                error: (error) => {
                    showErrorSnackbar(this.snackBar, error?.error?.extraMessage);
                    this.loading = false;
                },
            });
    }

    private changeTaskTab = (task: TaskModel) => {
        if (task.status === TaskStatus.PENDING) {
            this.tabs[0].set = [...this.tabs[0].set, task];
            this.tabs[1].set = this.tabs[1].set.filter(
                (_task) => _task.id !== task.id
            );
        } else {
            this.tabs[1].set = [...this.tabs[1].set, task];
            this.tabs[0].set = this.tabs[0].set.filter(
                (_task) => _task.id !== task.id
            );
        }
    };

   updateTask(task: TaskModel) {
        const dialogRef = this.dialog.open(FormComponent, {
            data: task,
            width: '40vw',
        });

        dialogRef.afterClosed().subscribe({
            next: (result: TaskModel | undefined) => {
                if (result) {
                    if (task.status !== result.status) {
                        this.changeTaskTab(result);
                    }
                    showSnackbar(this.snackBar, 'Saved successfully.');
                }
            },
            error: (_error) => {
                showErrorSnackbar(this.snackBar);
            },
        });
    }

    deleteTask(task: TaskModel) {
        this.loading = true;
        this.taskService
            .delete(task.id as string)
            .pipe(take(1))
            .subscribe({
                next: (_response) => {
                    showSnackbar(this.snackBar, 'Deleted successfully.');
                    this.selectedTab.set = this.selectedTab.set.filter(
                        (_task) => _task.id !== task.id
                    );
                    this.loading = false;
                },
                error: (error) => {
                    showErrorSnackbar(this.snackBar, error?.error?.extraMessage);
                    this.loading = false;
                },
            });
    }

}
