import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'

interface NavigationLinks {
  name: string,
  route: string
}

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {

  navigationLinks: NavigationLinks[] = [
    { name: 'Våra kurser', route: 'courses' },
    { name: 'Mitt ramschema', route: 'schedule' }
  ]

}
