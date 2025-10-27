import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'advanced-mode',
  standalone: true,
  imports: [],
  templateUrl: './advanced-mode.component.html',
  styleUrl: './advanced-mode.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvancedModeComponent {
  private readonly router = inject(Router);

  goBack(): void {
    this.router.navigate(['/device']);
  }
}
