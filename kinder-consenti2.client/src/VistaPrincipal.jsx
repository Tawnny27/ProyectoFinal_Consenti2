import { Outlet } from 'react-router-dom';
import  Navbar  from './componentes/navBar';
import  Sidebar  from './componentes/Sidebar';
import Footer from './componentes/footer';
import './VistaInicial.css';
import { useState } from 'react';
export const VistaPrincipal = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const setearSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="contPrincipal">
            <Navbar setearSide={setearSidebar} />
            <div className={sidebarOpen ? "orderViewOpen" : "orderViewClose"}>
                <Sidebar ViewSidebard={sidebarOpen} />
                <div className='pageContainer'>
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>

    )
}
