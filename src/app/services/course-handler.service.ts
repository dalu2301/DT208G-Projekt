import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, Observable } from 'rxjs'
import { Course } from '../models/course'

@Injectable({
  providedIn: 'root'
})

export class CourseHandlerService {

  private fileAddress: string = 'miun_courses.json'

  constructor(private http: HttpClient) { }

  getCourses(): Observable<Course[]> {

    return this.http.get<Course[]>(this.fileAddress)

  }

}
