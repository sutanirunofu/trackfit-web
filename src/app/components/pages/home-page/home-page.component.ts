import { Component, inject } from '@angular/core';
import { NavigationComponent } from "../../shared/navigation/navigation.component";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home-page',
  imports: [NavigationComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  private readonly titleService: Title = inject(Title);

  ngOnInit(): void {
    this.titleService.setTitle("TrackFit")
  }
}
