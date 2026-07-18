import { Outlet } from "react-router";
import { Footer } from "../components/footer/Footer";
import { NavBarPriv } from "../components/navBarPriv/NavBarPriv";


export const CompanyLayout = () => {
  return (
     <>
    <header>
      <NavBarPriv/>
    </header>
    <main>
      <Outlet/>
    </main>
    <Footer/>
    </>
  )
}
