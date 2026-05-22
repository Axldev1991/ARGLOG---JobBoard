#!/bin/bash

# Usar el Node del sistema actual

# 1. Iniciar el contenedor de Postgres
echo "🚀 Iniciando Postgres local con Docker..."
docker compose up -d

# 2. Esperar a que esté listo (Postgres tarda un toque en aceptar conexiones)
echo "⏳ Esperando a que la base de datos esté lista..."
sleep 5

# 3. Sincronizar el esquema de Prisma
echo "🔄 Sincronizando esquema de Prisma..."
npx prisma db push

# 4. Sembrar datos iniciales
echo "🌱 Sembrando datos iniciales..."
npx prisma db seed

echo "✅ ¡Base de datos local lista y sincronizada en el puerto 5433!"
echo "DATABASE_URL=postgresql://jobboard_user:jobboard_password@localhost:5433/jobboard_local"
