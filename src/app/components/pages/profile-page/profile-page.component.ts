import { Component, inject, OnInit } from '@angular/core';
import { IUser } from './user.interface';
import { AuthService } from 'app/services/auth.service';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from "../../shared/navigation/navigation.component";

@Component({
  selector: 'app-profile-page',
  imports: [RouterModule, CommonModule, NavigationComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit {

  private readonly authService = inject(AuthService);

  public user$ = new BehaviorSubject<IUser | null>(null);

  ngOnInit(): void {
    this.authService.me().subscribe(response => {
      console.log(response);
      if (response?.id) {
        this.user$.next(response);
      }
    })
  }

  logout() {
    this.authService.logout();
    this.user$.next(null);
  }
}
