import { CommonModule, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastsService } from 'app/services/toasts.service';

@Component({
  selector: 'app-toasts',
  imports: [CommonModule, NgClass],
  templateUrl: './toasts.component.html',
  styleUrl: './toasts.component.scss'
})
export class ToastsComponent {
  private readonly toastsService = inject(ToastsService);
  public readonly toasts$ = this.toastsService.getToasts$();
}
