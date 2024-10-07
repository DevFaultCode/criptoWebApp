import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';
import { userInterface } from './user.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  authService = inject(AuthService)

  ngOnInit(): void {
    this.authService.user$.subscribe((user: userInterface | null) => {
      if (user) {
        this.authService.currentUserSig.set({
          email: user.email,
          displayName: user.displayName
        })
      } else {
        this.authService.currentUserSig.set(null)
      }
      
    })
  }
  title = 'pruebaTecnicaChinchin';
}
