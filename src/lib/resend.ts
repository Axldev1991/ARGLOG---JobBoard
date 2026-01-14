import { Resend } from 'resend';

// Inicializamos el cliente con la key del entorno
export const resend = new Resend(process.env.RESEND_API_KEY);