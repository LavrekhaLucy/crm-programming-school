import {createBrowserRouter} from "react-router-dom";
import App from "../App.tsx";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        // children: [
        //     {path:"/",element:<MainPage/>},
        //     {path:"", element:<PaginationPage/>, children:[
        //             {path:"/orders",element:<OrdersPage/>},
        //                        ]
        //     },
        //     { path: "", element:  },
        //
        //
        // ],
    },
]);