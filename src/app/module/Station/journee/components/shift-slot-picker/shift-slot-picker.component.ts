import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '../../../../../core/i18n'
import { ShiftSlot } from '../../state/journee.store';

interface SlotOption {
  value: ShiftSlot;
  labelKey: string;
  hoursKey: string;
  icon: string;
}

@Component({
  selector: 'app-shift-slot-picker',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './shift-slot-picker.component.html',
  styleUrl: './shift-slot-picker.component.scss',
})
export class ShiftSlotPickerComponent {
  readonly selected = input<ShiftSlot | null>(null);
  readonly selectedChange = output<ShiftSlot>();

  readonly slots: SlotOption[] = [
    { value: 'Matin', labelKey: 'journee.shift.matin', hoursKey: 'journee.shift.matinHours', icon: '☀' },
    { value: 'Apres-midi', labelKey: 'journee.shift.apresMidi', hoursKey: 'journee.shift.apresMidiHours', icon: '☀' },
    { value: 'Nuit', labelKey: 'journee.shift.nuit', hoursKey: 'journee.shift.nuitHours', icon: '☽' },
  ];
}
