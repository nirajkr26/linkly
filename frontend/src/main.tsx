import { createRoot } from 'react-dom/client';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routing/routeTree'; // .js extension removed for TS
import { store } from './store/store';
import { Provider } from 'react-redux';

// 1. Initialize QueryClient
export const queryClient = new QueryClient();

// 2. Create the Router instance with context
const router = createRouter({
  routeTree,
  context: {
    queryClient,
    store,
  },
});

// 3. Register the router instance for type safety across the app
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// 4. Safely get the root element
const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  );
}