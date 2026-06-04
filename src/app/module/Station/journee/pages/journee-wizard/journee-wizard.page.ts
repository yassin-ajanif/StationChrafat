import { Component, OnInit, inject, signal } from '@angular/core';
import { TranslatePipe } from '../../../../../core/i18n';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { WizardStepperComponent } from '../../../../../shared/components/wizard-stepper/wizard-stepper.component';
import { JOURNEE_WIZARD_STEPS } from '../../journee-wizard.steps';

@Component({
  selector: 'app-journee-wizard-page',
  standalone: true,
  imports: [RouterOutlet, WizardStepperComponent, TranslatePipe],
  templateUrl: './journee-wizard.page.html',
  styleUrl: './journee-wizard.page.scss',
})
export class JourneeWizardPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly steps = JOURNEE_WIZARD_STEPS;
  readonly currentPath = signal('configuration-step1');

  ngOnInit(): void {
    this.syncPath();
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.syncPath());
  }

  private syncPath(): void {
    const path = this.route.firstChild?.snapshot.url[0]?.path ?? 'configuration-step1';
    this.currentPath.set(path);
  }
}
