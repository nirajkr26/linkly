import { createRootRouteWithContext } from "@tanstack/react-router";
import RootLayout from "../RootLayout";
import { QueryClient } from "@tanstack/react-query";
import {type  AppStore } from "../store/store";

/**
 * Define the structure of the context that will be 
 * available to all routes in the tree.
 */
interface MyRouterContext {
  queryClient: QueryClient;
  store: AppStore;
}

/**
 * Using createRootRouteWithContext allows us to pass 
 * global instances (like Redux and React Query) down the tree.
 */
export const rootRoute = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
});