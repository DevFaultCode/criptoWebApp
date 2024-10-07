import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
  
  authService = inject(AuthService)
  private router = inject(Router); 
  // Controla cuál formulario mostrar: true para login, false para signup
  showLoginForm: boolean = true;

  // Definir el FormGroup para el login y signup
  loginForm: FormGroup;
  signupForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Formilario de login
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Formilario de registro
    this.signupForm = this.fb.nonNullable.group({
      user: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', Validators.required]
    });
  }

  // Método para alternar los formularios de login y registro
  toggleForms() {
    this.showLoginForm = !this.showLoginForm;
  }

  errorMessage: string | null = null;

  // Método para manejar el envío del formulario de login
  onLoginSubmit() {
    if (this.loginForm.valid) {
      const rawForm = this.loginForm.getRawValue();
      this.authService
        .login(rawForm.email, rawForm.password)
        .subscribe({
          next: () => {
            console.log('Login successful');
            
            this.router.navigateByUrl('/dashboard');
          },
          error: (err) => {
            this.errorMessage = 'Correo o Contraseña incorrecto';
            console.log('Error de inicio de sesión:', err); // Esto te permitirá ver el error en la consola
            alert(this.errorMessage);
          }
        }) 
    }
  }

  // Método para manejar el envío del formulario de registro
  onSignupSubmit() {
    if (this.signupForm.valid) {
      const rawForm = this.signupForm.getRawValue();
      if (rawForm.password !== rawForm.passwordConfirm) {
        this.errorMessage = "Las contraseñas no coinciden";
        alert(this.errorMessage);
        return;
      }
      this.authService
        .register(rawForm.email, rawForm.user, rawForm.password)
        .subscribe({
          next: () => {
            this.router.navigateByUrl('/dashboard');
          },
          error: (err) => {
            this.errorMessage = "Error en el registro";
            alert(this.errorMessage);
          }
        }) 
    }
  }

  ngOnInit(): void {}
}