import { Injectable } from '@angular/core'
import { Course } from '../models/course'

@Injectable({
  providedIn: 'root'
})

export class StorageHandlerService {

  constructor() { }

  static getLocalStorage(): Course[] {
    return []
  }

  static setLocalStorage(courses: Course[]): void {
    console.log(courses)
  }

  static deleteLocalStorage(): void {

  }


}
