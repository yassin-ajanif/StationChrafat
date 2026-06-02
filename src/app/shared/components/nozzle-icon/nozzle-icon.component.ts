import { Component, input } from '@angular/core';

@Component({
  selector: 'app-nozzle-icon',
  standalone: true,
  templateUrl: './nozzle-icon.component.html',
  styleUrl: './nozzle-icon.component.scss',
})
export class NozzleIconComponent {
  readonly size = input<'sm' | 'md' | 'lg'>('md');
}
