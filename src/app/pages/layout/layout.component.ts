import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth.service'; // Ajusta la ruta según tu estructura
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  constructor(private authService: AuthService, private router: Router) { }

  home() {
    this.router.navigate(['/']);
  }
  exchange() {
    this.router.navigate(['/exchange']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
