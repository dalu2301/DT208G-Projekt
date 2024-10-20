import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { LinksHandlerService } from '../../services/links-handler.service'
import { Links } from '../../models/links'

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
export class NavigationComponent implements OnInit {

  navigation: Links[] = []

  constructor(private linksHandler: LinksHandlerService) { }
  
  ngOnInit(): void {
    
    this.navigation = this.linksHandler.getLinks()

  }

}
