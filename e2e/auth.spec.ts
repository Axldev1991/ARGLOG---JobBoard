import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {

    // Generamos un email único para cada ejecución del test de registro
    const uniqueEmail = `test.candidate.${Date.now()}@example.com`;

    test('should register a new candidate successfully', async ({ page }) => {
        await page.goto('/');

        // Navegar a Registro
        await page.getByRole('button', { name: 'Registrarse' }).click();

        // Seleccionar Rol (Asumiendo que hay pestañas o botones, ajustado del recording)
        // El recording no mostró selección de rol explicita en los clicks, 
        // pero si es el default o parte del flujo, lo mantenemos.
        // Si hay que elegir "Soy Candidato", agregaremos el selector si aparece.

        // Llenar formulario
        await page.getByRole('textbox', { name: 'Ej: Juan Pérez' }).fill('Test Automation User');
        await page.getByRole('textbox', { name: 'nombre@ejemplo.com' }).fill(uniqueEmail);
        await page.getByRole('textbox', { name: '••••••••' }).fill('password123!');

        // Submit
        await page.getByRole('button', { name: 'Registrarme' }).click();

        // Verificación: El sistema redirige al login después de registrarse
        await expect(page).toHaveURL(/.*login/);

        // Opcional: Verificar que podemos loguearnos con la cuenta recién creada
        // Esto haría el test más robusto
    });

    test('should login with existing credentials', async ({ page }) => {
        // Usamos las credenciales conocidas
        const knownEmail = 'candidato999@test.com';
        const knownPass = 'password123!'; // Corregido: minúscula según grabación

        await page.goto('/');
        // Scope to navigation bar to be safe
        await page.getByRole('navigation').getByRole('button', { name: 'Ingresar' }).click();

        await page.getByRole('textbox', { name: 'ejemplo@correo.com' }).fill(knownEmail);
        await page.getByRole('textbox', { name: '••••••••' }).fill(knownPass);

        await page.getByRole('main').getByRole('button', { name: 'Ingresar' }).click();

        // Assert Dashboard
        await expect(page).toHaveURL(/\/dashboard/);
    });

    test('should validate form inputs', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Registrarse' }).click();

        // 1. Submit vacío
        await page.getByRole('button', { name: 'Registrarme' }).click();

        // Validar que NO navegamos (seguimos en /register)
        await expect(page).toHaveURL(/\/register/);

        // 2. Email inválido
        await page.getByRole('textbox', { name: 'nombre@ejemplo.com' }).fill('correo-invalido');
        await page.getByRole('button', { name: 'Registrarme' }).click();

        // Validar HTML5 validation (el navegador impide el submit)
        const emailInput = page.getByRole('textbox', { name: 'nombre@ejemplo.com' });

        // Verificar que el input es inválido (pseudo-clase CSS :invalid)
        await expect(emailInput).toHaveJSProperty('validity.valid', false);

        // Asegurar que seguimos en la misma página
        await expect(page).toHaveURL(/\/register/);
    });

});
