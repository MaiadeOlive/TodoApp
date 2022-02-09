import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';
import { Router } from '@angular/router';
import { List } from 'src/app/models/list.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss']
})
export class NewListComponent implements OnInit {

  constructor(private taskService: TaskService, private router: Router) { }

  showValidationErrors: boolean = false

  ngOnInit() {
  }

  createList(title: string) {
    this.taskService.createList(title).subscribe((list: List) => {
      this.router.navigate([ '/lists', list._id ]); 
    });
  }

  onFormSubmit(form: NgForm){
    console.log(form)
    if(form.invalid) return this.showValidationErrors = true

    if(form.valid){
      this.showValidationErrors = false
      this.createList(form.value.title);
    }
  }

}
