import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface NavLink {
  label: string;
  route: string;
  exact?: boolean;
}

interface NavGroup {
  label: string;
  baseRoute: string;
  children: NavLink[];
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
})
export class AppShellComponent {
  private readonly router = inject(Router);

  readonly navLinks: NavLink[] = [
    { label: 'Dashboard', route: '/journees', exact: true },
    { label: 'Lavage', route: '/lavage' },
    { label: 'Vidange', route: '/vidange' },
    { label: 'Journée', route: '/journees' },
  ];

  readonly navGroups: NavGroup[] = [
    {
      label: 'Station',
      baseRoute: '/station',
      children: [{ label: 'Stock', route: '/station/stock' }],
    },
  ];

  readonly stationExpanded = signal(true);

  readonly isStationRoute = computed(() => this.router.url.startsWith('/station'));

  toggleStationMenu(): void {
    this.stationExpanded.update((expanded) => !expanded);
  }
}
