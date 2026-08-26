import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { Task, Status } from '../../models/task.model';
import { TaskService } from '../../core/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    CardModule,
    DialogModule,
    SelectModule
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  readonly columns: { status: Status; label: string }[] = [
    { status: 'TODO', label: 'To do' },
    { status: 'IN_PROGRESS', label: 'In progress' },
    { status: 'DONE', label: 'Done' }
  ];

  dialogVisible = false;
  editingTask: Task | null = null;
  formTitle = '';
  formDescription = '';
  formStatus = 'TODO' as Status;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAll().subscribe(tasks => this.tasks = tasks);
  }

  tasksByStatus(status: Status): Task[] {
    return this.tasks.filter(t => t.status === status);
  }

  openCreateDialog(): void {
    this.editingTask = null;
    this.formTitle = '';
    this.formDescription = '';
    this.formStatus = 'TODO';
    this.dialogVisible = true;
  }

  openEditDialog(task: Task): void {
    this.editingTask = task;
    this.formTitle = task.title;
    this.formDescription = task.description ?? '';
    this.formStatus = task.status;
    this.dialogVisible = true;
  }

  closeDialog(): void {
    this.dialogVisible = false;
  }

  saveTask(): void {
    if (!this.formTitle.trim()) return;

    if (this.editingTask) {
      // Editing mode
      const updated: Task = {
        ...this.editingTask,
        title: this.formTitle,
        description: this.formDescription,
        status: this.formStatus
      };
      this.taskService.update(this.editingTask.id!, updated).subscribe(() => {
        this.closeDialog();
        this.loadTasks();
      });
    } else {
      // Creation mode
      const newTask: Task = {
        title: this.formTitle,
        description: this.formDescription,
        status: this.formStatus
      };
      this.taskService.create(newTask).subscribe(() => {
        this.closeDialog();
        this.loadTasks();
      });
    }
  }

  updateStatus(task: Task, newStatus: Status): void {
    const updated = { ...task, status: newStatus };
    this.taskService.update(task.id!, updated).subscribe(() => this.loadTasks());
  }

  deleteTask(task: Task): void {
    this.taskService.delete(task.id!).subscribe(() => this.loadTasks());
  }
}