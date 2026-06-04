import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type SidebarNavIconId =
  | 'dashboard'
  | 'station'
  | 'ventes'
  | 'achats'
  | 'stock'
  | 'catalogue'
  | 'journee';

@Component({
  selector: 'app-sidebar-nav-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      class="sidebar-nav-icon size-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      @switch (icon()) {
        @case ('dashboard') {
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        }
        @case ('station') {
          <path d="M3 21h18M5 21V9l7-4 7 4v12M9 21v-6h6v6" />
        }
        @case ('ventes') {
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        }
        @case ('achats') {
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
        }
        @case ('stock') {
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
          <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
        }
        @case ('catalogue') {
          <path d="M4 6h16M4 12h16M4 18h7" />
        }
        @case ('journee') {
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        }
      }
    </svg>
  `,
})
export class SidebarNavIconComponent {
  readonly icon = input.required<SidebarNavIconId>();
}
