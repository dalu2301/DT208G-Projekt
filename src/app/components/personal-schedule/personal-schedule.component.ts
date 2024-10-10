import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { Course } from '../../models/course'
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
    private scheduleHandler: ScheduleHandlerService
  ) { }

  ngOnInit(): void {

    // Läser in befintligt ramschema, om finnes.
    this.personalSchedule = (this.scheduleHandler.getCourses()) ? this.scheduleHandler.getCourses() : []

    // Anger totalt antal kurser i befintligt ramschema
    this.numberOfCourses = this.personalSchedule.length

    // Räknar ut totala antalet poäng för valda kurser
    this.calculatePoints()

  }

  /**
   * Räknar ut det totala poängantalet för det personliga
   * ramschemat genom att loopa igenom och summera.
   */
  calculatePoints(): void {
    
    this.numberOfPoints = 0

    if (this.personalSchedule.length > 0) {

      for (const course of this.personalSchedule) {

        this.numberOfPoints += course.points

      }

    }

  }

  /**
   * Erbjuder valet att ta bort hela det personliga ramschemat.
   */
  emptySchedule(): void {

    // Tar bort hela Local Storage.
    this.scheduleHandler.deleteCourses()

    // "Nollställer" det personliga ramschemat.
    this.personalSchedule = []
    this.numberOfCourses = 0
    this.numberOfPoints = 0

  }

  /**
   * Tar bort - "filtrerar bort" - den valda kursen från det
   * personliga ramschemat.
   */
  removeFromCourseList(courseCode: string): void {

    // Skapar en ny temporär Course[] med alla kurser FÖRUTOM aktuell kurs.
    let filteredSchedule: Course[] = this.personalSchedule.filter((course) => course.courseCode !== courseCode)
    this.personalSchedule = filteredSchedule

    // Skriver det uppdaterade ramschemat till Local Storage igen.
    this.scheduleHandler.updateCourses(this.personalSchedule)

    // Uppdaterar totala antalet kurser i ramschemat.
    this.numberOfCourses = this.personalSchedule.length

    // Uppdaterar totala antalet poäng för valda kurser.
    this.calculatePoints()

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
