import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'

@Component({
  selector: 'app-personal-schedule',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './personal-schedule.component.html',
  styleUrl: './personal-schedule.component.css'
})

export class PersonalScheduleComponent {

  arrayOfNumbers: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]

}
