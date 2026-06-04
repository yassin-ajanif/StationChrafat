import { Component, inject } from '@angular/core';
import { AppLocaleId, LocaleService, TranslatePipe } from '../../../core/i18n';

@Component({
  selector: 'app-locale-switcher',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './locale-switcher.component.html',
  styleUrl: './locale-switcher.component.scss',
})
export class LocaleSwitcherComponent {
  private readonly locale = inject(LocaleService);

  readonly activeLocale = this.locale.activeLocale;

  async setLocale(locale: AppLocaleId): Promise<void> {
    await this.locale.setLocale(locale);
  }

  isActive(locale: AppLocaleId): boolean {
    return this.activeLocale() === locale;
  }
}
