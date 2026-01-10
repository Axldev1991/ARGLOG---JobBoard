# Conceptos Clave: Archivos

## ¿TS vs TSX?
Es una distinción vital en el mundo React/Next.js:

### `.ts` (TypeScript Puro)
- **Qué es**: Código de programación normal. Lógica, matemáticas, funciones auxiliares.
- **Qué NO puede tener**: Etiquetas HTML (`<div>`, `<h1>`). Si intentas poner una, te dará error.
- **Ejemplo**: `utils.ts` (solo tiene una función matemática para mezclar clases).

### `.tsx` (TypeScript + JSX)
- **Qué es**: Archivos visuales. La "X" viene de eXtended (o de XML).
- **Poder Especial**: Entiende HTML mezclado con Javascript.
- **Ejemplo**: `button.tsx`, `navbar.tsx`, `page.tsx` (todos devuelven cosas visibles).

**Regla de Oro**: 
¿Se ve en la pantalla? -> `.tsx`
¿Es solo lógica invisible? -> `.ts`
