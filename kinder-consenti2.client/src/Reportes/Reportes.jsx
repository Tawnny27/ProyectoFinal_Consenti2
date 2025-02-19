import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import './Reportes.css';
import Navbar from '../componentes/navbar';
import Footer from '../componentes/footer';
import * as XLSX from 'xlsx'; // Importar la biblioteca xlsx
import { ObtenerFacturas } from '../apiClient';

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

const Reportes = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Función para obtener las facturas
        const fetchData = async () => {
            try {
                const facturas = await ObtenerFacturas(); // Usamos la función de apiClient
                setData(facturas.data); // Suponiendo que la respuesta contiene un campo `data` con las facturas
            } catch (error) {
                console.error('Error al obtener las facturas:', error);
            }
        };

        fetchData();
    }, []);

    // Agrupar los totales por mes
    const agrupadosPorMes = data.reduce((acc, item) => {
        const mes = new Date(item.fecha).toLocaleString("es-ES", { month: "short" });
        acc[mes] = (acc[mes] || 0) + item.total; // Sumar el total al mes correspondiente
        return acc;
    }, {});

    // Extraer los datos para las gr?ficas
    const fechas = Object.keys(agrupadosPorMes);
    const totales = Object.values(agrupadosPorMes);


    const exportToExcel = () => {
        // Crear una estructura de datos en formato JSON para exportar
        const datosParaExportar = fechas.map((mes, index) => ({
            Mes: mes.charAt(0).toUpperCase() + mes.slice(1), // Capitalizar el mes
            Total: totales[index], // Total correspondiente al mes
        }));

        // Crear una hoja de c?lculo (worksheet)
        const ws = XLSX.utils.json_to_sheet(datosParaExportar);

        // Crear un libro de trabajo (workbook)
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Totales por Mes");

        // Exportar el archivo Excel
        XLSX.writeFile(wb, "totales_mensuales.xlsx");
    };


    const lineChartData = {
        labels: fechas,
        datasets: [
            {
                label: "Ingresos Mensuales",
                data: totales,
                borderColor: "#4bc0c0",
                backgroundColor: "rgba(75,192,192,0.4)",
                fill: true,
            },
        ],
    };

    // Datos para la gr?fica de barras
    const barChartData = {
        labels: fechas,
        datasets: [
            {
                label: "Totales Facturados",
                data: totales,
                backgroundColor: "rgba(153,102,255,0.6)",
                borderColor: "rgba(153,102,255,1)",
                borderWidth: 1,
            },
        ],
    };

    // Datos para la gr?fica de pastel (ejemplo con datos est?ticos)
    const pieChartData = {
        labels: ["2020", "2021", "2022", "2023"],
        datasets: [
            {
                label: "Crecimiento del Centro",
                data: [300, 500, 400, 600], // Simplemente Valores de ejemplo, cuando ya se tengan los datos requeridos se traen y se pintan
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
            },
        ],
    };

    return (
        <div className="reportes-container">
            <Navbar />
            <h2>Reportes</h2>
            <div className="charts-grid">
                {/* Gr?fica de L?neas */}
                <div className="chart-container">
                    <h3>Ingresos Mensuales</h3>
                    <Line data={lineChartData} />
                </div>
                {/* Gr?fica de Barras */}
                <div className="chart-container">
                    <h3>Gastos Anuales</h3>
                    <Bar data={barChartData} />
                </div>
                {/* Gr?fica de Pastel */}
                <div className="chart-container">
                    <h3>Crecimiento del Centro</h3>
                    <Pie data={pieChartData} />
                </div>
            </div>

            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <button
                    onClick={exportToExcel}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#4caf50",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Exportar a Excel
                </button>
            </div>
            <Footer/>
        </div>
    );
};

export default Reportes;