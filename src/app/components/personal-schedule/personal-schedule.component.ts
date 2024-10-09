import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { Course } from '../../models/course'
import { StorageHandlerService } from '../../services/storage-handler.service'
import { ScheduleHandlerService } from '../../services/schedule-handler.service'

enum SortOrder {
  'Ascending' = 0,
  'Descending' = 1
}

@Component({
  selector: 'app-personal-schedule',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './personal-schedule.component.html',
  styleUrl: './personal-schedule.component.css'
})

export class PersonalScheduleComponent implements OnInit {

  // Diverse globala variabler, A-Ö
  errorMessage: string = ''
  numberOfCourses: number = 0
  numberOfPoints: number = 0
  personalSchedule: Course[] = []
  sortedCode: number = SortOrder.Ascending
  sortedName: number = SortOrder.Ascending
  sortedPoints: number = SortOrder.Ascending
  sortedSubject: number = SortOrder.Ascending

  constructor(
    private scheduleHandler: ScheduleHandlerService,
    private storageHandler: StorageHandlerService
  ) { }

  ngOnInit(): void {

    // Läser in befintligt ramschema, om finnes.
    this.personalSchedule = (this.storageHandler.getLocalStorage()) ? this.storageHandler.getLocalStorage() : []

    // Anger totalt antal kurser i befintligt ramschema
    this.numberOfCourses = this.personalSchedule.length

    this.calculatePoints()

  }

  /**
   * 
   */
  calculatePoints(): void {

    if (this.personalSchedule.length > 0) {
      
      for (const course of this.personalSchedule) {
        
        this.numberOfPoints += course.points

      }

    }

  }

  /**
   * 
   */
  emptySchedule(): void {



  }

  /**
   * 
   */
  removeFromCourseList(courseCode: string): void {



  }

  /**
   * Avgränsningen för sorteringen är att den sorterar
   * BEFINTLIGT resultat, det vill säga efter en eventuell
   * filtrering, alltså det som för närvarande finns i 
   * variabeln coursesFiltered.
   */
  sortCourses(column: string): void {

    switch (column) {
      case 'code':

        if (this.sortedCode === SortOrder.Ascending) {

          this.personalSchedule.sort((a, b) => (a.courseCode.toLowerCase() < b.courseCode.toLowerCase() ? -1 : 1))

          this.sortedCode = SortOrder.Descending

        } else {

          this.personalSchedule.sort((a, b) => (a.courseCode.toLowerCase() < b.courseCode.toLowerCase() ? 1 : -1))

          this.sortedCode = SortOrder.Ascending

        }

        break
      case 'name':

        if (this.sortedName === SortOrder.Ascending) {

          this.personalSchedule.sort((a, b) => (a.courseName.toLowerCase() < b.courseName.toLowerCase() ? -1 : 1))

          this.sortedName = SortOrder.Descending

        } else {

          this.personalSchedule.sort((a, b) => (a.courseName.toLowerCase() < b.courseName.toLowerCase() ? 1 : -1))

          this.sortedName = SortOrder.Ascending

        }

        break
      case 'points':

        if (this.sortedPoints === SortOrder.Ascending) {

          this.personalSchedule.sort((a, b) => (a.points > b.points ? -1 : 1))

          this.sortedPoints = SortOrder.Descending

        } else {

          this.personalSchedule.sort((a, b) => (a.points > b.points ? 1 : -1))

          this.sortedPoints = SortOrder.Ascending

        }

        break
      case 'subject':

        if (this.sortedSubject === SortOrder.Ascending) {

          this.personalSchedule.sort((a, b) => (a.subject.toLowerCase() < b.subject.toLowerCase() ? -1 : 1))

          this.sortedSubject = SortOrder.Descending

        } else {

          this.personalSchedule.sort((a, b) => (a.subject.toLowerCase() < b.subject.toLowerCase() ? 1 : -1))

          this.sortedSubject = SortOrder.Ascending

        }

        break
      default:
        // Felaktigt val, ignorera...
        break
    }

  }

}
