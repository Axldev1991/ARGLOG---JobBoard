import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {

    // Generamos un email único para cada ejecución del test de registro
    const uniqueEmail = `test.candidate.${Date.now()}@example.com`;

    test('should register a new candidate successfully', async ({ page }) => {
        await page.goto('/register');

        // Seleccionar Rol (Candidato)
        await page.getByRole('link', { name: 'Soy Talento Comenzar Registro' }).click();
        
        // Verificar que estamos en la sub-ruta
        await expect(page).toHaveURL(/\/register\/candidate/);

        // Llenar formulario
        await page.getByRole('textbox', { name: 'Ej: Juan Pérez' }).fill('Test Automation User');
        await page.getByRole('textbox', { name: 'nombre@ejemplo.com' }).fill(uniqueEmail);
        await page.getByRole('textbox', { name: '••••••••' }).fill('password123!');

        // Submit
        await page.getByRole('button', { name: 'Registrarme Ahora' }).click();

        // Verificación: El sistema redirige al login después de registrarse
        await expect(page).toHaveURL(/.*login/);
    });

    test('should login with existing credentials', async ({ page }) => {
        // Usamos las credenciales conocidas
        const knownEmail = 'candidato999@test.com';
        const knownPass = 'password123!'; 

        await page.goto('/login');

        await page.getByRole('textbox', { name: 'ejemplo@correo.com' }).fill(knownEmail);
        await page.getByRole('textbox', { name: '••••••••' }).fill(knownPass);

        await page.getByRole('button', { name: 'Ingresar' }).click();

        // Assert Dashboard
        await expect(page).toHaveURL(/\/dashboard/);
    });

    test('should validate form inputs', async ({ page }) => {
        await page.goto('/register/candidate');

        // 1. Submit vacío
        await page.getByRole('button', { name: 'Registrarme Ahora' }).click();

        // Validar que NO navegamos (seguimos en /candidate)
        await expect(page).toHaveURL(/\/register\/candidate/);

        // 2. Email inválido
        await page.getByRole('textbox', { name: 'nombre@ejemplo.com' }).fill('correo-invalido');
        await page.getByRole('button', { name: 'Registrarme Ahora' }).click();

        // Validar HTML5 validation
        const emailInput = page.getByRole('textbox', { name: 'nombre@ejemplo.com' });
        await expect(emailInput).toHaveJSProperty('validity.valid', false);

        await expect(page).toHaveURL(/\/register\/candidate/);
    });

});
