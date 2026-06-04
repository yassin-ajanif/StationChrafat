import { formatNumber } from '@angular/common';
import { Pipe, PipeTransform, inject } from '@angular/core';
import { LocaleService, TranslateService } from './i18n';

@Pipe({ name: 'translate', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform {
  private readonly translate = inject(TranslateService);

  transform(key: string, params?: Record<string, string | number>): string {
    this.translate.version();
    this.translate.ready();
    return this.translate.instant(key, params);
  }
}

@Pipe({ name: 'localeNumber', standalone: true, pure: false })
export class LocaleNumberPipe implements PipeTransform {
  private readonly locale = inject(LocaleService);

  transform(value: number | null | undefined, digits = '1.0-0'): string {
    if (value === null || value === undefined) {
      return '';
    }
    this.locale.activeLocale();
    return formatNumber(value, this.locale.localeId(), digits);
  }
}

@Pipe({ name: 'localeCurrency', standalone: true, pure: false })
export class LocaleCurrencyPipe implements PipeTransform {
  private readonly locale = inject(LocaleService);
  private readonly translate = inject(TranslateService);

  transform(value: number | null | undefined, digits = '1.2-2'): string {
    if (value === null || value === undefined) {
      return '';
    }
    this.translate.version();
    this.translate.ready();
    const formatted = formatNumber(value, this.locale.localeId(), digits);
    return `${formatted} ${this.translate.instant('common.currency')}`;
  }
}
