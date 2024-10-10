import { Injectable } from '@angular/core'
import { Course } from '../models/course'

@Injectable({
  providedIn: 'root'
})

export class StorageHandlerService {

  constructor() { }

  /**
   * Hämtar det Local Storage som heter 'personal-schedule',
   * samt gör om JSON-strängen till ett Course[]-objekt
   * innan retur.
   */
  getLocalStorage(): Course[] {

    const storageAsString = localStorage.getItem('personal-schedule') as string
    const storageAsArray = JSON.parse(storageAsString) as Course[]
    return storageAsArray

  }

  /**
   * Tar bort det redan existerande ramschemat från 
   * Local Storage (onödigt, men livrem och hängslen...),
   * och gör sedan om Course[]-objektet till en JSON-sträng
   * innan skrivning till Local Storage igen.
   */
  setLocalStorage(courses: Course[]): void {

    this.deleteLocalStorage()
    localStorage.setItem('personal-schedule', JSON.stringify(courses))

  }

  /**
   * Tar bort det befintliga Local Storage, kvittar
   * om det finns eller ej sean tidiage.
   */
  deleteLocalStorage(): void {

    localStorage.removeItem('personal-schedule')

  }

}