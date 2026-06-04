import { formatNumber } from '@angular/common';
import { Pipe, PipeTransform, inject } from '@angular/core';
import { LocaleService } from './locale.service';

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
