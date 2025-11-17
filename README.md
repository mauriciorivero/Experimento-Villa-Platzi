# 🎮 Proyecto Interactivo - Adobe Animate Multi-Escena

Sistema modular para gestionar múltiples composiciones de Adobe Animate como escenas interconectadas en una aplicación web única.

## 📁 Estructura del Proyecto

```
Experimento-Villa-Platzi/
│
├── index.html                          # HTML único principal
├── README.md                           # Este archivo
├── LICENSE                             # Licencia MIT del proyecto
│
├── js/
│   ├── main.js                         # Configuración y punto de entrada
│   ├── SceneManager.js                 # Gestor centralizado de escenas
│   └── animate-projects/               # Scripts generados por Adobe Animate
│       ├── GT-Menu.js
│       ├── Skyloft-menu.js
│       └── Valley-Menu.js
│
├── assets/
│   └── images/                         # Assets de las composiciones
│       ├── gt/
│       │   ├── _preloader.gif
│       │   └── granturismomenu.jpg
│       ├── skyloft/
│       │   ├── _preloader.gif
│       │   └── Skyloft.png
│       └── valley/
│           ├── _preloader.gif
│           └── Valley_Menu_atlas_1.png
│
└── css/
    └── (estilos adicionales si necesario)
```

## 🚀 Características

- ✅ **Un solo HTML** - Toda la aplicación en un archivo
- ✅ **Transiciones suaves** - Sin recargar la página, fade in/out de 0.5s
- ✅ **Carga perezosa inteligente** - Las escenas se cargan solo cuando se necesitan
- ✅ **Pre-carga automática en background** - Después de 2s, precarga todas las escenas
- ✅ **Centrado perfecto** - Las escenas se muestran centradas vertical y horizontalmente
- ✅ **Responsive adaptativo** - Se ajusta proporcionalmente a cualquier tamaño de pantalla
- ✅ **Controles siempre visibles** - Panel de navegación y overlay informativo permanentes
- ✅ **Preloader inteligente** - Solo se muestra durante la primera carga de cada escena
- ✅ **Sistema multi-escena robusto** - Gestor centralizado sin conflictos de variables globales
- ✅ **Escalable** - Agregar nuevas escenas es trivial
- ✅ **API simple** - Navegación fácil entre escenas
- ✅ **Panel de prueba integrado** - Botones estilizados para testing

## 🎯 Escenas Disponibles

### 1. GT Menu (Gran Turismo)
- **ID**: `gt-menu`
- **Descripción**: Menú inspirado en Gran Turismo
- **Assets**: granturismomenu.jpg

### 2. Skyloft Menu
- **ID**: `skyloft-menu`
- **Descripción**: Menú inspirado en Skyloft (Zelda: Skyward Sword)
- **Assets**: Skyloft.png

### 3. Valley Menu
- **ID**: `valley-menu`
- **Descripción**: Menú inspirado en Monument Valley
- **Assets**: Valley_Menu_atlas_1.png

## 🏗️ Arquitectura Técnica

### Sistema de Centrado y Responsive

El proyecto utiliza **Flexbox** para lograr un centrado perfecto de las escenas:

```
┌─────────────────────────────────────────────┐
│    #app-container (100vw x 100vh)           │
│    [position: fixed, display: flex]         │
│                                             │
│    ┌────────────────────────────────┐      │
│    │   .scene-container (active)    │      │
│    │   [display: flex, centered]    │      │
│    │                                │      │
│    │   ┌────────────────────┐       │      │
│    │   │ .animation-wrapper │       │      │
│    │   │  [auto size]       │       │      │
│    │   │                    │       │      │
│    │   │  ┌──────────┐      │       │      │
│    │   │  │  Canvas  │      │       │      │
│    │   │  │ (scaled) │      │       │      │
│    │   │  └──────────┘      │       │      │
│    │   └────────────────────┘       │      │
│    └────────────────────────────────┘      │
└─────────────────────────────────────────────┘
```

### Jerarquía de Z-Index

El sistema utiliza una jerarquía clara de capas:

- **Z-Index 0**: `#app-container` (base de escenas)
- **Z-Index 1**: `.scene-container` (escenas individuales)
- **Z-Index 10000**: `#test-controls`, `#info-overlay` (UI permanente)
- **Z-Index 100000**: `#global-preloader` (cubre todo durante cargas)

### Sistema de Preloader Inteligente

```javascript
// Solo se muestra cuando una escena NO está inicializada
if (!scene.isInitialized) {
    showGlobalPreloader(`Cargando ${scene.name}...`);
    await initScene(sceneId);
    hideGlobalPreloader();
}

// Si la escena YA está cargada, transición inmediata
// Sin preloader, sin parpadeos, controles siempre visibles
```

### Responsive Personalizado

El `SceneManager` implementa su propio sistema responsive que:

1. **No depende de variables globales** (evita conflictos entre múltiples escenas)
2. **Calcula el ratio de escala óptimo** para cada tamaño de ventana
3. **Mantiene la proporción** 16:9 del canvas
4. **Centra automáticamente** usando CSS Flexbox
5. **Soporta HiDPI** (pantallas Retina)

```javascript
// Cada escena tiene su propio resize handler
scene.resizeHandler = () => {
    // Calcula y aplica escala sin contaminar scope global
    const sRatio = Math.min(xRatio, yRatio);
    scene.stage.scaleX = pRatio * sRatio;
    scene.stage.scaleY = pRatio * sRatio;
};
```

## 📖 Cómo Usar

### Iniciar el Proyecto

1. Abre `index.html` en un servidor local (recomendado) o directamente en el navegador
2. La primera escena (GT Menu) se cargará automáticamente con un preloader
3. Después de 2 segundos, las otras escenas se precargan en background
4. Usa los botones del panel de control (siempre visibles) para navegar entre escenas
5. Las transiciones son instantáneas después de la precarga inicial

### Navegar Entre Escenas

**Desde los botones de prueba (HTML):**
```javascript
// Los botones ya están configurados en el HTML
```

**Desde código JavaScript:**
```javascript
// Navegar a una escena
sceneManager.goToScene('skyloft-menu');

// O usando la función global
window.navigateTo('valley-menu');
```

**Desde Adobe Animate (en tu timeline):**
```javascript
// En un botón dentro de Adobe Animate
this.miBoton.addEventListener("click", function() {
    window.navigateTo('otra-escena');
});
```

## 🔧 Agregar Nuevas Escenas

### Paso 1: Exportar desde Adobe Animate

1. Crea tu proyecto en Adobe Animate
2. Exporta como HTML5 Canvas
3. Copia los archivos generados:
   - `MiProyecto.js` → `js/animate-projects/`
   - Carpeta de imágenes → `assets/images/mi-proyecto/`

### Paso 2: Actualizar Rutas en el JS

En el archivo `js/animate-projects/MiProyecto.js`, busca la sección `manifest` y actualiza las rutas:

```javascript
manifest: [
    {src:"assets/images/mi-proyecto/imagen.jpg", id:"imagen"}
],
```

### Paso 3: Registrar la Escena

En `js/main.js`, agrega la configuración en la función `setupScenes()`:

```javascript
sceneManager.registerScene({
    id: 'mi-escena',
    name: 'Mi Nueva Escena',
    scriptPath: 'js/animate-projects/MiProyecto.js',
    compositionId: 'EL-ID-DE-LA-COMPOSICION', // Copiado del .js
    className: 'NombreDeLaClase', // Copiado del .js
    manifest: [
        { src: "assets/images/mi-proyecto/imagen.jpg", id: "imagen" }
    ],
    onInit: (scene) => {
        console.log('Mi escena inicializada');
        setupMiEscenaButtons(scene);
    }
});
```

### Paso 4: Configurar Interacciones (Opcional)

Si tienes botones en tu composición de Adobe Animate:

```javascript
function setupMiEscenaButtons(scene) {
    const root = scene.exportRoot;
    
    if (root.miBoton) {
        root.miBoton.addEventListener("click", () => {
            sceneManager.goToScene('otra-escena');
        });
        root.miBoton.cursor = "pointer";
    }
}
```

## 🎨 Personalización

### Cambiar Escena Inicial

En `js/main.js`, línea de inicialización:

```javascript
await sceneManager.goToScene('mi-escena-inicial');
```

### Modificar Transiciones

En `index.html`, CSS para `.scene-container`:

```css
.scene-container {
    transition: opacity 0.5s ease-in-out; /* Modifica aquí */
}
```

### Pre-cargar Escenas

En `js/main.js`:

```javascript
// Pre-cargar escenas específicas
sceneManager.preloadScenes(['escena1', 'escena2', 'escena3']);
```

## 🐛 Debugging y Resolución de Problemas

### Logs del Sistema

Abre la consola del navegador (F12) para ver logs detallados:

- `✓` Marca operaciones exitosas
- `❌` Marca errores
- `🔄` Indica procesos en curso
- `📦` Muestra carga de assets
- `→` Indica navegación entre escenas
- `👁️` Muestra/oculta escenas
- `📥` Indica precarga en background

### Problemas Comunes Resueltos

#### ❌ Error: "ReferenceError: stage is not defined"

**Causa**: La función `AdobeAn.makeResponsive()` de Adobe Animate esperaba una variable global `stage`.

**Solución**: Implementamos `makeSceneResponsive()` personalizado que usa `scene.stage` local para cada escena.

```javascript
// ❌ ANTES: Usaba stage global
AdobeAn.makeResponsive(true, 'both', true, 1, [canvas, container]);

// ✅ AHORA: Sistema personalizado sin variables globales
this.makeSceneResponsive(scene, lib);
```

#### ⚠️ Problema: Controles desaparecen durante transiciones

**Causa**: El preloader global cubría toda la pantalla en cada transición.

**Solución**: 
1. Preloader solo se muestra cuando una escena necesita cargarse por primera vez
2. Z-index jerárquico (preloader: 100000, controles: 10000, escenas: 1)
3. Transiciones entre escenas ya cargadas son instantáneas sin preloader

```javascript
// Solo muestra preloader si la escena no está inicializada
if (!scene.isInitialized) {
    this.showGlobalPreloader(`Cargando ${scene.name}...`);
    await this.initScene(sceneId);
    this.hideGlobalPreloader();
}
// Si ya está cargada: transición suave inmediata
```

#### 🎨 Problema: Escenas no centradas correctamente

**Causa**: Uso de `position: absolute` con márgenes automáticos no siempre funciona bien.

**Solución**: Sistema Flexbox completo:

```css
#app-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.scene-container.active {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

### Comportamiento Esperado

✅ **Primera carga**: 
- Preloader visible ~1-2 segundos
- GT Menu se carga y muestra
- Controles visibles permanentemente

✅ **Navegación entre escenas (primera vez)**:
- Preloader aparece brevemente
- Escena se carga
- Transición suave

✅ **Navegación entre escenas (ya cargadas)**:
- Sin preloader
- Transición instantánea (0.5s fade)
- Controles siempre visibles

✅ **Precarga automática**:
- Después de 2 segundos, todas las escenas se precargan
- Navegación posterior es instantánea

## 📊 API del SceneManager

### Métodos Principales

```javascript
// Navegar a una escena
sceneManager.goToScene(sceneId, transition = true)

// Obtener escena actual
sceneManager.getCurrentScene()

// Obtener una escena específica
sceneManager.getScene(sceneId)

// Obtener todas las escenas
sceneManager.getAllScenes()

// Pre-cargar escenas
sceneManager.preloadScenes([sceneIds])

// Destruir una escena (liberar memoria)
sceneManager.destroyScene(sceneId)
```

### Callbacks de Escena

Cada escena puede tener estos callbacks:

```javascript
{
    onInit: (scene) => {}, // Se ejecuta al inicializar
    onShow: (scene) => {}, // Se ejecuta al mostrar
    onHide: (scene) => {}  // Se ejecuta al ocultar
}
```

## 🔐 Notas Importantes

1. **IDs Únicos**: Asegúrate de que cada escena tenga un ID único
2. **Rutas Correctas**: Verifica que las rutas de assets sean correctas
3. **Nombres de Clases**: Los nombres de clase vienen del símbolo en la biblioteca de Adobe Animate
4. **Servidor Local**: Algunos navegadores requieren servidor local para cargar assets (usa Live Server en VS Code)
5. **Variables Globales**: El sistema NO contamina el scope global con variables de stage o canvas
6. **Gestión de Memoria**: Los event listeners se limpian correctamente al destruir escenas

## ⚡ Optimizaciones Implementadas

### Rendimiento

1. **Carga Perezosa**: Solo carga escenas cuando son necesarias
2. **Precarga Inteligente**: Después de la primera escena, precarga las demás en background
3. **Ticker Condicional**: Solo actualiza el stage de escenas activas
4. **Cleanup de Listeners**: Los resize handlers se remueven al destruir escenas

### Experiencia de Usuario

1. **Transiciones Suaves**: Fade in/out de 0.5s entre escenas
2. **Preloader Contextual**: Muestra el nombre de la escena que está cargando
3. **UI Persistente**: Controles y overlay siempre visibles con z-index alto
4. **Centrado Perfecto**: Flexbox para centrado en todas las dimensiones de pantalla
5. **Responsive Real**: Se adapta dinámicamente al redimensionar ventana

### Arquitectura

1. **Separación de Concerns**: SceneManager, main.js, index.html claramente separados
2. **No Variables Globales**: Cada escena es independiente con su propio stage
3. **Sistema de Callbacks**: onInit, onShow, onHide para lógica personalizada
4. **API Limpia**: Métodos claros y documentados

## 🎯 Mejores Prácticas

### Al Crear Escenas en Adobe Animate

1. **Nombra los símbolos claramente** - El nombre será el `className` en el código
2. **Usa nombres descriptivos para botones** - Facilita referenciarlos desde JavaScript
3. **Optimiza assets** - Comprime imágenes antes de importar
4. **Usa atlas de sprites** - Para múltiples imágenes pequeñas (mejor rendimiento)
5. **Define dimensiones estándar** - Recomendado 1280x720 (16:9)

### Al Integrar con el Sistema

1. **Registra escenas en orden lógico** - Primera escena = escena inicial
2. **Implementa callbacks** - Para lógica específica de cada escena
3. **Usa console.log en desarrollo** - El sistema ya tiene logging extensivo
4. **Precarga escenas críticas** - Usa `preloadScenes()` para flujos importantes
5. **Limpia recursos** - Usa `destroyScene()` para liberar memoria si es necesario

### Debugging

1. **Abre DevTools (F12)** antes de cargar la página
2. **Verifica la consola** - Todos los eventos importantes se loguean
3. **Inspecciona elementos** - Verifica z-index y display de containers
4. **Network tab** - Confirma que assets se cargan correctamente
5. **Performance tab** - Monitorea el uso de memoria y CPU

## 🛠️ Tecnologías

- **CreateJS** - Framework de animación en Canvas
- **Adobe Animate CC** - Herramienta de autoría
- **JavaScript ES6+** - Lógica de la aplicación
- **HTML5 Canvas** - Renderizado

## 📝 Flujo de Trabajo Recomendado

1. **Diseña** tu escena en Adobe Animate
2. **Exporta** como HTML5 Canvas
3. **Mueve** los archivos a las carpetas correspondientes
4. **Actualiza** las rutas en el archivo .js
5. **Registra** la escena en main.js
6. **Prueba** en el navegador

## 🎓 Ejemplos en el Proyecto

Este proyecto incluye tres escenas completamente funcionales:

1. **GT Menu** (`js/animate-projects/GT-Menu.js`)
   - Menú inspirado en Gran Turismo
   - Imagen JPG de alta resolución
   - Ejemplo de escena simple con una sola imagen

2. **Skyloft Menu** (`js/animate-projects/Skyloft-menu.js`)
   - Menú inspirado en The Legend of Zelda: Skyward Sword
   - Imagen PNG con transparencia
   - Ejemplo de escenario escalado

3. **Valley Menu** (`js/animate-projects/Valley-Menu.js`)
   - Menú inspirado en Monument Valley
   - Usa sprite sheet atlas para optimización
   - Ejemplo de uso de atlas de texturas

### Código de Referencia

Ver `js/main.js` para:
- ✅ Configuración completa de las tres escenas
- ✅ Implementación de callbacks personalizados
- ✅ Ejemplos de setup de botones (comentados)
- ✅ Sistema de precarga configurado

Ver `js/SceneManager.js` para:
- ✅ Implementación completa del gestor de escenas
- ✅ Sistema responsive personalizado
- ✅ Manejo de assets y sprites
- ✅ Gestión de memoria y cleanup

## 🚀 Estado del Proyecto

**Versión**: 2.0  
**Estado**: ✅ Producción Ready  
**Última actualización**: Noviembre 2024

### Cambios Recientes (v2.0)

- ✅ Sistema responsive personalizado (sin variables globales)
- ✅ Preloader inteligente (solo cuando es necesario)
- ✅ Controles permanentemente visibles
- ✅ Centrado perfecto con Flexbox
- ✅ Precarga automática en background
- ✅ Gestión optimizada de memoria
- ✅ Jerarquía de z-index documentada
- ✅ Logging extensivo para debugging
- ✅ Sistema de callbacks robusto

### Próximas Mejoras Sugeridas

- [ ] Agregar transiciones personalizables (slide, scale, etc.)
- [ ] Implementar sistema de audio por escena
- [ ] Agregar soporte para escenas modales/overlay
- [ ] Sistema de historial de navegación (back/forward)
- [ ] Persistencia de estado entre sesiones
- [ ] Modo fullscreen
- [ ] Temas personalizables para los controles

## 🤝 Contribuir

Este es un proyecto experimental diseñado para ser extensible. Siéntete libre de:

- 🔧 Modificarlo según tus necesidades
- 📚 Usarlo como base para tus proyectos
- 💡 Sugerir mejoras
- 🐛 Reportar problemas

## 📄 Licencia

**MIT License con Atribución Requerida**

Copyright (c) 2024 Mauricio Rivero

Este proyecto está licenciado bajo la Licencia MIT, lo que significa que:

✅ **Puedes**:
- Usar el código para proyectos personales y comerciales
- Modificar y distribuir el código
- Usar el código en proyectos privados
- Sublicenciar y vender copias

⚠️ **Con la condición de que**:
- **Debes incluir el aviso de copyright original** en todas las copias o partes sustanciales del software
- **Debes dar crédito al autor original** (Mauricio Rivero) en la documentación o README de tu fork
- Debes incluir una copia de esta licencia en cualquier distribución

❌ **El software se proporciona "TAL CUAL"**, sin garantías de ningún tipo.

### Cómo Dar Atribución

Si haces fork o usas este código en tu proyecto, por favor incluye lo siguiente en tu README:

```markdown
Este proyecto está basado en/incluye código de:
**Experimento-Villa-Platzi** por Mauricio Rivero
Repositorio original: [enlace si aplica]
Licencia: MIT
```

### Texto Completo de la Licencia MIT

```
MIT License

Copyright (c) 2024 Mauricio Rivero

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Agradecimientos

- **CreateJS Team** - Por el excelente framework de Canvas
- **Adobe Animate** - Por la poderosa herramienta de autoría
- **Comunidad Platzi** - Por el apoyo y feedback

---

## 📞 Contacto y Soporte

Para preguntas o problemas:
1. Revisa la sección de **Debugging y Resolución de Problemas**
2. Verifica la consola del navegador (F12)
3. Confirma que estás usando un servidor local

---

### Tips Finales

💡 **Performance**: Si trabajas con muchas escenas, considera implementar un sistema de pooling para reutilizar stages

💡 **Assets**: Optimiza tus imágenes con herramientas como TinyPNG antes de importarlas

💡 **Testing**: Prueba en diferentes tamaños de pantalla y dispositivos

💡 **Production**: Minifica y bundlea el código antes de deployar

💡 **Monitoring**: Usa `sceneManager.getAllScenes()` en la consola para inspeccionar el estado

