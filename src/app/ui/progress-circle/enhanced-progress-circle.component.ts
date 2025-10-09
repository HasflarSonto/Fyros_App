import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  Renderer2,
  viewChild,
} from '@angular/core';

export interface SideMetric {
  value: number;
  label: string;
  color: string;
  position: 'left' | 'right';
}

@Component({
  selector: 'enhanced-progress-circle',
  templateUrl: './enhanced-progress-circle.component.html',
  styleUrls: ['./enhanced-progress-circle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnhancedProgressCircleComponent implements OnDestroy {
  private readonly _renderer = inject(Renderer2);

  progress = input<number>(0);
  leftMetric = input<SideMetric | null>(null);
  rightMetric = input<SideMetric | null>(null);

  readonly progressCircle = viewChild<ElementRef>('progressCircle');

  private _timeOutCancelFn?: () => void;
  private _intervalId?: number;

  constructor() {
    effect(() => {
      const progressCircle = this.progressCircle();
      if (progressCircle) {
        let progress = this.progress() || 0;
        if (progress > 100) {
          progress = 100;
        }

        this._renderer.setStyle(
          progressCircle.nativeElement,
          'stroke-dasharray',
          `${progress} ,100`,
        );
      }
    });

    // Start random variation every second
    this._startRandomVariation();
  }

  ngOnDestroy(): void {
    if (this._timeOutCancelFn) {
      this._timeOutCancelFn();
    }
    if (this._intervalId) {
      clearInterval(this._intervalId);
    }
  }

  private _startRandomVariation(): void {
    this._intervalId = window.setInterval(() => {
      // Trigger change detection by updating a signal or similar
      // Since we can't directly modify inputs, we'll use a different approach
      // The parent component will handle the random variation
    }, 1000);
  }

  // Helper function to convert polar coordinates to Cartesian
  polarToCartesian(
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number,
  ): { x: number; y: number } {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    const cosValue = radius * Math.cos(angleInRadians);
    const sinValue = radius * Math.sin(angleInRadians);
    return {
      x: centerX + cosValue,
      y: centerY + sinValue,
    };
  }

  // Function to create an arc path
  createArcPath(
    cx: number,
    cy: number,
    r: number,
    startAngle: number,
    endAngle: number,
  ): string {
    const start = this.polarToCartesian(cx, cy, r, endAngle);
    const end = this.polarToCartesian(cx, cy, r, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return ['M', start.x, start.y, 'A', r, r, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  }

  // Get thumb position for side metrics
  getThumbPosition(metric: SideMetric): { x: number; y: number } {
    const cx = 250;
    const cy = 250;
    const radius = 216; // 180 * 1.2

    let angle: number;
    if (metric.position === 'left') {
      // Focus arc: 200° to 250° (50° range)
      // Map value 30-60 to angle 200°-250°
      // When value is 60, angle is 200° (top)
      // When value is 30, angle is 250° (bottom)
      const valueRange = 60 - 30;
      const normalizedValue = (metric.value - 30) / valueRange; // 0 to 1
      const angleRange = 50;
      const angleOffset = normalizedValue * angleRange;
      angle = 250 - angleOffset; // 250° to 200°
    } else {
      // Tiredness arc: 110° to 160° (50° range)
      // Map value 10-30 to angle 110°-160°
      // When value is 30, angle is 110° (top)
      // When value is 10, angle is 160° (bottom)
      const tirednessValueRange = 30 - 10;
      const tirednessNormalizedValue = (metric.value - 10) / tirednessValueRange; // 0 to 1
      const tirednessAngleRange = 50;
      const tirednessAngleOffset = tirednessNormalizedValue * tirednessAngleRange;
      angle = 160 - tirednessAngleOffset; // 160° to 110°
    }

    return this.polarToCartesian(cx, cy, radius, angle);
  }

  // Get text position for side metrics
  getTextPosition(metric: SideMetric): { x: number; y: number } {
    const thumbPos = this.getThumbPosition(metric);
    const offsetX = metric.position === 'left' ? -18 : 18; // 15 * 1.2
    return {
      x: thumbPos.x + offsetX,
      y: thumbPos.y + 12, // 10 * 1.2
    };
  }

  // Get label position for side metrics
  getLabelPosition(metric: SideMetric): { x: number; y: number } {
    const thumbPos = this.getThumbPosition(metric);
    const offsetX = metric.position === 'left' ? -18 : 18; // 15 * 1.2
    return {
      x: thumbPos.x + offsetX,
      y: thumbPos.y + 42, // 35 * 1.2
    };
  }
}
