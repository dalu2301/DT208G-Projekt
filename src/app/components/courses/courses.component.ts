import { Component, OnInit } from '@angular/core'
import { Course } from '../../models/course'
import { CourseHandlerService } from '../../services/course-handler.service'
import { CommonModule } from '@angular/common'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { ScheduleHandlerService } from '../../services/schedule-handler.service'

enum SortOrder {
  'Ascending' = 0,
  'Descending' = 1
}

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})

export class CoursesComponent implements OnInit {

  // Diverse globala variabler
  filterFormGroup: FormGroup
  courses: Course[] = []
  coursesFiltered: Course[] = []
  subjects: string[] = []
  subjectsSelected: string = ''
  errorMessage: string = ''
  numberOfCoursesTotal: number = 0
  numberOfCoursesCurrent: number = 0
  sliceStart: number = 0
  sliceEnd: number = 0

  disabledButton: boolean = false

  constructor(
    private courseHandler: CourseHandlerService,
    private scheduleHandler: ScheduleHandlerService
  ) {

    // Skapa ett Reactive Forms-formulär
    this.filterFormGroup = new FormGroup({

      filterInput: new FormControl(''),
      filterSelect: new FormControl('')

    })

  }

  // Initieringslogik
  ngOnInit(): void {

    // Börjar med att hämta in data från JSON-fil
    this.courseHandler.getCourses().subscribe({

      next: (courses) => {

        // Originallistan ("facit")
        this.courses = courses
        // Lista som kommer att filtreras
        this.coursesFiltered = courses
        // Ämnesområden för select-element
        this.subjects = this.uniqueSubjects(this.courses)
        // Information om antalet hittade kurser utifrån filtrering
        this.numberOfCoursesTotal = courses.length
        this.numberOfCoursesCurrent = courses.length
        // Sätter antalet initialt inlästa rader på
        // sidan till 50 stycken.
        this.sliceEnd = 50

      },

      error: (error) => {

        this.errorMessage = error.message

      }

    })

  }

  /**
   * Lägger till en kurs i eget ramschema. 
   * 
   */
  addToCourseList(courseCode: string, event: Event): void {

    // TODO: Arbeta vidare på detta sen, om tid finnes...
    let currentButton = event.currentTarget as HTMLButtonElement
    currentButton.setAttribute('disabled', 'true')

    const courseToAdd: Course[] = this.courses.filter((course) => {
      return course.courseCode === courseCode
    })

    this.scheduleHandler.addCourse(courseToAdd[0])

  }

  /**
   * Läser in ytterligare 50 rader per klick
   */
  expandSlice(): void {

    // TODO: Gör denna baserad på återstående antal, och inte 50 alltid...
    if (this.sliceEnd < this.numberOfCoursesCurrent) {
      this.sliceEnd += 50
    }

  }

  /**
   * Metoden tar hänsyn till om bara 1) fritextfiltrering, 2) filtrering
   * via Select, eller om 3) både Select- och fritextfiltrering gjorts.
   * 
   * 1) Om ingen filtrering gjorts via Select, då utgår fritextfiltreringen
   * från originallistan, det vill säga courses: Course[]
   * 
   * 2) Om ingen filtrering gjorts via fritext, då utgår Select-filtreringen
   * från originallistan, det vill säga courses: Course[]
   * 
   * 3) Om både fritextfiltrering och Select-filtrering gjorts, då 
   * börjar filtreringen med att läsa ut enligt Select, för att sedan
   * filtrera igen via fritext på redan Select-filtrerade data.
   */
  filterCourses(): void {

    let filterInput: string = this.filterFormGroup.value.filterInput
    let filterSelect: string = this.filterFormGroup.value.filterSelect

    // Nollställer, det vill säga sätter till 50, sidinläsningen.
    this.sliceEnd = 50

    if (filterSelect.length === 0) {

      // Ingen filtrering via Select är gjord,
      // filtrera endast med hjälp av fritext.
      if (filterInput.length > 0) {

        this.coursesFiltered = this.courses.filter(course => {
          return (
            (course.courseName.toLowerCase().includes(filterInput.toLowerCase())) ||
            (course.courseCode.toLocaleLowerCase().includes(filterInput.toLowerCase()))
          )

        })

        this.numberOfCoursesCurrent = this.coursesFiltered.length

      } else {

        // Ingen fritextfiltrering är gjord i detta fall.
        // Select är återställd, det vill säga 0 (value=""),
        // så läs in hela listan igen.
        this.coursesFiltered = this.courses
        this.numberOfCoursesCurrent = this.courses.length

      }

    } else {

      // Filtrering är gjord via Select. Kontrollera
      // om det finns en fritextfiltrering också.
      let coursesFilteredTwice: Course[] = []

      if (filterInput.length > 0) {

        // Fritextfiltrering gjord. Börjar med att avgränsa 
        // filtreringsmängden till det valda ämnesområdet.
        coursesFilteredTwice = this.coursesFiltered = this.courses.filter(subject => {
          return subject.subject.toLowerCase() === filterSelect.toLowerCase()
        })

        // Skapar sedan en lista utifrån fritextfiltrering också
        // med hjälp av mellanlagrad data i variabeln courseFilteredTwice.
        this.coursesFiltered = coursesFilteredTwice.filter(course => {
          return (
            (course.courseName.toLowerCase().includes(filterInput.toLowerCase())) ||
            (course.courseCode.toLocaleLowerCase().includes(filterInput.toLowerCase()))
          )

        })

        this.numberOfCoursesCurrent = this.coursesFiltered.length

      } else {

        // Ingen fritextfiltrering gjord. Returnera ett
        // resultat endast baserat på filtrering via Select.
        this.coursesFiltered = this.courses.filter(subject => {
          return subject.subject.toLowerCase() === filterSelect.toLowerCase()
        })

        this.numberOfCoursesCurrent = this.coursesFiltered.length

      }

    }

  }

  /**
 * Plockar ut unika ämnesområden för Select-elementet.
 * Prestandamässigt är det nog inte bästa alternativet
 * att använda Map, men med en så pass lite datamångd
 * som i detta fall, så fyller det sin funktion väl.
 */
  uniqueSubjects(array: Course[]): string[] {

    const map = new Map()

    for (const item of array) {

      // Om värde (subject) redan finns, då skrivs
      // helt enkelt värdet över, vilket resulterar
      // i en Map med unika värden.
      map.set(item.subject, item.subject)

    }

    // Konverterar Map till Array innan retur.
    // Sorterar enligt 'sv' för att åtgärda ÅÄÖ
    return Array.from(map.values()).sort((a: any, b: any) => a.localeCompare(b, 'sv'))

  }

}