import { Injectable } from '@angular/core'
import { Course } from '../models/course'

@Injectable({
  providedIn: 'root'
})

export class ScheduleHandlerService {

  constructor() { }

  // FLYTTA ÖVER ALL LOGIK FRÅN STORAGE-HANDLER HIT I STÄLLET!
  addCourse(course: Course): void {

    console.log(course)

  }

}
