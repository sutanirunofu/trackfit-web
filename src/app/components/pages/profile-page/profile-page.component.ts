import { Component, inject } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from "../../shared/navigation/navigation.component";

@Component({
  selector: 'app-profile-page',
  imports: [RouterModule, CommonModule, NavigationComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {

  private readonly authService = inject(AuthService);

  public user$ = this.authService.getCurrentUser$();

  logout() {
    this.authService.logout()
  }
}
