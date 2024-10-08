import { Injectable } from '@angular/core'
import { Course } from '../models/course'

@Injectable({
  providedIn: 'root'
})

export class StorageHandlerService {

  constructor() { }

  getLocalStorage(): Course[] {

    const storageAsString = localStorage.getItem('personal-schedule') as string
    const storageAsArray = JSON.parse(storageAsString) as Course[]
    return storageAsArray

  }

  setLocalStorage(courses: Course[]): void {

    this.deleteLocalStorage()
    localStorage.setItem('personal-schedule', JSON.stringify(courses))

  }

  deleteLocalStorage(): void {

    localStorage.removeItem('personal-schedule')

  }

}