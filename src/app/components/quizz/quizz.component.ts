import { Component, inject, NgModule, OnInit } from '@angular/core';
import { WebSocketService } from '../../services/websocket.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-quizz',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './quizz.component.html',
  styleUrl: './quizz.component.scss'
})
export class QuizzComponent implements OnInit {
  problem: string = 'Waiting for problem...';
  answer: string = '';
  username: string = '';
  winner: string = '';
  private _snackBar = inject(MatSnackBar);
  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    while (!this.username.trim()) {
      const input = prompt('Enter your username:');
      this.username = input !== null ? input.trim() : ''; 
    }
    this.webSocketService.messages.subscribe((data) => {
      if (data) {
        if (data.problem) {
          this.problem = data.problem;
        }
        if(data.winner){
          this.winner = data.winner;
          this.openSnackBar();
        }
        if(data.problem_not_available){
          this.openSnackBarProblem(data.problem_not_available);
        }
        if(data.issue){
          this.openSnackBarIssue(data.issue);
        }
      }
    });
  }

  openSnackBar(){
    const snackBarRef = this._snackBar.open(`Winner is ${this.winner}`,'',{
      duration:3000
    })
    snackBarRef.onAction().subscribe(()=>{
      console.log('Winner is : ',this.winner);
    })
  
  }

  openSnackBarProblem(problemMessage:string){
    const snackBarRef = this._snackBar.open(problemMessage,'',{
      duration:3000
    })
    snackBarRef.onAction().subscribe(()=>{
      console.log(`There is some problem : ${problemMessage}`);
    })
  }


  openSnackBarIssue(issueMessage:string){
    const snackBarRef = this._snackBar.open(issueMessage,'',{
      duration:3000
    })

    snackBarRef.onAction().subscribe(()=>{
      console.log('There is an issue',issueMessage);
    })
  }

  submitAnswer(): void {
    this.webSocketService.sendMessage({ answer: this.answer, username: this.username });
    this.answer = '';
  }

}
