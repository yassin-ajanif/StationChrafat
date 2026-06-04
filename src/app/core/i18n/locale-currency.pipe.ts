import { formatNumber } from '@angular/common';
import { Pipe, PipeTransform, inject } from '@angular/core';
import { LocaleService } from './locale.service';
import { TranslateService } from './translate.service';

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
