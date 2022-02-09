import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Task } from './models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webReqService: WebRequestService) { }


  getLists() {
    // Manda um web request para pegar todas as listas
    return this.webReqService.get('lists');
  }

  createList(title: string) {
    // Manda um web request para criar a lista
    return this.webReqService.post('lists', { title });
  }

  updateList(id: string, title: string) {
    // Manda um web request para atualizar a lista
    return this.webReqService.patch(`lists/${id}`, { title });
  }

  updateTask(listId: string, taskId: string, title: string, date: Date) {
    // Manda um web request para atualizar uma tarefa da lista
    return this.webReqService.patch(`lists/${listId}/tasks/${taskId}`, { title, date });
  }

  deleteTask(listId: string, taskId: string) {
    // Manda um web request para deletar uma tarefa da lista
    return this.webReqService.delete(`lists/${listId}/tasks/${taskId}`);
  }

  deleteList(id: string) {
    // Manda um web request para deletar uma lista
    return this.webReqService.delete(`lists/${id}`);
  }

  getTasks(listId: string) {
    // Manda um web request para pegar uma tarefa da lista
    return this.webReqService.get(`lists/${listId}/tasks`);
  }

  createTask(title: string, date: Date, listId: string) {
    // Manda um web request para criar uma tarefa da lista
    return this.webReqService.post(`lists/${listId}/tasks`, { title, date });
  }

  complete(task: Task) {
    // Manda um web request para atualizar uma tarefa concluída da lista
    return this.webReqService.patch(`lists/${task._listId}/tasks/${task._id}`, {
      completed: !task.completed
    });
  }
}
