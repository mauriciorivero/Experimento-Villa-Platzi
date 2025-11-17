/**
 * main.js - Punto de entrada principal
 * Configura y inicializa todas las escenas del proyecto
 * 
 * @author Mauricio Rivero
 * @copyright Copyright (c) 2024 Mauricio Rivero
 * @license MIT License - Se requiere atribución al autor original
 * @version 2.0
 */

// Crear instancia del gestor de escenas
const sceneManager = new SceneManager();

// ============================================
// CONFIGURACIÓN DE ESCENAS
// ============================================

/**
 * Registra todas las escenas del proyecto
 */
function setupScenes() {
    
    console.log('⚙️ Configurando escenas...');

    // Escena 1: GT Menu
    sceneManager.registerScene({
        id: 'gt-menu',
        name: 'Gran Turismo Menu',
        scriptPath: 'js/animate-projects/GT-Menu.js',
        compositionId: '62AAE5A744B5407CB141A6110E8816B9',
        className: 'GTMenu',
        manifest: [
            { src: "assets/images/gt/granturismomenu.jpg", id: "granturismomenu" }
        ],
        onInit: (scene) => {
            console.log('🏎️ GT Menu inicializado');
            setupGTMenuButtons(scene);
        },
        onShow: (scene) => {
            console.log('🏎️ GT Menu mostrado');
        },
        onHide: (scene) => {
            console.log('🏎️ GT Menu ocultado');
        }
    });

    // Escena 2: Skyloft Menu
    sceneManager.registerScene({
        id: 'skyloft-menu',
        name: 'Skyloft Menu',
        scriptPath: 'js/animate-projects/Skyloft-menu.js',
        compositionId: '62AAE5A744B5407CB141A6110E8816B9',
        className: 'Skyloftmenu',
        manifest: [
            { src: "assets/images/skyloft/Skyloft.png", id: "Skyloft" }
        ],
        onInit: (scene) => {
            console.log('☁️ Skyloft Menu inicializado');
            setupSkyloftMenuButtons(scene);
        },
        onShow: (scene) => {
            console.log('☁️ Skyloft Menu mostrado');
        },
        onHide: (scene) => {
            console.log('☁️ Skyloft Menu ocultado');
        }
    });

    // Escena 3: Valley Menu
    sceneManager.registerScene({
        id: 'valley-menu',
        name: 'Valley Menu',
        scriptPath: 'js/animate-projects/Valley-Menu.js',
        compositionId: '62AAE5A744B5407CB141A6110E8816B9',
        className: 'ValleyMenu',
        manifest: [
            { src: "assets/images/valley/Valley_Menu_atlas_1.png", id: "Valley_Menu_atlas_1" }
        ],
        onInit: (scene) => {
            console.log('🏔️ Valley Menu inicializado');
            setupValleyMenuButtons(scene);
        },
        onShow: (scene) => {
            console.log('🏔️ Valley Menu mostrado');
        },
        onHide: (scene) => {
            console.log('🏔️ Valley Menu ocultado');
        }
    });

    console.log('✓ Escenas configuradas');
}

// ============================================
// CONFIGURACIÓN DE INTERACCIONES
// ============================================

/**
 * Configura los botones/interacciones del GT Menu
 * 
 * IMPORTANTE: Estos ejemplos asumen que tienes botones en tu timeline de Adobe Animate.
 * Si no los tienes, puedes comentar estas funciones o agregar los botones en Animate.
 */
function setupGTMenuButtons(scene) {
    const root = scene.exportRoot;
    
    // Ejemplo: Si tienes un botón llamado "btnSkyloft" en tu timeline de Animate
    if (root.btnSkyloft) {
        root.btnSkyloft.addEventListener("click", () => {
            console.log('Navegando a Skyloft...');
            sceneManager.goToScene('skyloft-menu');
        });
        root.btnSkyloft.cursor = "pointer";
    }

    // Ejemplo: Botón para ir a Valley
    if (root.btnValley) {
        root.btnValley.addEventListener("click", () => {
            console.log('Navegando a Valley...');
            sceneManager.goToScene('valley-menu');
        });
        root.btnValley.cursor = "pointer";
    }

    // Por ahora, puedes navegar usando los botones de prueba en el HTML
    console.log('  💡 Usa los botones de la derecha para navegar entre escenas');
}

/**
 * Configura los botones del Skyloft Menu
 */
function setupSkyloftMenuButtons(scene) {
    const root = scene.exportRoot;
    
    if (root.btnBack) {
        root.btnBack.addEventListener("click", () => {
            sceneManager.goToScene('gt-menu');
        });
        root.btnBack.cursor = "pointer";
    }

    if (root.btnValley) {
        root.btnValley.addEventListener("click", () => {
            sceneManager.goToScene('valley-menu');
        });
        root.btnValley.cursor = "pointer";
    }

    if (root.btnGT) {
        root.btnGT.addEventListener("click", () => {
            sceneManager.goToScene('gt-menu');
        });
        root.btnGT.cursor = "pointer";
    }
}

/**
 * Configura los botones del Valley Menu
 */
function setupValleyMenuButtons(scene) {
    const root = scene.exportRoot;
    
    if (root.btnBack) {
        root.btnBack.addEventListener("click", () => {
            sceneManager.goToScene('gt-menu');
        });
        root.btnBack.cursor = "pointer";
    }

    if (root.btnSkyloft) {
        root.btnSkyloft.addEventListener("click", () => {
            sceneManager.goToScene('skyloft-menu');
        });
        root.btnSkyloft.cursor = "pointer";
    }

    if (root.btnGT) {
        root.btnGT.addEventListener("click", () => {
            sceneManager.goToScene('gt-menu');
        });
        root.btnGT.cursor = "pointer";
    }
}

// ============================================
// API GLOBAL PARA ACCESO DESDE ANIMATE
// ============================================

/**
 * Función global para navegar entre escenas
 * Puedes llamarla desde Adobe Animate con:
 * window.navigateTo('nombre-escena')
 */
window.navigateTo = function(sceneId) {
    sceneManager.goToScene(sceneId);
};

/**
 * Obtener escena actual
 */
window.getCurrentScene = function() {
    return sceneManager.getCurrentScene();
};

/**
 * Obtener todas las escenas
 */
window.getAllScenes = function() {
    return sceneManager.getAllScenes();
};

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando aplicación interactiva...');
    console.log('═══════════════════════════════════════');
    
    try {
        // 1. Configurar todas las escenas
        setupScenes();
        
        // 2. Cargar escena inicial (GT Menu)
        console.log('📍 Cargando escena inicial...');
        await sceneManager.goToScene('gt-menu');
        
        // 3. (Opcional) Pre-cargar otras escenas en background después de 2 segundos
        // Esto mejora la experiencia del usuario al cambiar de escena
        setTimeout(() => {
            console.log('📥 Iniciando precarga de escenas adicionales...');
            sceneManager.preloadScenes(['skyloft-menu', 'valley-menu'])
                .then(() => {
                    console.log('✓ Todas las escenas precargadas y listas');
                });
        }, 2000);
        
        console.log('═══════════════════════════════════════');
        console.log('✓ Aplicación lista para usar');
        console.log('💡 Usa los botones de la derecha para navegar');
        
    } catch (error) {
        console.error('❌ Error durante la inicialización:', error);
    }
});

// Hacer el sceneManager accesible globalmente
window.sceneManager = sceneManager;

// Log útil para debugging
console.log('📦 main.js cargado correctamente');

