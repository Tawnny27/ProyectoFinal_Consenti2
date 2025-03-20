import { Outlet } from 'react-router-dom';
import  Navbar  from './componentes/navBar';
import  Sidebar  from './componentes/Sidebar';
import Footer from './componentes/footer';
import './VistaInicial.css';
import { useState } from 'react';
export const VistaPrincipal = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const setearSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    }

    return (
        <div className="contPrincipal">
            <Navbar />
            <div className={sidebarOpen ? "orderViewOpen" : "orderViewClose"}>
                <Sidebar/>
                <div className='pageContainer'>
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>

    )
}
