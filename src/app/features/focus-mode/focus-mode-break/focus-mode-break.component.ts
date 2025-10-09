import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  OnDestroy,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FocusModeService } from '../focus-mode.service';
import { MsToMinuteClockStringPipe } from '../../../ui/duration/ms-to-minute-clock-string.pipe';
import { Store } from '@ngrx/store';
import { completeBreak, skipBreak } from '../store/focus-mode.actions';
import { MatIcon } from '@angular/material/icon';
import { T } from '../../../t.const';
import { TranslatePipe } from '@ngx-translate/core';
import { TaskTrackingInfoComponent } from '../task-tracking-info/task-tracking-info.component';
import {
  EnhancedProgressCircleComponent,
  SideMetric,
} from '../../../ui/progress-circle/enhanced-progress-circle.component';

@Component({
  selector: 'focus-mode-break',
  standalone: true,
  imports: [
    MatButtonModule,
    MatProgressSpinnerModule,
    MsToMinuteClockStringPipe,
    MatIcon,
    TranslatePipe,
    TaskTrackingInfoComponent,
    EnhancedProgressCircleComponent,
  ],
  templateUrl: './focus-mode-break.component.html',
  styleUrl: './focus-mode-break.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FocusModeBreakComponent implements OnDestroy {
  readonly focusModeService = inject(FocusModeService);
  private readonly _store = inject(Store);
  T: typeof T = T;

  // Random variation signals for break metrics
  private readonly _relaxationValue = signal(35); // Start at middle of range (50-20)
  private readonly _meditationValue = signal(35); // Start at middle of range (60-10)
  private _variationInterval?: number;

  constructor() {
    // Start random variation every second
    this._startRandomVariation();
  }

  private _startRandomVariation(): void {
    this._variationInterval = window.setInterval(() => {
      // Random variation for Relaxation (50-20)
      const currentRelaxation = this._relaxationValue();
      const relaxationChange = (Math.random() - 0.5) * 6; // ±3 variation
      const newRelaxation = Math.max(
        20,
        Math.min(50, currentRelaxation + relaxationChange),
      );
      this._relaxationValue.set(Math.round(newRelaxation));

      // Random variation for Meditation (60-10)
      const currentMeditation = this._meditationValue();
      const meditationChange = (Math.random() - 0.5) * 8; // ±4 variation
      const newMeditation = Math.max(
        10,
        Math.min(60, currentMeditation + meditationChange),
      );
      this._meditationValue.set(Math.round(newMeditation));
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this._variationInterval) {
      clearInterval(this._variationInterval);
    }
  }

  readonly remainingTime = computed(() => {
    return this.focusModeService.timeRemaining() || 0;
  });

  readonly progressPercentage = computed(() => {
    return this.focusModeService.progress() || 0;
  });

  readonly breakTypeLabel = computed(() =>
    this.focusModeService.isBreakLong()
      ? T.F.FOCUS_MODE.LONG_BREAK
      : T.F.FOCUS_MODE.SHORT_BREAK,
  );

  skipBreak(): void {
    this._store.dispatch(skipBreak());
  }

  completeBreak(): void {
    this._store.dispatch(completeBreak());
  }

  // Methods for enhanced progress circle metrics
  getRelaxationMetric(): SideMetric | null {
    return {
      value: this._relaxationValue(),
      label: 'Relaxation',
      color: '#809076ff',
      position: 'left' as const,
    };
  }

  getMeditationMetric(): SideMetric | null {
    return {
      value: this._meditationValue(),
      label: 'Meditation',
      color: '#6a8591ff',
      position: 'right' as const,
    };
  }
}
