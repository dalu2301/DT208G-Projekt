import { Component, OnInit } from '@angular/core'
import { Course } from '../../models/course'
import { CourseHandlerService } from '../../services/course-handler.service'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})

export class CoursesComponent implements OnInit {

  courses: Course[] = []
  errorMessage: string = ''

  constructor(private courseHandler: CourseHandlerService) { }

  ngOnInit(): void {

    this.courseHandler.getCourses().subscribe({

      next: (courses) => this.courses = courses,

      error: (error) => this.errorMessage = error.message

    })

  }

}
