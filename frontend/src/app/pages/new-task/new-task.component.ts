import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) { }

  listId: string;
  showValidationErrors: boolean = false
  
  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.listId = params.listId;
      }
    )
  }

  createTask(title: string, date: Date) {
      this.taskService.createTask(title, date, this.listId).subscribe((newTask: Task) => {
        this.router.navigate(['../'], { relativeTo: this.route });
      })
  }

  onFormSubmit(form: NgForm){
    console.log(form)
    if(form.invalid) return this.showValidationErrors = true

    if(form.valid){
      this.showValidationErrors = false
      this.createTask(form.value.title, form.value.date);
    }
  }
}
