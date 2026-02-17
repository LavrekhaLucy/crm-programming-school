import {Outlet} from "react-router-dom";
import {Header} from "./components/header/Header.tsx";
import {Footer} from "./components/footer/Footer.tsx";



function App() {


  return (
    <div>

      <Header/>
      <Outlet/>
      <Footer/>
    </div>


  )
}

export default App
