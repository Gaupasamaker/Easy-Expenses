# Guía de Configuración de Firebase para EasyExpenses AI

Como la configuración requiere acceso a tu cuenta de Google, debes realizarla manualmente. Es un proceso sencillo de 5 minutos. Sigue estos pasos:

## 1. Crear el Proyecto
1. Ve a la [Consola de Firebase](https://console.firebase.google.com/).
2. Haz clic en **"Agregar proyecto"**.
3. Ponle nombre (ej: `easyexpenses-ai`).
4. Desactiva Google Analytics (no es necesario para empezar) y crea el proyecto.

## 2. Registrar la Web App
1. En la pantalla principal del proyecto, haz clic en el icono de **Web** (`</>`).
2. Ponle un apodo (ej: `EasyExpenses Web`).
3. **No** marques "Firebase Hosting" todavía.
4. Haz clic en **Registrar app**.
5. Verás un código con `firebaseConfig`. **Copia el contenido de ese objeto** (apiKey, authDomain, etc.). Lo necesitarás para el archivo `.env`.

## 3. Habilitar Autenticación (Google Login)
1. En el menú izquierdo, ve a **Compilación** -> **Authentication**.
2. Haz clic en **Comenzar**.
3. En "Proveedores de acceso", selecciona **Google**.
4. Dale a **Habilitar**.
5. Configura el nombre público de la app y selecciona tu correo de soporte.
6. **Guardar**.

## 4. Crear Base de Datos (Firestore)
1. En el menú izquierdo, ve a **Compilación** -> **Firestore Database**.
2. Haz clic en **Crear base de datos**.
3. Selecciona la ubicación (ej: `eur3` para Europa o `nam5` para USA).
4. Elige **Comenzar en modo de prueba** (esto permite escribir datos libremente durante 30 días, ideal para desarrollo).
5. Haz clic en **Habilitar**.

## 5. Habilitar Almacenamiento (Storage)
1. En el menú izquierdo, ve a **Compilación** -> **Storage**.
2. Haz clic en **Comenzar**.
3. **Comenzar en modo de prueba**.
4. Haz clic en **Listo**.
5. Ve a la pestaña **Rules** (Reglas) y asegúrate de que permiten lectura/escritura (si elegiste modo prueba, debería estar bien).

## 6. Configurar Claves en el Proyecto
Crea un archivo llamado `.env` en la raíz de la carpeta `EasyExpenses AI` y rellénalo con los datos que copiaste en el paso 2:

```env
VITE_GEMINI_API_KEY=tu_clave_api_de_gemini
VITE_FIREBASE_API_KEY=tua_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

## Extra: API Key de Gemini
1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Haz clic en **Create API Key**.
3. Copiala y pégala en `VITE_GEMINI_API_KEY` en el archivo `.env`.

¡Listo! Con esto tu aplicación funcionará perfectamente.
