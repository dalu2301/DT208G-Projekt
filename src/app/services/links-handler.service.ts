import { Injectable } from '@angular/core'
import { Links } from '../models/links'

@Injectable({
  providedIn: 'root'
})

export class LinksHandlerService {

  navigationLinks: Links[] = [
    { name: 'Våra kurser', route: 'courses' },
    { name: 'Mitt ramschema', route: 'schedule' }
  ]

  getLinks(): Links[] {

    return this.navigationLinks

  }

}
