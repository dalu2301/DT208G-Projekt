import { Injectable } from '@angular/core'
import { Course } from '../models/course'
import { StorageHandlerService } from './storage-handler.service'

@Injectable({
  providedIn: 'root'
})

export class ScheduleHandlerService {

  constructor(
    private storageHandler: StorageHandlerService
  ) { }

  addCourse(course: Course[]): void {

    let currentStorage: Course[] | null = this.storageHandler.getLocalStorage()

    if (currentStorage) {

      currentStorage.push(course[0])
      this.storageHandler.setLocalStorage(currentStorage)

    } else {

      this.storageHandler.setLocalStorage(course)

    }

  }

  getCourses(): Course[] {

    return this.storageHandler.getLocalStorage()

  }

}
