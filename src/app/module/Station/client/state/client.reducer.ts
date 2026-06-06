import { createFeature, createReducer, on } from '@ngrx/store';
import { Client } from './client.store';
import { ClientActions } from './client.actions';

export interface ClientState {
  clients: Client[];
  searchQuery: string;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initial: ClientState = {
  clients: [],
  searchQuery: '',
  loading: false,
  saving: false,
  error: null,
};

export const clientFeature = createFeature({
  name: 'client',
  reducer: createReducer(
    initial,

    on(ClientActions.loadClients, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(ClientActions.loadClientsSuccess, (state, { clients }) => ({
      ...state,
      loading: false,
      clients,
    })),
    on(ClientActions.loadClientsFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    on(ClientActions.addClient, (state) => ({
      ...state,
      saving: true,
      error: null,
    })),
    on(ClientActions.addClientSuccess, (state, { client }) => ({
      ...state,
      saving: false,
      clients: [...state.clients, client],
    })),
    on(ClientActions.addClientFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error,
    })),

    on(ClientActions.updateClient, (state) => ({
      ...state,
      saving: true,
      error: null,
    })),
    on(ClientActions.updateClientSuccess, (state, { client }) => ({
      ...state,
      saving: false,
      clients: state.clients.map((c) => (c.id === client.id ? client : c)),
    })),
    on(ClientActions.updateClientFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error,
    })),

    on(ClientActions.removeClient, (state) => ({
      ...state,
      saving: true,
      error: null,
    })),
    on(ClientActions.removeClientSuccess, (state, { id }) => ({
      ...state,
      saving: false,
      clients: state.clients.filter((c) => c.id !== id),
    })),
    on(ClientActions.removeClientFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error,
    })),

    on(ClientActions.setSearchQuery, (state, { query }) => ({
      ...state,
      searchQuery: query,
    })),
  ),
});
