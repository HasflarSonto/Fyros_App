import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';

export interface JournalBehavior {
  id: string;
  name: string;
  description: string;
  category: string;
  isSelected: boolean;
  impact?: number; // percentage impact on recovery/focus
  impactType?: 'positive' | 'negative';
}

export interface JournalCategory {
  id: string;
  name: string;
  behaviors: JournalBehavior[];
}

@Component({
  selector: 'journal',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatCheckboxModule,
    MatCardModule,
    MatProgressBarModule,
    MatChipsModule,
  ],
  templateUrl: './journal.component.html',
  styleUrl: './journal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalComponent {
  readonly selectedTab = signal<string>('logging');
  private readonly selectedBehaviors = signal<Set<string>>(new Set());

  readonly categories: JournalCategory[] = [
    {
      id: 'lifestyle',
      name: 'Lifestyle',
      behaviors: [
        {
          id: 'caffeine',
          name: 'Caffeine',
          description: 'Consume caffeine (coffee, tea, energy drinks)?',
          category: 'lifestyle',
          isSelected: true,
          impact: 16,
          impactType: 'positive',
        },
        {
          id: 'alcohol',
          name: 'Alcohol',
          description: 'Consume alcohol?',
          category: 'lifestyle',
          isSelected: false,
          impact: -15,
          impactType: 'negative',
        },
        {
          id: 'exercise',
          name: 'Exercise',
          description: 'Complete a workout or physical activity?',
          category: 'lifestyle',
          isSelected: true,
          impact: 15,
          impactType: 'positive',
        },
        {
          id: 'work-late',
          name: 'Work Late',
          description: 'Work past 6 PM?',
          category: 'lifestyle',
          isSelected: false,
          impact: -10,
          impactType: 'negative',
        },
        {
          id: 'social-time',
          name: 'Deep Rem Sleep',
          description: 'Spend quality time with friends/family?',
          category: 'lifestyle',
          isSelected: true,
          impact: 18,
          impactType: 'positive',
        },
      ],
    },
    {
      id: 'sleep',
      name: 'Sleep',
      behaviors: [
        {
          id: 'blue-light-glasses',
          name: 'Blue-Light Blocking Glasses',
          description: 'Wear blue-light blocking glasses?',
          category: 'sleep',
          isSelected: true,
          impact: 8,
          impactType: 'positive',
        },
        {
          id: 'sound-machine',
          name: 'Sound Machine',
          description: 'Use white noise or sound machine?',
          category: 'sleep',
          isSelected: false,
          impact: 5,
          impactType: 'positive',
        },
        {
          id: 'sleep-mask',
          name: 'Sleep Mask',
          description: 'Wear a sleep mask?',
          category: 'sleep',
          isSelected: false,
          impact: 4,
          impactType: 'positive',
        },
        {
          id: 'device-in-bed',
          name: 'Device in Bed',
          description: 'Use phone/device in bed?',
          category: 'sleep',
          isSelected: false,
          impact: -12,
          impactType: 'negative',
        },
        {
          id: 'late-meal',
          name: 'Late Meal',
          description: 'Eat within 2 hours of bedtime?',
          category: 'sleep',
          isSelected: false,
          impact: -6,
          impactType: 'negative',
        },
      ],
    },
    {
      id: 'nutrition',
      name: 'Nutrition',
      behaviors: [
        {
          id: 'hydration',
          name: 'Hydration',
          description: 'Drink adequate water (8+ glasses)?',
          category: 'nutrition',
          isSelected: true,
          impact: 10,
          impactType: 'positive',
        },
        {
          id: 'added-sugar',
          name: 'Added Sugar',
          description: 'Consume added sugar?',
          category: 'nutrition',
          isSelected: false,
          impact: -14,
          impactType: 'negative',
        },
        {
          id: 'healthy-meals',
          name: 'Healthy Meals',
          description: 'Eat balanced, nutritious meals?',
          category: 'nutrition',
          isSelected: true,
          impact: 13,
          impactType: 'positive',
        },
        {
          id: 'skipped-meals',
          name: 'Skipped Meals',
          description: 'Skip meals or eat irregularly?',
          category: 'nutrition',
          isSelected: false,
          impact: -10,
          impactType: 'negative',
        },
        {
          id: 'late-meal-nutrition',
          name: 'Late Meal',
          description: 'Eat a late dinner?',
          category: 'nutrition',
          isSelected: false,
          impact: -5,
          impactType: 'negative',
        },
      ],
    },
    {
      id: 'mental-health',
      name: 'Mental Health',
      behaviors: [
        {
          id: 'meditation',
          name: 'Meditation',
          description: 'Practice meditation or mindfulness?',
          category: 'mental-health',
          isSelected: true,
          impact: 14,
          impactType: 'positive',
        },
        {
          id: 'journaling',
          name: 'Journaling',
          description: 'Write in a journal or reflect?',
          category: 'mental-health',
          isSelected: false,
          impact: 7,
          impactType: 'positive',
        },
        {
          id: 'anxiety',
          name: 'High Anxiety',
          description: 'Experience high anxiety levels?',
          category: 'mental-health',
          isSelected: false,
          impact: -18,
          impactType: 'negative',
        },
        {
          id: 'stress',
          name: 'High Stress',
          description: 'Experience high stress levels?',
          category: 'mental-health',
          isSelected: false,
          impact: -16,
          impactType: 'negative',
        },
        {
          id: 'gratitude',
          name: 'Gratitude Practice',
          description: 'Practice gratitude?',
          category: 'mental-health',
          isSelected: false,
          impact: 6,
          impactType: 'positive',
        },
      ],
    },
    {
      id: 'supplements',
      name: 'Supplements',
      behaviors: [
        {
          id: 'melatonin',
          name: 'Melatonin',
          description: 'Take melatonin supplement?',
          category: 'supplements',
          isSelected: true,
          impact: 9,
          impactType: 'positive',
        },
        {
          id: 'vitamin-d',
          name: 'Vitamin D',
          description: 'Take vitamin D supplement?',
          category: 'supplements',
          isSelected: false,
          impact: 6,
          impactType: 'positive',
        },
        {
          id: 'magnesium',
          name: 'Magnesium',
          description: 'Take magnesium supplement?',
          category: 'supplements',
          isSelected: false,
          impact: 5,
          impactType: 'positive',
        },
        {
          id: 'omega-3',
          name: 'Omega-3',
          description: 'Take omega-3 supplement?',
          category: 'supplements',
          isSelected: false,
          impact: 4,
          impactType: 'positive',
        },
        {
          id: 'multivitamin',
          name: 'Multivitamin',
          description: 'Take multivitamin?',
          category: 'supplements',
          isSelected: false,
          impact: 3,
          impactType: 'positive',
        },
      ],
    },
  ];

  readonly tabs = [
    { id: 'logging', name: 'Logging', icon: 'edit' },
    { id: 'productivity', name: 'Productivity', icon: 'trending_up' },
    { id: 'focus', name: 'Focus', icon: 'center_focus_strong' },
    { id: 'energy', name: 'Energy', icon: 'battery_charging_full' },
    { id: 'mental-health', name: 'Mental Health', icon: 'psychology' },
  ];

  readonly allBehaviors = computed(() => {
    return this.categories.flatMap((category) => category.behaviors);
  });

  readonly filteredBehaviors = computed(() => {
    const tab = this.selectedTab();
    if (tab === 'logging') {
      return this.allBehaviors();
    }
    // For impact analysis tabs, show behaviors that affect that metric
    const filtered = this.allBehaviors().filter((behavior) => {
      switch (tab) {
        case 'productivity':
          return [
            'caffeine',
            'exercise',
            'work-late',
            'social-time',
            'hydration',
            'healthy-meals',
            'skipped-meals',
            'meditation',
            'journaling',
            'anxiety',
            'stress',
          ].includes(behavior.id);
        case 'focus':
          return [
            'caffeine',
            'exercise',
            'blue-light-glasses',
            'sound-machine',
            'sleep-mask',
            'device-in-bed',
            'late-meal',
            'hydration',
            'added-sugar',
            'meditation',
            'anxiety',
            'stress',
          ].includes(behavior.id);
        case 'energy':
          return [
            'caffeine',
            'alcohol',
            'exercise',
            'work-late',
            'hydration',
            'added-sugar',
            'healthy-meals',
            'skipped-meals',
            'late-meal-nutrition',
            'melatonin',
            'vitamin-d',
            'magnesium',
          ].includes(behavior.id);
        case 'mental-health':
          return [
            'alcohol',
            'exercise',
            'work-late',
            'social-time',
            'meditation',
            'journaling',
            'anxiety',
            'stress',
            'gratitude',
            'melatonin',
            'vitamin-d',
            'magnesium',
          ].includes(behavior.id);
        default:
          return false;
      }
    });

    // Sort by impact: positive first (descending), then negative (ascending: -10 > -18)
    return filtered.sort((a, b) => {
      const aIsPositive = a.impactType === 'positive';
      const bIsPositive = b.impactType === 'positive';

      // Positive items come first
      if (aIsPositive && !bIsPositive) return -1;
      if (!aIsPositive && bIsPositive) return 1;

      // Within positive group: sort descending (highest first: 18 > 12)
      if (aIsPositive && bIsPositive) {
        return (b.impact || 0) - (a.impact || 0);
      }

      // Within negative group: sort by absolute value descending
      // This puts -10 before -18 because |10| < |18|
      const aAbs = Math.abs(a.impact || 0);
      const bAbs = Math.abs(b.impact || 0);
      return aAbs - bAbs;
    });
  });

  readonly selectedBehaviorsList = computed(() => {
    const selected = this.selectedBehaviors();
    return this.allBehaviors().filter((behavior) => selected.has(behavior.id));
  });

  readonly impactAnalysis = computed(() => {
    const selected = this.selectedBehaviorsList();
    const positiveImpacts = selected.filter((b) => b.impactType === 'positive');
    const negativeImpacts = selected.filter((b) => b.impactType === 'negative');

    return {
      positive: positiveImpacts,
      negative: negativeImpacts,
      totalPositive: positiveImpacts.reduce((sum, b) => sum + (b.impact || 0), 0),
      totalNegative: negativeImpacts.reduce((sum, b) => sum + (b.impact || 0), 0),
    };
  });

  selectTab(tabId: string): void {
    this.selectedTab.set(tabId);
  }

  toggleBehavior(behaviorId: string): void {
    const selected = new Set(this.selectedBehaviors());
    if (selected.has(behaviorId)) {
      selected.delete(behaviorId);
    } else {
      selected.add(behaviorId);
    }
    this.selectedBehaviors.set(selected);
  }

  isBehaviorSelected(behaviorId: string): boolean {
    return this.selectedBehaviors().has(behaviorId);
  }

  getCurrentTabImpact(): {
    positive: JournalBehavior[];
    negative: JournalBehavior[];
    totalPositive: number;
    totalNegative: number;
  } {
    const tab = this.selectedTab();
    const selected = this.selectedBehaviorsList();

    // Filter behaviors that affect the current metric
    const relevantBehaviors = selected.filter((behavior) => {
      switch (tab) {
        case 'productivity':
          return [
            'caffeine',
            'exercise',
            'work-late',
            'social-time',
            'hydration',
            'healthy-meals',
            'skipped-meals',
            'meditation',
            'journaling',
            'anxiety',
            'stress',
          ].includes(behavior.id);
        case 'focus':
          return [
            'caffeine',
            'exercise',
            'blue-light-glasses',
            'sound-machine',
            'sleep-mask',
            'device-in-bed',
            'late-meal',
            'hydration',
            'added-sugar',
            'meditation',
            'anxiety',
            'stress',
          ].includes(behavior.id);
        case 'energy':
          return [
            'caffeine',
            'alcohol',
            'exercise',
            'work-late',
            'hydration',
            'added-sugar',
            'healthy-meals',
            'skipped-meals',
            'late-meal-nutrition',
            'melatonin',
            'vitamin-d',
            'magnesium',
          ].includes(behavior.id);
        case 'mental-health':
          return [
            'alcohol',
            'exercise',
            'work-late',
            'social-time',
            'meditation',
            'journaling',
            'anxiety',
            'stress',
            'gratitude',
            'melatonin',
            'vitamin-d',
            'magnesium',
          ].includes(behavior.id);
        default:
          return false;
      }
    });

    const positiveImpacts = relevantBehaviors.filter((b) => b.impactType === 'positive');
    const negativeImpacts = relevantBehaviors.filter((b) => b.impactType === 'negative');

    return {
      positive: positiveImpacts,
      negative: negativeImpacts,
      totalPositive: positiveImpacts.reduce((sum, b) => sum + (b.impact || 0), 0),
      totalNegative: negativeImpacts.reduce((sum, b) => sum + (b.impact || 0), 0),
    };
  }

  getTabDisplayName(tabId: string): string {
    const tab = this.tabs.find((t) => t.id === tabId);
    return tab ? tab.name : tabId;
  }

  getImpactBarWidth(impact: number | undefined): number {
    if (!impact) return 0;
    // Scale percentage to bar width (e.g., 20% impact = 40% bar width from center)
    return Math.min(Math.abs(impact) * 2, 100); // Scale to max 100% from center
  }

  getImpactBarPosition(behavior: JournalBehavior): string {
    if (!behavior.impact) return 'center';
    if (behavior.impactType === 'positive') {
      return `50%`; // Start at center, extend right
    } else {
      return `50%`; // Start at center, extend left
    }
  }

  getImpactBarEndPosition(behavior: JournalBehavior): number {
    if (!behavior.impact) return 50;
    const width = this.getImpactBarWidth(behavior.impact);
    if (behavior.impactType === 'positive') {
      return 50 + width; // Extend right from center
    } else {
      return 50 - width; // Extend left from center
    }
  }

  getImpactColor(impactType: 'positive' | 'negative'): string {
    return impactType === 'positive' ? '#809076' : '#ff9800';
  }
}
