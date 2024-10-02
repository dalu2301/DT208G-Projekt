import { Routes } from '@angular/router'
import { CoursesComponent } from './components/courses/courses.component'
import { PersonalScheduleComponent } from './components/personal-schedule/personal-schedule.component'
import { NotFoundComponent } from './components/not-found/not-found.component'

export const routes: Routes = [
    { path: '', redirectTo: 'courses', pathMatch: 'full' },
    { path: 'courses', component: CoursesComponent, title: 'Kurs- och programlista' },
    { path: 'schedule', component: PersonalScheduleComponent, title: 'Personligt ramschema' },
    { path: '**', component: NotFoundComponent, title: '404' }
]
