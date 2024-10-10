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

  /**
   * Lägger till en kurs till ramschemat, om det redan finns
   * ett, annars så skapas ett nytt.
   */
  addCourse(course: Course[]): void {

    let currentStorage: Course[] | null = this.storageHandler.getLocalStorage()

    if (currentStorage) {

      currentStorage.push(course[0])
      this.storageHandler.setLocalStorage(currentStorage)

    } else {

      this.storageHandler.setLocalStorage(course)

    }

  }

  /**
   * Uppdaterar ramschemat, det vill säga återskiver
   * det som kommer in till Local Storage.
   */
  updateCourses(courses: Course[]): void {

    this.storageHandler.setLocalStorage(courses)

  }

  /**
   * Om det finns ett Local Storage sedan tidigare, så
   * tas det helt enkelt bort, och därmed tömmer ramschemat.
   */
  deleteCourses(): void {

    let currentStorage: Course[] | null = this.storageHandler.getLocalStorage()

    if (currentStorage) {

      this.storageHandler.deleteLocalStorage()

    }

  }

  /**
   * Hämtar det befintliga ramschemat. Ingen hänsyn tas
   * till och det finns (Course[]) eller ej (null). Den
   * hanteringen görs av anropande logik.
   */
  getCourses(): Course[] {

    return this.storageHandler.getLocalStorage()

  }

}
