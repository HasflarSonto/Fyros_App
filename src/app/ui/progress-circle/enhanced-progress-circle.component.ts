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
  timeDisplay = input<string>('00:00');
  leftMetric = input<SideMetric | null>(null);
  rightMetric = input<SideMetric | null>(null);

  readonly progressCircle = viewChild<ElementRef>('progressCircle');

  private _timeOutCancelFn?: () => void;

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
  }

  ngOnDestroy(): void {
    if (this._timeOutCancelFn) {
      this._timeOutCancelFn();
    }
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
    const radius = 180;

    let middleAngle: number;
    if (metric.position === 'left') {
      // Left arc (200° to 250°)
      middleAngle = (200 + 250) / 2; // 225 degrees
    } else {
      // Right arc (110° to 160°)
      middleAngle = (110 + 160) / 2; // 135 degrees
    }

    return this.polarToCartesian(cx, cy, radius, middleAngle);
  }

  // Get text position for side metrics
  getTextPosition(metric: SideMetric): { x: number; y: number } {
    const thumbPos = this.getThumbPosition(metric);
    const offsetX = metric.position === 'left' ? -15 : 15;
    return {
      x: thumbPos.x + offsetX,
      y: thumbPos.y + 10,
    };
  }

  // Get label position for side metrics
  getLabelPosition(metric: SideMetric): { x: number; y: number } {
    const thumbPos = this.getThumbPosition(metric);
    const offsetX = metric.position === 'left' ? -15 : 15;
    return {
      x: thumbPos.x + offsetX,
      y: thumbPos.y + 35,
    };
  }
}
