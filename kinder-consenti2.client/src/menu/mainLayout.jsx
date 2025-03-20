import {  useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './mainLayout.css';

import { useUserContext } from '../UserContext';


const MainLayout = () => {
    const navigate = useNavigate();
    //const location = useLocation();
    //const usuario = location.state?.usuario; // Obtener el objeto usuario desde el estado
    const { user } = useUserContext();

    useEffect(() => {
        console.log('MainLayout montado');
        return () => {
            console.log('MainLayout desmontado');
        };
    }, []);


    useEffect(() => {
        console.log(user)
        // Valida si el usuario necesita cambiar su contrase�a
        if (user.passGenerico === true) {
            navigate('/change-password');
        }
    }, []);

    useEffect(() => {
        if (Object.keys(user).length === 0) {
            navigate('/');
        }
    }, [user]);

    
    return (
        <div className="main-layout">
           
           {/* <Navbar />*/}
            { /* Lateral */}
            <div className="content-container">
           { /*<Sidebar /> */}
                <main className="main-content">
                    <div className="bienvenidos">
                        <h1>!Bienvenido!</h1>
                        <img src='/static/media/logo.347a6ba3d825eb7f06e8.jpg' alt='' style={{ width: '150px', paddingTop: '50px' }} />
                        <p className="welcome-text">
                            En Kínder Consenti2, nos dedicamos a brindar una experiencia de aprendizaje amorosa y enriquecedora para los más pequeños. Creemos en un ambiente donde cada niño es valorado y respetado, desarrollando sus habilidades a través del juego, la creatividad y la exploración.
                        </p>
                    </div>
                </main>
            </div>
           {/* <Footer />*/}
        </div>
    );
};

export default MainLayout;
