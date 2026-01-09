import { createBrowserRouter } from "react-router-dom"
import AppAuth from "./AppAuth"
import Dashboard from "./Dashboard"
import Main from "../views/Main"
import NotFoundPage from "../views/NotFoundPage"
import Campaign from "../views/Campaign"

export const router = createBrowserRouter([
  {
    element: <AppAuth />, // Root layout with auth listener
    children: [
      {
        path: '/',
        element: (
          
            <Dashboard>
              <Main />
            </Dashboard>
         
        ),
      },
      {
        path: '/campaign',
        element: (
          
            <Dashboard>
              <Campaign />
            </Dashboard>
         
        ),
      },
    ],
    errorElement: <NotFoundPage />
  }
])
