// import {createBrowserRouter, Navigate} from 'react-router-dom';
// import App from '../App.tsx';
// import Login from '../components/login/login.tsx';
// import OrdersPage from '../pages/OrdersPage.tsx';
// import { MainPage } from '../pages/MainPage.tsx';
//
// export const routes = createBrowserRouter([
//     {
//         path: "/",
//         element: <Navigate to="/login" replace />,
//     },
//     {
//         path: "/login",
//         element: <Login />,
//     },
//
//     {
//         path: "/app",
//         element: <App />,
//         children: [
//             { path: "/", element: <MainPage /> },
//             { path: "/orders", element: <OrdersPage /> },
//         ],
//     }
//     ]);