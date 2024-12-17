import { useEffect, useState } from "react";
import Navbar from "../componentes/navbar";
import Footer from "../componentes/footer";
import "./activityList.css";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ListaActividades = () => {

    const [listaAct, setListaAct] = useState([]);
    const [mensaje, setMensaje] = useState("");



    useEffect(() => {
        const cargarLista = async () => {
            try {
                const response = await axios.get("https://localhost:44369/Grupos/ObtenerGrupos");
                setListaAct(response.data);
                console.log("Aulas cargadas:", response.data);
            } catch (error) {
                console.error("Error al cargar las actividades:", error);
                setMensaje("No se pudieron cargar las actividades");
            }
        }
        cargarLista();
    }, []);

    return (
        <div>
            <Navbar />            
            <div className="act-container">
                <h1 className="act-header"> Lista de Actividades</h1>
                <div className="cards-container">
                    {listaAct.map((act) => (
                        <div key={act.idGrupos} className="act-card">
                            <h4>{act.nombreGrupo}</h4>

                            <p>{act.anno}</p>
                            <img className="card-imagen" src="https://purina.com.pe/sites/default/files/styles/webp/public/2022-10/Que_debes_saber_antes_de_adoptar_un_gatito.jpg.webp?itok=N2sS0lfp" alt=""></img>

                           
                        </div>
                    ))
                    }
                </div>
            </div>
            <Footer />
        </div>

    );
};
export default ListaActividades;