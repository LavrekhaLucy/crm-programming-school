import { createBrowserRouter } from 'react-router-dom';
import App from '../App.tsx';
import Login from '../components/login/login.tsx';
import OrdersPage from '../pages/OrdersPage.tsx';
import { MainPage } from '../pages/MainPage.tsx';
import { PaginationPage } from '../pages/PaginationPage.tsx';

export const routes = createBrowserRouter([
  {
      path: "/", element: <App />,
      children: [
          { path: "/", element: <MainPage /> },
          { path: "/login", element: <Login /> },
          {
              path: "", element: <PaginationPage />, children: [
                  { path: "/orders", element: <OrdersPage /> },
              ]
          },
      ],
  }
]);