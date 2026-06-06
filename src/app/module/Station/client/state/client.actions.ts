import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Client, ClientDraft } from './client.store';

export const ClientActions = createActionGroup({
  source: 'Client',
  events: {
    'Load Clients': emptyProps(),
    'Load Clients Success': props<{ clients: Client[] }>(),
    'Load Clients Failure': props<{ error: string }>(),

    'Add Client': props<{ draft: ClientDraft }>(),
    'Add Client Success': props<{ client: Client }>(),
    'Add Client Failure': props<{ error: string }>(),

    'Update Client': props<{ id: number; draft: ClientDraft }>(),
    'Update Client Success': props<{ client: Client }>(),
    'Update Client Failure': props<{ error: string }>(),

    'Remove Client': props<{ id: number }>(),
    'Remove Client Success': props<{ id: number }>(),
    'Remove Client Failure': props<{ error: string }>(),

    'Set Search Query': props<{ query: string }>(),
  },
});
