import { Component, OnInit } from '@angular/core'
import { LinksHandlerService } from '../../services/links-handler.service'
import { Links } from '../../models/links'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent implements OnInit {

  navigation: Links[] = []

  constructor(private linksHander: LinksHandlerService) { }

  ngOnInit(): void {

    this.navigation = this.linksHander.getLinks()

  }

}
