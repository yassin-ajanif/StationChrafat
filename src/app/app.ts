import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LocaleService } from './core/i18n';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly locale = inject(LocaleService);

  constructor() {
    effect(() => {
      this.locale.activeLocale();
      this.locale.direction();
    });
  }
}
