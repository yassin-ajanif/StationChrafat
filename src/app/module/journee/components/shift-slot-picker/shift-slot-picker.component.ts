import { Component, input, output } from '@angular/core';
import { ShiftSlot } from '../../models/journee.model';

interface SlotOption {
  value: ShiftSlot;
  label: string;
  hours: string;
  icon: string;
}

@Component({
  selector: 'app-shift-slot-picker',
  standalone: true,
  templateUrl: './shift-slot-picker.component.html',
  styleUrl: './shift-slot-picker.component.scss',
})
export class ShiftSlotPickerComponent {
  readonly selected = input<ShiftSlot | null>(null);
  readonly selectedChange = output<ShiftSlot>();

  readonly slots: SlotOption[] = [
    { value: 'Matin', label: 'Matin', hours: '06h – 14h', icon: '☀' },
    { value: 'Apres-midi', label: 'Après-midi', hours: '14h – 22h', icon: '☀' },
    { value: 'Nuit', label: 'Nuit', hours: '22h – 06h', icon: '☽' },
  ];
}
