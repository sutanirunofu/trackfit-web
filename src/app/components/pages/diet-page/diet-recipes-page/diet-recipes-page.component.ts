import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RecipesService } from 'app/services/recipes.service';

@Component({
  selector: 'app-diet-recipes-page',
  imports: [CommonModule],
  templateUrl: './diet-recipes-page.component.html',
  styleUrl: './diet-recipes-page.component.scss'
})
export class DietRecipesPageComponent {
  private readonly recipesService = inject(RecipesService);
  
  public readonly isReady$ = this.recipesService.getIsReady$();
  public readonly recipes$ = this.recipesService.getAll$();
}
