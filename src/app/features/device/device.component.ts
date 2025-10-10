import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'device',
  standalone: true,
  imports: [],
  templateUrl: './device.component.html',
  styleUrl: './device.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceComponent {
  constructor() {}
}
