import { Component, inject, OnInit } from '@angular/core';
import { NavigationComponent } from "../../shared/navigation/navigation.component";
import { CommonModule } from '@angular/common';
import { AuthService } from 'app/services/auth.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-trainings-page',
  imports: [NavigationComponent, CommonModule],
  templateUrl: './trainings-page.component.html',
  styleUrl: './trainings-page.component.scss'
})
export class TrainingsPageComponent implements OnInit {
  private readonly authService = inject(AuthService);
  
  public readonly isReady$ = new BehaviorSubject<boolean>(true);
  public readonly user$ = this.authService.getCurrentUser$();

  ngOnInit(): void {
    this.authService.getIsReady$().subscribe(isReady => {
      this.isReady$.next(isReady);
    })
  }
}
