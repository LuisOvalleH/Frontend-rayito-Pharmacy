# Análisis de Arquitectura — Frontend Rayito Pharmacy

Fecha: 2026-04-15 (revisado tras últimos cambios)

---

## Stack actual

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | React (JSX) | 19.2.0 |
| Build | Vite (rolldown) | 7.2.5 |
| Routing | React Router DOM | 7.13.0 |
| HTTP | Axios con interceptores JWT | 1.13.4 |
| Estado global | Context API + localStorage | nativo |
| PDF | jsPDF + jspdf-autotable | 4.2.1 / 5.0.7 |
| Estilos | CSS plano por componente | — |
| Tipos | Sin TypeScript | — |
| Tests | Sin configurar | — |

---

## Estructura de carpetas

```
src/
├── api/           # Capa HTTP (un archivo por entidad)
├── components/    # Componentes reutilizables
├── context/       # Estado global (CartContext)
├── layouts/       # Wrappers de layout (SiteLayout)
├── pages/
│   ├── *.jsx      # Páginas públicas
│   └── dashboard/ # Páginas del panel admin
├── App.jsx        # Router raíz
└── main.jsx       # Entry point
```

---

## Lo que está bien

### Capa API limpia y separada
Cada entidad tiene su propio módulo en `src/api/`:
`auth.js`, `products.js`, `categories.js`, `servicios.js`, `users.js`, `admin.js`, `contacto.js`, `historial.js`.
Las páginas nunca hacen `fetch` directamente — siempre pasan por esta capa. Cambiar el backend no implica tocar componentes.

### Interceptores de Axios con refresh automático
`src/api/axios.js` implementa una cola de peticiones para evitar múltiples refreshes simultáneos ante un 401. Es una solución correcta para escenarios de peticiones paralelas con token expirado.

### Layouts diferenciados y organizados
`SiteLayout` (público: Navbar + Footer + Outlet) y `AdminLayout` (admin: nav condicional por rol + Outlet) están claramente separados. La navegación del admin se adapta según sea `admin` o `superadmin`.

### PrivateRoute con doble nivel de guardia
El guard de rutas funciona correctamente en dos niveles:
- **Nivel 1**: `allowedRoles={["admin", "superadmin"]}` — protege todas las rutas del dashboard.
- **Nivel 2**: `allowedRoles={["superadmin"]}` — protege rutas exclusivas como `/admin/usuarios`.

No hay flash de redirección gracias al estado `"checking"` que retorna `null` mientras valida.

### Sistema de diseño en CSS variables
`src/index.css` define tokens globales en `:root`:
`--brand`, `--bg`, `--text`, `--muted`, `--card`, `--border`, `--shadow`, `--r`.
Esto es un paso correcto hacia un sistema de diseño consistente.

### CartContext bien encapsulado
API clara con `addItem`, `removeItem`, `inc`, `dec`, `setQty`, `normalizeQty`, `clear`, `open`, `close`.
Persistencia en localStorage bajo la clave versionada `cotizacion_cart_v1`.
El hook `useCart()` lanza error si se usa fuera del provider — buena práctica.

### Historial con exportación PDF y configuración de retención
Característica reciente y bien implementada:
- Filtrado por módulo (productos / categorías / usuarios / todos)
- Exportación a PDF via jsPDF + autoTable
- Configuración de limpieza (nunca / 2 meses / 6 meses / 1 año)
- Confirmación antes de borrar historial

### PatrÓN CRUD consistente en páginas de admin
Todas las páginas del dashboard siguen la misma estructura:
fetch → estado de formulario → submit con try-catch → recargar datos → reset.
Esto hace que el código sea predecible y fácil de mantener.

### Integración de WhatsApp para cotizaciones
`CartDrawer` genera un mensaje codificado con los productos y el total, y lo enlaza a `wa.me`. Es una solución práctica y sin dependencias adicionales.

---

## Problemas y mejoras recomendadas

### 1. Tokens en localStorage — Riesgo de seguridad
**Problema:** `access`, `refresh`, `is_admin` y `role` se guardan en localStorage. Cualquier script XSS puede leerlos.

**Estado actual:** Las claves se acceden directamente en varios lugares fuera de `auth.js` (por ejemplo, en `axios.js` y posiblemente en componentes).

**Mejora prioritaria:** Centralizar todo acceso a tokens exclusivamente en `src/api/auth.js`. Nunca llamar `localStorage.getItem("access")` fuera de ese archivo. Esto es un refactor bajo riesgo que se puede hacer hoy.

**Mejora estructural (coordinar con backend):** Mover los tokens a cookies `HttpOnly; Secure; SameSite=Strict`. Esto elimina el riesgo de XSS de raíz.

---

### 2. El flag `is_admin` en localStorage es manipulable
**Problema:** `PrivateRoute` usa `localStorage.getItem("is_admin")` para decidir si el usuario es administrador. Cualquier usuario puede escribir `localStorage.setItem("is_admin", "1")` en la consola del navegador y pasar la guardia del cliente.

**Aclaración importante:** La seguridad real debe estar en el backend — cada endpoint del API debe validar el token y los permisos. La validación del cliente es solo UX.

**Mejora:** Agregar un comentario explícito en `PrivateRoute.jsx` que diga que esta guardia es de UX, no de seguridad. Así queda claro para cualquier desarrollador que trabaje en el proyecto en el futuro.

---

### 3. Sin tests — Refactors son apuestas
**Problema:** No hay ningún test configurado. La lógica del carrito, el interceptor de Axios, el PrivateRoute y los módulos de API no tienen cobertura.

**Mejora mínima (alta prioridad):** Instalar Vitest (nativo para Vite) y cubrir al menos:
- `CartContext`: add, remove, persistencia, clear, bounds de qty
- `src/api/auth.js`: `isTokenValid()`, `getRole()`, `isAuthed()`
- `PrivateRoute`: redirige sin token, permite con rol correcto

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Agregar en `package.json`:
```json
"test": "vitest"
```

No se necesita 100% de cobertura. Con cubrir la lógica de autenticación y el carrito es suficiente para empezar.

---

### 4. Estado de servidor con `useState + useEffect`
**Problema:** Todos los fetches usan el patrón:
```js
const [data, setData] = useState([]);
useEffect(() => { fetchData().then(setData); }, []);
```
No hay caché, no hay deduplicación, no hay revalidación automática. Si dos componentes necesitan los mismos productos, se hacen dos peticiones independientes.

**Mejora de mayor impacto:** Adoptar **TanStack Query (React Query)**. Aporta:
- Caché automático entre componentes
- Deduplicación de peticiones
- Revalidación en foco de ventana
- Estados `isLoading`, `isError`, `isFetching` sin boilerplate
- Invalidación de caché tras mutaciones (CRUD)

```bash
npm install @tanstack/react-query
```

No requiere reescribir todo de una vez — se puede migrar módulo por módulo.

---

### 5. Sin TypeScript
**Problema:** Las respuestas del API no tienen shape definido. Un cambio en el backend (renombrar un campo) rompe silenciosamente el frontend. Los props de los componentes no están tipados.

**Situación:** `@types/react` y `@types/react-dom` ya están instalados — la intención de usar TypeScript estaba presente desde el inicio.

**Mejora progresiva:**
1. Agregar `tsconfig.json` con `"allowJs": true` para no romper nada existente
2. Migrar `src/api/*.js` a `.ts` primero — son los contratos con el backend
3. Migrar componentes reutilizados (`ProductCard`, `CartDrawer`, `PrivateRoute`)
4. Las páginas del dashboard pueden quedar para el final

---

### 6. `vite.config.js` sin alias de rutas
**Problema:** Los imports usan rutas relativas como `../../components/ProductCard`. Son frágiles ante reorganizaciones de carpetas.

**Mejora trivial:**
```js
// vite.config.js
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@components': path.resolve(__dirname, 'src/components'),
    }
  }
})
```

---

### 7. Notificaciones de error inconsistentes
**Problema:** Algunos componentes muestran errores con `useState` local, otros con `alert()`. No hay un sistema centralizado.

**Mejora:** Instalar `sonner` o `react-hot-toast` (menos de 5 KB). Setup de 10 minutos. Elimina los `alert()` y unifica el feedback visual de toda la app.

---

### 8. `.env` con URL de desarrollo hardcodeada
**Problema:** `.env` apunta a `http://127.0.0.1:8000/api`. No hay `.env.production` definido.

**Mejora:** Crear `.env.production` con la URL del backend de producción. Vite los diferencia automáticamente según el modo de build.

```
# .env.production
VITE_API_URL=https://tu-backend-produccion.com/api
```

---

## Resumen de prioridades

| Prioridad | Mejora | Esfuerzo estimado |
|---|---|---|
| Alta | Centralizar acceso a tokens en `auth.js` | Bajo |
| Alta | Tests básicos con Vitest | Bajo-Medio |
| Alta | `.env.production` con URL real | Muy bajo |
| Media | TanStack Query para estado de servidor | Medio |
| Media | Tokens en cookies HttpOnly (requiere backend) | Medio |
| Media | Comentario en PrivateRoute aclarando scope de seguridad | Muy bajo |
| Baja | TypeScript progresivo | Alto |
| Baja | Alias de rutas en Vite | Muy bajo |
| Baja | Sistema de toast centralizado | Bajo |

---

## Veredicto general

La arquitectura es **sólida para el tamaño y propósito del proyecto**. La separación en capas (API, componentes, páginas, contexto) es correcta. Las adiciones recientes (historial con PDF, configuración de retención, navegación por rol) demuestran que el sistema es extensible sin necesidad de reescritura.

No hay sobre-ingeniería. El código es directo, predecible y consistente.

Los tres refuerzos más importantes son:
1. **Centralizar el acceso a tokens** en `auth.js` — refactor de una tarde, reduce la superficie de riesgo.
2. **Agregar Vitest** — permite refactorizar con confianza a partir de ahora.
3. **Definir `.env.production`** — es necesario antes de cualquier deploy a producción.

El resto son mejoras incrementales que se pueden ir adoptando conforme el proyecto crece.
