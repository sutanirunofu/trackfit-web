import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-diet-calories-page',
  imports: [NgClass],
  templateUrl: './diet-calories-page.component.html',
  styleUrl: './diet-calories-page.component.scss'
})
export class DietCaloriesPageComponent {
  public option: number = 0;

  public setOption(value: number): void {
    this.option = value;
  }
}
