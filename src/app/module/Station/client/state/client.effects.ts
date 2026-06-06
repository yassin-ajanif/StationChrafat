import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { ClientApi } from '../data-access/client.api';
import { ClientActions } from './client.actions';

@Injectable()
export class ClientEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(ClientApi);

  loadClients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.loadClients),
      switchMap(() =>
        this.api.getClients().pipe(
          map((clients) => ClientActions.loadClientsSuccess({ clients })),
          catchError((err) =>
            of(
              ClientActions.loadClientsFailure({
                error: err?.message ?? 'Erreur chargement clients',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  addClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.addClient),
      switchMap(({ draft }) =>
        this.api.createClient(draft).pipe(
          map((client) => ClientActions.addClientSuccess({ client })),
          catchError((err) =>
            of(ClientActions.addClientFailure({ error: err?.message ?? 'Erreur ajout client' })),
          ),
        ),
      ),
    ),
  );

  updateClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.updateClient),
      switchMap(({ id, draft }) =>
        this.api.updateClient(id, draft).pipe(
          map((client) => ClientActions.updateClientSuccess({ client })),
          catchError((err) =>
            of(ClientActions.updateClientFailure({ error: err?.message ?? 'Erreur modification client' })),
          ),
        ),
      ),
    ),
  );

  removeClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.removeClient),
      switchMap(({ id }) =>
        this.api.deleteClient(id).pipe(
          map(() => ClientActions.removeClientSuccess({ id })),
          catchError((err) =>
            of(ClientActions.removeClientFailure({ error: err?.message ?? 'Erreur suppression client' })),
          ),
        ),
      ),
    ),
  );
}
