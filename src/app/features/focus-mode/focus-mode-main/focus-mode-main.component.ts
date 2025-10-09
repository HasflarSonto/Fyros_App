import {
  ChangeDetectionStrategy,
  Component,
  effect,
  HostBinding,
  HostListener,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { expandAnimation } from '../../../ui/animations/expand.ani';
import { TaskCopy } from '../../tasks/task.model';
import { from, Observable, of, Subject } from 'rxjs';
import { GlobalConfigService } from '../../config/global-config.service';
import { TaskService } from '../../tasks/task.service';
import { first, switchMap, take, takeUntil } from 'rxjs/operators';
import { TaskAttachmentService } from '../../tasks/task-attachment/task-attachment.service';
import { fadeAnimation } from '../../../ui/animations/fade.ani';
import { IssueService } from '../../issue/issue.service';
import { Store } from '@ngrx/store';
import {
  completeTask,
  decrementCycle,
  incrementCycle,
  pauseFocusSession,
  resetCycles,
  selectFocusTask,
  setFocusSessionDuration,
  skipBreak,
  startBreak,
  startFocusSession,
  unPauseFocusSession,
} from '../store/focus-mode.actions';
import { selectTimeDuration } from '../store/focus-mode.selectors';
import { TaskSharedActions } from '../../../root-store/meta/task-shared.actions';
import { SimpleCounterService } from '../../simple-counter/simple-counter.service';
import { SimpleCounter } from '../../simple-counter/simple-counter.model';
import { ICAL_TYPE } from '../../issue/issue.const';
import { TaskTitleComponent } from '../../../ui/task-title/task-title.component';
import {
  EnhancedProgressCircleComponent,
  SideMetric,
} from '../../../ui/progress-circle/enhanced-progress-circle.component';
import { MatIconAnchor, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { InlineMarkdownComponent } from '../../../ui/inline-markdown/inline-markdown.component';
import { AsyncPipe } from '@angular/common';
import { MsToMinuteClockStringPipe } from '../../../ui/duration/ms-to-minute-clock-string.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { T } from '../../../t.const';
import { IssueIconPipe } from '../../issue/issue-icon/issue-icon.pipe';
import { SimpleCounterButtonComponent } from '../../simple-counter/simple-counter-button/simple-counter-button.component';
import { TaskAttachmentListComponent } from '../../tasks/task-attachment/task-attachment-list/task-attachment-list.component';
import { slideInOutFromBottomAni } from '../../../ui/animations/slide-in-out-from-bottom.ani';
import { FocusModeService } from '../focus-mode.service';
import { BreathingDotComponent } from '../../../ui/breathing-dot/breathing-dot.component';
import { ConfettiService } from '../../../core/confetti/confetti.service';

@Component({
  selector: 'focus-mode-main',
  templateUrl: './focus-mode-main.component.html',
  styleUrls: ['./focus-mode-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [expandAnimation, fadeAnimation, slideInOutFromBottomAni],
  imports: [
    TaskTitleComponent,
    EnhancedProgressCircleComponent,
    BreathingDotComponent,
    MatIconButton,
    MatTooltip,
    MatIcon,
    MatIconAnchor,
    InlineMarkdownComponent,
    TaskAttachmentListComponent,
    AsyncPipe,
    MsToMinuteClockStringPipe,
    TranslatePipe,
    IssueIconPipe,
    SimpleCounterButtonComponent,
    MatMiniFabButton,
  ],
})
export class FocusModeMainComponent implements OnDestroy {
  readonly simpleCounterService = inject(SimpleCounterService);
  private readonly _globalConfigService = inject(GlobalConfigService);
  readonly taskService = inject(TaskService);
  private readonly _taskAttachmentService = inject(TaskAttachmentService);
  private readonly _issueService = inject(IssueService);
  private readonly _store = inject(Store);

  focusModeService = inject(FocusModeService);
  private readonly _confettiService = inject(ConfettiService);

  timeElapsed = this.focusModeService.timeElapsed;
  isCountTimeDown = this.focusModeService.isCountTimeDown;

  @HostBinding('class.isShowNotes') isShowNotes: boolean = false;

  task: TaskCopy | null = null;
  isFocusNotes = false;
  isDragOver: boolean = false;

  // defaultTaskNotes: string = '';
  defaultTaskNotes: string = '';
  T: typeof T = T;

  // Random variation signals
  private readonly _focusValue = signal(45); // Start at middle of range
  private readonly _tirednessValue = signal(20); // Start at middle of range
  private _variationInterval?: number;

  issueUrl$: Observable<string | null> = this.taskService.currentTask$.pipe(
    switchMap((v) => {
      if (!v) {
        return of(null);
      }
      return v.issueType && v.issueId && v.issueProviderId
        ? from(this._issueService.issueLink(v.issueType, v.issueId, v.issueProviderId))
        : of(null);
    }),
    take(1),
  );

  private _onDestroy$ = new Subject<void>();
  private _dragEnterTarget?: HTMLElement;

  constructor() {
    // Start random variation every second
    this._startRandomVariation();

    // Use effect to reactively update defaultTaskNotes
    effect(() => {
      const misc = this._globalConfigService.misc();
      if (misc) {
        this.defaultTaskNotes = misc.taskNotesTpl;
      }
    });
    this.taskService.currentTask$.pipe(takeUntil(this._onDestroy$)).subscribe((task) => {
      this.task = task;
      if (!task) {
        this._store.dispatch(selectFocusTask());
      }
    });
  }

  private _startRandomVariation(): void {
    this._variationInterval = window.setInterval(() => {
      // Random variation for Focus (30-60)
      const currentFocus = this._focusValue();
      const focusChange = (Math.random() - 0.5) * 6; // ±3 variation
      const newFocus = Math.max(30, Math.min(60, currentFocus + focusChange));
      this._focusValue.set(Math.round(newFocus));

      // Random variation for Tiredness (10-30)
      const currentTiredness = this._tirednessValue();
      const tirednessChange = (Math.random() - 0.5) * 4; // ±2 variation
      const newTiredness = Math.max(10, Math.min(30, currentTiredness + tirednessChange));
      this._tirednessValue.set(Math.round(newTiredness));
    }, 1000);
  }

  @HostListener('dragenter', ['$event']) onDragEnter(ev: DragEvent): void {
    this._dragEnterTarget = ev.target as HTMLElement;
    ev.preventDefault();
    ev.stopPropagation();
    this.isDragOver = true;
  }

  @HostListener('dragleave', ['$event']) onDragLeave(ev: DragEvent): void {
    if (this._dragEnterTarget === (ev.target as HTMLElement)) {
      ev.preventDefault();
      ev.stopPropagation();
      this.isDragOver = false;
    }
  }

  @HostListener('drop', ['$event']) onDrop(ev: DragEvent): void {
    if (!this.task) {
      return;
    }
    this._taskAttachmentService.createFromDrop(ev, this.task.id);
    ev.stopPropagation();
    this.isDragOver = false;
  }

  ngOnDestroy(): void {
    this._onDestroy$.next();
    this._onDestroy$.complete();
    if (this._variationInterval) {
      clearInterval(this._variationInterval);
    }
  }

  changeTaskNotes($event: string): void {
    if (
      !this.defaultTaskNotes ||
      !$event ||
      $event.trim() !== this.defaultTaskNotes.trim()
    ) {
      if (this.task === null) {
        throw new Error('Task is not loaded');
      }
      this.taskService.update(this.task.id, { notes: $event });
    }
  }

  finishCurrentTask(): void {
    this._store.dispatch(completeTask());
    // always go to task selection afterward
    this._store.dispatch(selectFocusTask());

    const id = this.task && this.task.id;
    if (id) {
      this._store.dispatch(
        TaskSharedActions.updateTask({
          task: {
            id,
            changes: {
              isDone: true,
              doneOn: Date.now(),
            },
          },
        }),
      );
    }
  }

  trackById(i: number, item: SimpleCounter): string {
    return item.id;
  }

  updateTaskTitleIfChanged(isChanged: boolean, newTitle: string): void {
    if (isChanged) {
      if (!this.task) {
        throw new Error('No task data');
      }
      this.taskService.update(this.task.id, { title: newTitle });
    }
  }

  extendSession(): void {
    this._store
      .select(selectTimeDuration)
      .pipe(first())
      .subscribe((currentDuration) => {
        const fiveMinutesInMs = 5 * 60 * 1000; // 5 minutes in milliseconds
        const extendedDuration = currentDuration + fiveMinutesInMs;
        this._store.dispatch(
          setFocusSessionDuration({ focusSessionDuration: extendedDuration }),
        );
      });
  }

  skipToBreak(): void {
    // Skip current work session and start a break
    this._store.dispatch(skipBreak());

    // Get current cycle before incrementing
    const currentCycle = this.focusModeService.currentCycle() ?? 1;

    // Check if we just completed all 4 work sessions
    if (currentCycle === 4) {
      this._celebrateCompletion();
      // Reset cycles after celebration
      setTimeout(() => {
        this._store.dispatch(resetCycles());
      }, 2000); // Wait 2 seconds for confetti to play
    }

    const pomodoroConfig = this.focusModeService.pomodoroConfig();

    const cyclesBeforeLong = pomodoroConfig?.cyclesBeforeLongerBreak ?? 4;
    // Calculate break type based on current cycle (before incrementing)
    // Long break should come after completing cycle 4 (so when currentCycle === 4)
    const isLongBreak = currentCycle % cyclesBeforeLong === 0;

    const breakDuration = isLongBreak
      ? (pomodoroConfig?.longerBreakDuration ?? 15 * 60 * 1000) // 15 minutes
      : (pomodoroConfig?.breakDuration ?? 5 * 60 * 1000); // 5 minutes

    this._store.dispatch(
      startBreak({
        duration: breakDuration,
        isLongBreak,
      }),
    );

    // Increment cycle AFTER determining break type
    this._store.dispatch(incrementCycle());
  }

  skipToWork(): void {
    // Skip current break and start a work session
    this._store.dispatch(skipBreak());

    // Decrement cycle when going back to work (unless already at cycle 1)
    const currentCycle = this.focusModeService.currentCycle() ?? 1;
    if (currentCycle > 1) {
      this._store.dispatch(decrementCycle());
    }

    // Start a new work session
    const pomodoroConfig = this.focusModeService.pomodoroConfig();
    const workDuration = pomodoroConfig?.duration ?? 25 * 60 * 1000; // 25 minutes

    this._store.dispatch(startFocusSession({ duration: workDuration }));
  }

  togglePause(): void {
    if (this.focusModeService.isRunning()) {
      this._store.dispatch(pauseFocusSession());
    } else {
      this._store.dispatch(unPauseFocusSession());
    }
  }

  private _celebrateCompletion(): void {
    const defaults = { startVelocity: 80, spread: 720, ticks: 600, zIndex: 0 };
    const particleCount = 200;

    // Create confetti from multiple positions for a grand celebration
    this._confettiService.createConfetti({
      ...defaults,
      particleCount,
      origin: { x: 0.2, y: 0.8 },
    });

    this._confettiService.createConfetti({
      ...defaults,
      particleCount,
      origin: { x: 0.5, y: 0.8 },
    });

    this._confettiService.createConfetti({
      ...defaults,
      particleCount,
      origin: { x: 0.8, y: 0.8 },
    });
  }

  // Methods for enhanced progress circle metrics
  getFocusMetric(): SideMetric | null {
    return {
      value: this._focusValue(),
      label: 'Focus',
      color: '#809076ff',
      position: 'left' as const,
    };
  }

  getTirednessMetric(): SideMetric | null {
    return {
      value: this._tirednessValue(),
      label: 'Tiredness',
      color: '#6a8591ff',
      position: 'right' as const,
    };
  }

  protected readonly ICAL_TYPE = ICAL_TYPE;
}
