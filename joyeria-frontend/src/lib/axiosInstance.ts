// joyeria-frontend/src/lib/axiosInstance.ts

import axios from 'axios';

// Configuración de la instancia base de Axios
// Aquí se define la URL base de tu backend de NestJS.
const axiosInstance = axios.create({
    // La URL y puerto por defecto para la mayoría de las aplicaciones NestJS
    baseURL: 'http://localhost:3000', 
    headers: {
        'Content-Type': 'application/json', // Le dice al backend que enviamos JSON
    },
    // Nota: Aquí se pueden agregar interceptores si necesitamos tokens de autenticación
});

export default axiosInstance;