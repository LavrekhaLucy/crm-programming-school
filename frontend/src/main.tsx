import {createRoot} from 'react-dom/client'
import './index.css'
import {RouterProvider} from "react-router-dom";
import {routes} from "./routes/routes.tsx";
import {Provider} from "react-redux";
import {store} from "./components/store/store.ts";
import './services/http/axios';


createRoot(document.getElementById('root')!)

  .render(
    <Provider store={store}>
      <RouterProvider router={routes}/>
    </Provider>

  )