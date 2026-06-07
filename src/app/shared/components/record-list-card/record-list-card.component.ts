import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '../../../core/i18n';

@Component({
  selector: 'app-record-list-card',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './record-list-card.component.html',
  styleUrl: './record-list-card.component.scss',
})
export class RecordListCardComponent {
  readonly title = input.required<string>();
  readonly meta = input<string>('');
  readonly metaHint = input<string | null>('');
  readonly statusLabel = input.required<string>();
  readonly statusClass = input<string>('');
  readonly statLeftLabel = input.required<string>();
  readonly statLeftValue = input.required<string | null>();
  readonly statLeftAccent = input(false);
  readonly statRightLabel = input.required<string>();
  readonly statRightValue = input.required<string | null>();
  readonly statRightAccent = input(false);

  readonly edited = output<void>();
  readonly deleted = output<void>();
}
