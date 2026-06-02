import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
})
export class AppShellComponent {
  readonly navItems: NavItem[] = [
    { label: 'Dashboard', route: '/journees' },
    { label: 'Lavage', route: '/lavage' },
    { label: 'Vidange', route: '/vidange' },
    { label: 'Station', route: '/station' },
    { label: 'Journée', route: '/journees' },
  ];
}
