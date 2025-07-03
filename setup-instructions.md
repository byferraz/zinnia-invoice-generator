# Instrucciones de Configuración para GitHub Pages

## 📁 Estructura del Proyecto

```
zinnia-invoice-generator/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   └── ZinniaInvoiceGenerator.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── .gitignore
├── package.json
├── README.md
└── SETUP.md
```

## 🚀 Pasos para Configurar y Desplegar

### 1. Preparar el Proyecto

1. **Crea una nueva carpeta para tu proyecto:**
   ```bash
   mkdir zinnia-invoice-generator
   cd zinnia-invoice-generator
   ```

2. **Inicializa un nuevo proyecto React:**
   ```bash
   npx create-react-app .
   ```

3. **Reemplaza los archivos generados con los que te proporcioné:**
   - Copia el contenido de `package.json`
   - Crea la carpeta `src/components/`
   - Copia tu componente `ZinniaInvoiceGenerator.js` en `src/components/`
   - Reemplaza `src/App.js` y `src/App.css`
   - Reemplaza `public/index.html`

### 2. Configurar package.json

**IMPORTANTE:** En el archivo `package.json`, reemplaza `TU_USUARIO_GITHUB` con tu nombre de usuario real de GitHub:

```json
"homepage": "https://TU_USUARIO_GITHUB.github.io/zinnia-invoice-generator",
```

### 3. Instalar Dependencias

```bash
npm install
npm install --save-dev gh-pages
```

### 4. Probar Localmente

```bash
npm start
```

Verifica que todo funcione correctamente en `http://localhost:3000`

### 5. Crear Repositorio en GitHub

1. Ve a [GitHub](https://github.com) y crea un nuevo repositorio llamado `zinnia-invoice-generator`
2. **NO** inicialices el repositorio con README, .gitignore o licencia

### 6. Conectar tu Proyecto Local con GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO_GITHUB/zinnia-invoice-generator.git
git push -u origin main
```

### 7. Desplegar en GitHub Pages

```bash
npm run deploy
```

Este comando:
- Construirá tu aplicación optimizada para producción
- Creará una rama `gh-pages` automáticamente
- Subirá los archivos compilados a esa rama

### 8. Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** → **Pages**
3. En **Source**, selecciona `Deploy from a branch`
4. En **Branch**, selecciona `gh-pages` y `/ (root)`
5. Click en **Save**

### 9. Acceder a tu Aplicación

Tu aplicación estará disponible en:
```
https://TU_USUARIO_GITHUB.github.io/zinnia-invoice-generator
```

⏰ **Nota:** La primera vez puede tardar hasta 10 minutos en estar disponible.

## 🔄 Actualizaciones Futuras

Para actualizar tu aplicación después de hacer cambios:

```bash
git add .
git commit -m "Descripción de los cambios"
git push origin main
npm run deploy
```

## 🐛 Solución de Problemas

### La página muestra 404
- Verifica que hayas configurado correctamente el `homepage` en `package.json`
- Asegúrate de que la rama `gh-pages` existe
- Espera unos minutos más, GitHub Pages puede tardar en actualizar

### Los estilos no se ven correctamente
- Verifica que Tailwind CSS se esté cargando desde el CDN
- Revisa la consola del navegador para errores

### Error al hacer deploy
- Asegúrate de tener permisos de escritura en el repositorio
- Verifica que `gh-pages` esté instalado: `npm install --save-dev gh-pages`

## 📝 Archivos Adicionales Recomendados

### .gitignore
```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

### README.md
```markdown
# Zinnia Invoice Generator

Sistema de generación automática de facturas para Zinnia Group LLC.

## Características

- Gestión de clientes
- Generación de facturas en HTML
- Descarga y impresión directa
- Cálculo automático de impuestos
- Interfaz intuitiva

## Demo

[Ver aplicación en vivo](https://TU_USUARIO_GITHUB.github.io/zinnia-invoice-generator)

## Tecnologías

- React
- Tailwind CSS
- Lucide Icons
```