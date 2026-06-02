import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly pressed = output<void>();

  variantClasses(): Record<string, boolean> {
    return {
      'app-button--primary': this.variant() === 'primary',
      'app-button--secondary': this.variant() === 'secondary',
      'app-button--ghost': this.variant() === 'ghost',
    };
  }
}
