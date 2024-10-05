import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QuizzComponent } from "./components/quizz/quizz.component";
import { HeaderComponent } from './components/header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, QuizzComponent,HeaderComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'quizui';
}
