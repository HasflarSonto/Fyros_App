import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'device',
  standalone: true,
  imports: [],
  templateUrl: './device.component.html',
  styleUrl: './device.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceComponent {
  private readonly router = inject(Router);

  openAdvancedMode(): void {
    // Navigate to a new advanced mode page
    this.router.navigate(['/advanced-mode']);
  }
}
