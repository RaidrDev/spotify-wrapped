# 🎵 Spotify Wrapped App

Una aplicación web moderna que te permite ver tu Spotify Wrapped personalizado con estadísticas detalladas de tu actividad musical.

## ✨ Características

- 🔐 **Autenticación con Spotify** - Login seguro usando OAuth 2.0
- 📊 **Dashboard Interactivo** - Interfaz moderna con navegación intuitiva
- 🎵 **Top Canciones** - Tus canciones más escuchadas con diferentes rangos de tiempo
- 🎤 **Top Artistas** - Tus artistas favoritos con información de popularidad
- 🕒 **Reproducido Recientemente** - Tu actividad musical más reciente
- 📈 **Estadísticas Detalladas** - Análisis completo de tu música
- 🎼 **Géneros Favoritos** - Visualización de tus géneros musicales preferidos
- 📱 **Diseño Responsivo** - Funciona perfectamente en móviles y tablets
- 🎨 **Tailwind CSS** - Diseño moderno con utilidades CSS
- ☁️ **Deploy en Vercel** - Despliegue automático y hosting gratuito

## 🚀 Instalación

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm o yarn
- Cuenta de Spotify

### Pasos de Instalación

1. **Clona el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd spotify-wrapped-app
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura Spotify Developer App**

   Para usar esta aplicación, necesitas crear una aplicación en el [Spotify Developer Dashboard](https://developer.spotify.com/dashboard):

   - Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Inicia sesión con tu cuenta de Spotify
   - Haz clic en "Create App"
   - Completa la información requerida:
     - **App name**: Spotify Wrapped App
     - **App description**: Aplicación para ver estadísticas de Spotify
     - **Website**: `http://localhost:3000`
     - **Redirect URIs**: 
       - `http://127.0.0.1:3000` (para desarrollo)
       - `https://spotify-wrapped-app.vercel.app` (para producción)
   - Acepta los términos y condiciones
   - Haz clic en "Save"

4. **Configura el Client ID**

   Una vez creada la aplicación, copia el **Client ID** y actualízalo en el archivo:

   ```typescript
   // src/components/SpotifyAuth.tsx
   const CLIENT_ID = 'TU_CLIENT_ID_AQUI'; // Reemplaza con tu Client ID
   ```

5. **Inicia la aplicación en desarrollo**
   ```bash
   npm run dev
   ```

6. **Abre la aplicación**
   
   Ve a [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🚀 Despliegue en Producción

### Despliegue en Vercel

1. **Instala Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Inicia sesión en Vercel**
   ```bash
   vercel login
   ```

3. **Despliega la aplicación**
   ```bash
   vercel --prod
   ```

4. **Configura el dominio personalizado (opcional)**
   ```bash
   vercel domains add spotify-wrapped-app.vercel.app
   ```

### Configuración de Producción

Después del despliegue, actualiza las URIs de redirección en el Spotify Developer Dashboard:

- Agrega tu URL de producción: `https://tu-app.vercel.app`
- O usa el dominio personalizado: `https://spotify-wrapped-app.vercel.app`

## 🎯 Cómo Usar

1. **Conectar con Spotify**
   - Haz clic en "Conectar con Spotify"
   - Autoriza la aplicación en Spotify
   - Serás redirigido de vuelta a la aplicación

2. **Explorar tu Wrapped**
   - **Resumen**: Vista general de todas las secciones
   - **Top Canciones**: Tus canciones más escuchadas (4 semanas, 6 meses, todo el tiempo)
   - **Top Artistas**: Tus artistas favoritos con estadísticas de popularidad
   - **Reproducido Recientemente**: Tu actividad musical más reciente
   - **Estadísticas**: Análisis detallado de tu música

3. **Navegar entre secciones**
   - Usa los botones de navegación en la parte superior
   - Cada sección muestra información diferente de tu actividad musical

## 🛠️ Tecnologías Utilizadas

- **React 19** - Framework de interfaz de usuario
- **TypeScript** - Tipado estático para mejor desarrollo
- **Tailwind CSS** - Framework de utilidades CSS
- **Spotify Web API** - API oficial de Spotify
- **Vercel** - Plataforma de despliegue y hosting
- **Node.js** - Runtime de JavaScript para el servidor de desarrollo

## 📱 Características Técnicas

### Autenticación
- OAuth 2.0 con Spotify
- Manejo seguro de tokens de acceso
- Redirección automática después del login
- API Routes de Vercel para producción

### API de Spotify
- Top Tracks (corto, medio y largo plazo)
- Top Artists con información de popularidad
- Recently Played Tracks
- User Profile

### Diseño
- Diseño responsivo para todos los dispositivos
- Tema oscuro inspirado en Spotify
- Animaciones suaves y transiciones
- Interfaz moderna con glassmorphism
- Tailwind CSS para estilos utilitarios

### Arquitectura
- **Desarrollo**: Servidor local con Express.js
- **Producción**: API Routes de Vercel
- **Frontend**: React con TypeScript
- **Estilos**: Tailwind CSS

## 🔧 Configuración Avanzada

### Variables de Entorno (Opcional)

Puedes crear un archivo `.env` en la raíz del proyecto:

```env
REACT_APP_SPOTIFY_CLIENT_ID=tu_client_id_aqui
REACT_APP_REDIRECT_URI=http://127.0.0.1:3000
```

### Scripts Disponibles

```bash
npm run dev          # Inicia desarrollo (servidor + React)
npm run server       # Solo servidor de desarrollo
npm start           # Solo React en desarrollo
npm run build       # Build de producción
npm run test        # Ejecuta tests
```

### Estructura del Proyecto

```
spotify-wrapped-app/
├── src/
│   ├── components/     # Componentes React
│   ├── App.tsx        # Componente principal
│   └── index.tsx      # Punto de entrada
├── api/               # API Routes de Vercel
├── server.js          # Servidor de desarrollo
├── vercel.json        # Configuración de Vercel
└── tailwind.config.js # Configuración de Tailwind
```

## 🚨 Solución de Problemas

### Error de Autenticación
- Verifica que el Client ID sea correcto
- Asegúrate de que las Redirect URIs coincidan exactamente
- Comprueba que la aplicación esté configurada correctamente en Spotify Developer Dashboard

### No se muestran datos
- Asegúrate de tener suficiente actividad en Spotify
- Verifica que hayas autorizado todos los permisos necesarios
- Comprueba la conexión a internet

### Problemas de CORS en Desarrollo
- El servidor de desarrollo maneja las peticiones a la API de Spotify
- Asegúrate de que el servidor esté corriendo en el puerto 3001

### Problemas de Deploy
- Verifica que Vercel CLI esté instalado y configurado
- Comprueba que las variables de entorno estén configuradas
- Revisa los logs de build en Vercel

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación de [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
2. Verifica que tu aplicación esté configurada correctamente en Spotify Developer Dashboard
3. Comprueba que tienes las versiones correctas de Node.js y npm
4. Revisa la [documentación de Vercel](https://vercel.com/docs) para problemas de deploy

## 🎉 Agradecimientos

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) por proporcionar la API
- [Vercel](https://vercel.com/) por la plataforma de hosting
- [Tailwind CSS](https://tailwindcss.com/) por el framework de utilidades CSS
- Comunidad de React por el excelente framework

---

¡Disfruta explorando tu música con Spotify Wrapped! 🎵
