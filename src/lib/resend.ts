import { Resend } from 'resend';
import { env } from './env';

// Inicializamos el cliente con la key validada
export const resend = new Resend(env.RESEND_API_KEY);
