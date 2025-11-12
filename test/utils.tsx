import { createRootRoute, createRoute, createRouter, RouterProvider } from "@tanstack/react-router"
import { render, RenderOptions } from "@testing-library/react"
import { ReactElement } from "react"
import { history } from "./setup"
import { getContext } from "@/integrations/tanstack-query/root-provider"


const customRender = (
  ui: ReactElement,
  options?: RenderOptions,
) => {
  const rootRoute = createRootRoute()
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => ui,
    context: getContext,
  })
  const routeTree = rootRoute.addChildren([indexRoute])
  const router = createRouter({ routeTree, history })

  return render(<RouterProvider router={router} />, options)
}

export * from '@testing-library/react'
export { customRender as render }
