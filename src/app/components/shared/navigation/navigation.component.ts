import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent } from "../logo/logo.component";
import { AuthService } from 'app/services/auth.service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { IUser } from 'app/components/pages/profile-page/user.interface';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, LogoComponent, CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit {
  
  private readonly authService = inject(AuthService);

  public user$ = new BehaviorSubject<IUser | null>(null);

  ngOnInit(): void {
    this.authService.me().subscribe(response => {
      if (response?.id) {
        this.user$.next(response);
      }
    })
  }
}
