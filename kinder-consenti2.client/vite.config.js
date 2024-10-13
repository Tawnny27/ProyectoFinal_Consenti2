import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';

const baseFolder =
    env.APPDATA !== undefined && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

const certificateName = "kinder-consenti2.client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (0 !== child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'Pem',
        '--no-password',
    ], { stdio: 'inherit', }).status) {
        throw new Error("Could not create certificate.");
    }
}

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7033';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '^/weatherforecast': {
                target,
                secure: false
            },           
            //--------------Crud Usuarios------------------
            '^/usuarios/ObtenerUsuarios': {
                target: 'https://localhost:44369/',
                secure: false
            },
            '^/usuarios/BuscarUsuarios': {
                target: 'https://localhost:44369/',
                secure: false
            },
            '^/usuarios/CrearUsuario': {
                target: 'https://localhost:44369/',
                secure: false
            },
            '^/usuarios/EditarUsuario': {
                target: 'https://localhost:44369/',
                secure: false
            },
            '^/usuarios/EliminarUsuario': {
                target: 'https://localhost:44369/',
                secure: false
            },
            //--------------Crud Roles------------------
            '^/roles/ObtenerRoles': {
                target: 'https://localhost:44369/',
                secure: false
            },
            '^/roles/BuscarRol': {
                target: 'https://localhost:44369/',
                secure: false
            },
            '^/roles/CrearRol': {
                target: 'https://localhost:44369/',
                secure: false
            },
            '^/roles/EditarRol': {
                target: 'https://localhost:44369/',
                secure: false
            },
            '^/roles/EliminaRol': {
                target: 'https://localhost:44369/',
                secure: false
            },
            //--------------Crud Alumnos------------------
            '^/alumnos/ObtenerAlumnos': {
                target: 'https://localhost:44369/',
                secure: false
            },
            '^/alumnos/BuscarAlumno': {
                target: 'https://localhost:44369/',
                secure: false
            },
            '^/alumnos/CrearAlumno': {
                target: 'https://localhost:44369/',
                secure: false
            },
            '^/alumnos/EditarAlumno': {
                target: 'https://localhost:44369/',
                secure: false
            },
            '^/alumnos/EliminarAlumno': {
                target: 'https://localhost:44369/',
                secure: false
            },
        },
        port: 5173,
        https: {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        }
    }
})
