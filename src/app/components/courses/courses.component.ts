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

  // Diverse globala variabler, A-Ö
  courses: Course[] = []
  coursesFiltered: Course[] = []
  errorMessage: string = ''
  filterFormGroup: FormGroup
  numberOfCoursesCurrent: number = 0
  numberOfCoursesTotal: number = 0
  personalSchedule: Course[] | null = []
  sliceEnd: number = 0
  sliceStart: number = 0
  sortedCode: number = SortOrder.Ascending
  sortedName: number = SortOrder.Ascending
  sortedPoints: number = SortOrder.Ascending
  sortedSubject: number = SortOrder.Ascending
  subjects: string[] = []
  subjectsSelected: string = ''

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

        // Sätter antalet inlästa rader på
        // sidan till initialt 50 stycken.
        this.sliceEnd = 50

        // Läser in personligt ramschema (om finnes). Detta 
        // för att kunna avgöra vilka rader som ska ha en
        // "disabled"-knapp för "Lägg till".
        this.personalSchedule = this.scheduleHandler.getCourses()

      },

      error: (error) => {

        this.errorMessage = error.message

      }

    })

  }

  /**
   * Lägger till en kurs till det egna ramschemat.
   */
  addToCourseList(courseCode: string, event: Event): void {

    // Hanterar knappen, det vill säga currentTarget, och
    // lägger till attributet "disabled", för att förhindra
    // att kursen kan läggas till flera gånger i ramschemat.
    let currentButton = event.currentTarget as HTMLButtonElement
    currentButton.setAttribute('disabled', '')

    // Hämtar kompletterande uppgifter, det vill säga
    // en komplett representation av interface Course.
    const courseToAdd: Course[] = this.courses.filter((course) => {
      return course.courseCode === courseCode
    })

    // Lägger till kurs med hjälp av dedikerad service.
    this.scheduleHandler.addCourse(courseToAdd)

    // Läser in det uppdaterade personliga ramschemat i 
    // minnet, detta för att kunna sätta alla knappar
    // korrekt till "disabled" där det behövs.
    this.personalSchedule = this.scheduleHandler.getCourses()

  }

  /**
   * Prestandamässigt så är detta kanske inte bästa lösningen,
   * då en Property-bind är gjord på returvärdet av en metod,
   * men jag kom inte på något bättre sätt just nu att hantera
   * "disabled" för redan tillagda kurser. Möjligvis så skulle
   * man kunnat plocka bort raden från courses[] i stället.
   */
  disabledButton(courseCode: string): boolean {

    let codeFound: Course[] = []

    // Inte null, så någon sorts data finns lagrad sedan tidigare.
    if (this.personalSchedule) {

      // Kontrollerar om just den kurskoden vi hanterar för tillfället
      // finns med i det personliga ramschemat.
      codeFound = this.personalSchedule.filter(item => item.courseCode === courseCode)

      if (codeFound.length > 0) {

        // Ja, kurskoden fanns, sätt knapp till "disabled".
        return true

      } else {

        // Nej, korskoden fanns inte, ignorera och fortsätt.
        return false

      }

    } else {

      // Inget personligt ramschema finns, bara ignorera och fortsätt.
      return false

    }

  }

  /**
   * Läser in ytterligare rader per klick, default 50
   * Lösningen bygger på att "slica" listan innan den
   * skrivt ut. Börjar med rad 1 till och med 50, lägger
   * sedan på fler rader, det vill säga "slicar" ut en 
   * större protion av listan, exempelvis rad 1 till och
   * med 100 etcetera. Försöker dock anpassa antalet 
   * rader efter hur många som är kvar att läsa in, 
   * baserat på filtrering.
   */
  expandSlice(): void {

    if (this.sliceEnd < this.numberOfCoursesCurrent) {

      let difference: number = this.numberOfCoursesCurrent - this.sliceEnd

      if (difference > 50) {

        this.sliceEnd += 50

      } else {

        this.sliceEnd += difference

      }

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

    // Nollställer radinläsningen innan en ny uträckning görs,
    // baserad på filtreringen nedan.
    this.sliceEnd = 0

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

    // Nu finns det uppdaterade siffror vad gäller filtrering,
    // så ett nytt anrop av funktionen för radinläsning görs.
    this.expandSlice()

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

          this.coursesFiltered.sort((a, b) => (a.courseCode.toLowerCase() < b.courseCode.toLowerCase() ? -1 : 1))

          this.sortedCode = SortOrder.Descending

        } else {

          this.coursesFiltered.sort((a, b) => (a.courseCode.toLowerCase() < b.courseCode.toLowerCase() ? 1 : -1))

          this.sortedCode = SortOrder.Ascending

        }

        break
      case 'name':

        if (this.sortedName === SortOrder.Ascending) {

          this.coursesFiltered.sort((a, b) => (a.courseName.toLowerCase() < b.courseName.toLowerCase() ? -1 : 1))

          this.sortedName = SortOrder.Descending

        } else {

          this.coursesFiltered.sort((a, b) => (a.courseName.toLowerCase() < b.courseName.toLowerCase() ? 1 : -1))

          this.sortedName = SortOrder.Ascending

        }

        break
      case 'points':

        if (this.sortedPoints === SortOrder.Ascending) {

          this.coursesFiltered.sort((a, b) => (a.points > b.points ? -1 : 1))

          this.sortedPoints = SortOrder.Descending

        } else {

          this.coursesFiltered.sort((a, b) => (a.points > b.points ? 1 : -1))

          this.sortedPoints = SortOrder.Ascending

        }

        break
      case 'subject':

        if (this.sortedSubject === SortOrder.Ascending) {

          this.coursesFiltered.sort((a, b) => (a.subject.toLowerCase() < b.subject.toLowerCase() ? -1 : 1))

          this.sortedSubject = SortOrder.Descending

        } else {

          this.coursesFiltered.sort((a, b) => (a.subject.toLowerCase() < b.subject.toLowerCase() ? 1 : -1))

          this.sortedSubject = SortOrder.Ascending

        }

        break
      default:
        // Felaktigt val, ignorera...
        break
    }

  }

  /**
 * Plockar ut unika ämnesområden för Select-elementet.
 * Prestandamässigt är det nog inte bästa alternativet
 * att använda Map, men med en så pass liten datamångd
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