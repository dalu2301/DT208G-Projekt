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
  coursesFiltered: Course[] = []
  subjects: string[] = []
  errorMessage: string = ''

  constructor(private courseHandler: CourseHandlerService) { }

  ngOnInit(): void {

    // Börjar med att hämta in data från JSON-fil
    this.courseHandler.getCourses().subscribe({

      next: (courses) => {

        this.courses = courses
        this.coursesFiltered = courses
        this.subjects = this.uniqueSubjects(this.courses)
        console.log(this.subjects)

      },

      error: (error) => {

        this.errorMessage = error.message

      }

    })

  }
  
  // Plockar ut unika ämnesområden för select-elementet
  uniqueSubjects(array: Course[]): string[] {

    const map = new Map();

    for (const item of array) {

      // Om värde (subject) redan finns, då skrivs
      // helt enkelt värdet över, vilket resulterar
      // i en Map med unika värden.
      map.set(item.subject, item.subject)

    }

    // ToDo: Sortera alfabetiskt innan retur...
   
    // Konverterar Map till Array innan retur.
    return Array.from(map.values())

  }

}