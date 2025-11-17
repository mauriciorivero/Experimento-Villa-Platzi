/**
 * SceneManager - Gestor centralizado de escenas de Adobe Animate
 * Maneja la carga, transición y comunicación entre múltiples composiciones
 * 
 * @author Mauricio Rivero
 * @copyright Copyright (c) 2024 Mauricio Rivero
 * @license MIT License - Se requiere atribución al autor original
 * @version 2.0
 */

class SceneManager {
    constructor() {
        this.scenes = new Map(); // Mapa de escenas registradas
        this.currentScene = null;
        this.loadedScripts = new Set(); // Scripts ya cargados
        this.appContainer = document.getElementById('app-container');
        this.globalPreloader = document.getElementById('global-preloader');
        
        // Cola de carga para optimización
        this.loadQueue = [];
        this.isLoading = false;

        console.log('🎬 SceneManager inicializado');
    }

    /**
     * Registra una nueva escena
     */
    registerScene(config) {
        const scene = {
            id: config.id,
            name: config.name,
            scriptPath: config.scriptPath,
            compositionId: config.compositionId,
            className: config.className,
            manifest: config.manifest,
            preloadAssets: config.preloadAssets || false,
            
            // Estado
            isLoaded: false,
            isInitialized: false,
            
            // Referencias DOM
            container: null,
            canvas: null,
            stage: null,
            exportRoot: null,
            
            // Callbacks personalizados
            onInit: config.onInit || null,
            onShow: config.onShow || null,
            onHide: config.onHide || null
        };

        this.scenes.set(config.id, scene);
        console.log(`✓ Escena registrada: ${config.name} (${config.id})`);
        
        return scene;
    }

    /**
     * Crea el DOM para una escena
     */
    createSceneDOM(sceneId) {
        const scene = this.scenes.get(sceneId);
        if (!scene) {
            console.error(`Escena no encontrada: ${sceneId}`);
            return;
        }

        // Crear contenedor de escena
        const sceneContainer = document.createElement('div');
        sceneContainer.id = `scene-${sceneId}`;
        sceneContainer.className = 'scene-container';

        // Crear wrapper de animación
        const animWrapper = document.createElement('div');
        animWrapper.className = 'animation-wrapper';

        // Crear canvas
        const canvas = document.createElement('canvas');
        canvas.id = `canvas-${sceneId}`;
        canvas.className = 'animation-canvas';
        canvas.width = 1280;
        canvas.height = 720;

        // Ensamblar
        animWrapper.appendChild(canvas);
        sceneContainer.appendChild(animWrapper);
        this.appContainer.appendChild(sceneContainer);

        // Guardar referencias
        scene.container = sceneContainer;
        scene.canvas = canvas;

        console.log(`✓ DOM creado para: ${scene.name}`);
    }

    /**
     * Carga el script de Adobe Animate de una escena
     */
    async loadSceneScript(sceneId) {
        const scene = this.scenes.get(sceneId);
        if (!scene) throw new Error(`Escena no encontrada: ${sceneId}`);

        // Si ya está cargado, no hacer nada
        if (this.loadedScripts.has(scene.scriptPath)) {
            console.log(`Script ya cargado: ${scene.scriptPath}`);
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = scene.scriptPath;
            script.onload = () => {
                this.loadedScripts.add(scene.scriptPath);
                console.log(`✓ Script cargado: ${scene.scriptPath}`);
                resolve();
            };
            script.onerror = () => {
                reject(new Error(`Error cargando script: ${scene.scriptPath}`));
            };
            document.head.appendChild(script);
        });
    }

    /**
     * Inicializa una escena (equivalente a la función init() original)
     */
    async initScene(sceneId) {
        const scene = this.scenes.get(sceneId);
        if (!scene) throw new Error(`Escena no encontrada: ${sceneId}`);

        if (scene.isInitialized) {
            console.log(`Escena ya inicializada: ${scene.name}`);
            return;
        }

        try {
            console.log(`🔄 Inicializando escena: ${scene.name}`);

            // 1. Cargar script si no está cargado
            if (!this.loadedScripts.has(scene.scriptPath)) {
                await this.loadSceneScript(sceneId);
            }

            // 2. Crear DOM si no existe
            if (!scene.container) {
                this.createSceneDOM(sceneId);
            }

            // 3. Obtener composición de Adobe Animate
            const comp = AdobeAn.getComposition(scene.compositionId);
            if (!comp) {
                throw new Error(`Composición no encontrada: ${scene.compositionId}`);
            }

            const lib = comp.getLibrary();

            // 4. Cargar assets
            await this.loadSceneAssets(scene, comp);

            // 5. Crear Stage y exportRoot
            scene.exportRoot = new lib[scene.className]();
            scene.stage = new lib.Stage(scene.canvas);

            // 6. Configurar animación
            scene.stage.addChild(scene.exportRoot);
            createjs.Ticker.framerate = lib.properties.fps;
            
            // Importante: crear un ticker listener específico para esta escena
            const tickListener = () => {
                if (scene.container && scene.container.classList.contains('active')) {
                    scene.stage.update();
                }
            };
            scene.tickListener = tickListener;
            createjs.Ticker.addEventListener("tick", tickListener);

            // 7. Hacer responsive con nuestra propia implementación
            this.makeSceneResponsive(scene, lib);

            scene.isInitialized = true;
            console.log(`✓ Escena inicializada: ${scene.name}`);

            // 8. Callback personalizado
            if (scene.onInit) {
                scene.onInit(scene);
            }

        } catch (error) {
            console.error(`❌ Error inicializando escena ${scene.name}:`, error);
            throw error;
        }
    }

    /**
     * Hace una escena responsive sin depender de variables globales
     */
    makeSceneResponsive(scene, lib) {
        let lastW, lastH, lastS = 1;
        
        const resizeCanvas = () => {
            if (!scene.stage || !scene.canvas || !scene.container) return;
            
            const w = lib.properties.width;
            const h = lib.properties.height;
            const iw = window.innerWidth;
            const ih = window.innerHeight;
            const pRatio = window.devicePixelRatio || 1;
            const xRatio = iw / w;
            const yRatio = ih / h;
            let sRatio = 1;
            
            // Calcular ratio de escala
            if (lastW === iw && lastH === ih) {
                sRatio = lastS;
            } else {
                if (iw < w || ih < h) {
                    sRatio = Math.min(xRatio, yRatio);
                } else {
                    sRatio = Math.min(xRatio, yRatio);
                }
            }
            
            // Aplicar dimensiones al canvas
            scene.canvas.width = w * pRatio * sRatio;
            scene.canvas.height = h * pRatio * sRatio;
            scene.canvas.style.width = w * sRatio + 'px';
            scene.canvas.style.height = h * sRatio + 'px';
            
            // El contenedor se centra automáticamente con CSS
            // No establecemos dimensiones en el contenedor para permitir el centrado
            
            // Escalar el stage
            scene.stage.scaleX = pRatio * sRatio;
            scene.stage.scaleY = pRatio * sRatio;
            
            lastW = iw;
            lastH = ih;
            lastS = sRatio;
            
            // Actualizar stage
            scene.stage.tickOnUpdate = false;
            scene.stage.update();
            scene.stage.tickOnUpdate = true;
        };
        
        // Guardar la función de resize para poder removerla después
        scene.resizeHandler = resizeCanvas;
        
        // Agregar listener de resize
        window.addEventListener('resize', resizeCanvas);
        
        // Ejecutar inmediatamente
        resizeCanvas();
    }

    /**
     * Carga los assets de una escena
     */
    loadSceneAssets(scene, comp) {
        return new Promise((resolve, reject) => {
            const lib = comp.getLibrary();
            const loader = new createjs.LoadQueue(false);
            
            console.log(`📦 Cargando assets de: ${scene.name}`);

            // Handler de carga de archivo
            loader.addEventListener("fileload", (evt) => {
                const images = comp.getImages();
                if (evt && evt.item.type === "image") {
                    images[evt.item.id] = evt.result;
                    console.log(`  ✓ Asset cargado: ${evt.item.id}`);
                }
            });

            // Handler de carga completa
            loader.addEventListener("complete", (evt) => {
                // Crear sprite sheets si existen
                const ss = comp.getSpriteSheet();
                const queue = evt.target;
                const ssMetadata = lib.ssMetadata;
                
                for (let i = 0; i < ssMetadata.length; i++) {
                    ss[ssMetadata[i].name] = new createjs.SpriteSheet({
                        "images": [queue.getResult(ssMetadata[i].name)],
                        "frames": ssMetadata[i].frames
                    });
                }

                scene.isLoaded = true;
                console.log(`✓ Assets cargados completamente: ${scene.name}`);
                resolve();
            });

            loader.addEventListener("error", (evt) => {
                console.error(`❌ Error cargando assets:`, evt);
                reject(new Error(`Error cargando assets: ${evt.data}`));
            });

            // Iniciar carga
            loader.loadManifest(lib.properties.manifest);
        });
    }

    /**
     * Navega a una escena (con transición)
     */
    async goToScene(sceneId, transition = true) {
        const scene = this.scenes.get(sceneId);
        if (!scene) {
            console.error(`❌ Escena no encontrada: ${sceneId}`);
            return;
        }

        console.log(`→ Navegando a: ${scene.name}`);

        try {
            // 1. Inicializar escena si no está inicializada
            // Solo mostrar preloader si necesita cargar por primera vez
            if (!scene.isInitialized) {
                this.showGlobalPreloader(`Cargando ${scene.name}...`);
                await this.initScene(sceneId);
                this.hideGlobalPreloader();
            }

            // 2. Ocultar escena actual (sin preloader, transición suave)
            if (this.currentScene && this.currentScene !== scene) {
                await this.hideScene(this.currentScene.id, transition);
            }

            // 3. Mostrar nueva escena (sin preloader, transición suave)
            await this.showScene(sceneId, transition);

            // 4. Actualizar escena actual
            this.currentScene = scene;

            console.log(`✓ Escena activa: ${scene.name}`);

        } catch (error) {
            console.error(`❌ Error navegando a escena ${scene.name}:`, error);
            this.hideGlobalPreloader(); // Asegurar que se oculte en caso de error
        }
    }

    /**
     * Muestra una escena
     */
    async showScene(sceneId, transition = true) {
        const scene = this.scenes.get(sceneId);
        if (!scene || !scene.container) return;

        console.log(`👁️ Mostrando escena: ${scene.name}`);

        scene.container.style.display = 'block';
        
        if (transition) {
            // Pequeño delay para que el navegador aplique el display: block
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        scene.container.classList.add('active');

        // Callback personalizado
        if (scene.onShow) {
            scene.onShow(scene);
        }

        // Forzar actualización del stage
        if (scene.stage) {
            scene.stage.update();
        }
    }

    /**
     * Oculta una escena
     */
    async hideScene(sceneId, transition = true) {
        const scene = this.scenes.get(sceneId);
        if (!scene || !scene.container) return;

        console.log(`🙈 Ocultando escena: ${scene.name}`);

        scene.container.classList.remove('active');

        if (transition) {
            // Esperar a que termine la transición CSS
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        scene.container.style.display = 'none';

        // Callback personalizado
        if (scene.onHide) {
            scene.onHide(scene);
        }
    }

    /**
     * Pre-carga escenas en background
     */
    async preloadScenes(sceneIds) {
        console.log(`📥 Precargando escenas: ${sceneIds.join(', ')}`);
        
        for (const sceneId of sceneIds) {
            try {
                const scene = this.scenes.get(sceneId);
                if (scene && !scene.isInitialized) {
                    console.log(`  ⏳ Precargando: ${scene.name}`);
                    await this.initScene(sceneId);
                }
            } catch (error) {
                console.error(`❌ Error precargando escena ${sceneId}:`, error);
            }
        }

        console.log(`✓ Precarga completada`);
    }

    /**
     * Obtiene la escena actual
     */
    getCurrentScene() {
        return this.currentScene;
    }

    /**
     * Obtiene una escena por ID
     */
    getScene(sceneId) {
        return this.scenes.get(sceneId);
    }

    /**
     * Obtiene todas las escenas registradas
     */
    getAllScenes() {
        return Array.from(this.scenes.values());
    }

    /**
     * Muestra el preloader global
     */
    showGlobalPreloader(text = 'Cargando escena...') {
        if (this.globalPreloader) {
            this.globalPreloader.classList.remove('hidden');
            const loaderText = this.globalPreloader.querySelector('.loader-text');
            if (loaderText) {
                loaderText.textContent = text;
            }
        }
    }

    /**
     * Oculta el preloader global
     */
    hideGlobalPreloader() {
        if (this.globalPreloader) {
            setTimeout(() => {
                this.globalPreloader.classList.add('hidden');
            }, 300);
        }
    }

    /**
     * Destruye una escena (libera memoria)
     */
    destroyScene(sceneId) {
        const scene = this.scenes.get(sceneId);
        if (!scene) return;

        console.log(`🗑️ Destruyendo escena: ${scene.name}`);

        // Remover ticker listener
        if (scene.tickListener) {
            createjs.Ticker.removeEventListener("tick", scene.tickListener);
        }

        // Remover resize listener
        if (scene.resizeHandler) {
            window.removeEventListener('resize', scene.resizeHandler);
        }

        // Remover del Stage
        if (scene.stage && scene.exportRoot) {
            scene.stage.removeChild(scene.exportRoot);
        }

        // Remover DOM
        if (scene.container) {
            scene.container.remove();
        }

        // Resetear estado
        scene.isInitialized = false;
        scene.isLoaded = false;
        scene.stage = null;
        scene.exportRoot = null;
        scene.container = null;
        scene.canvas = null;
        scene.resizeHandler = null;

        console.log(`✓ Escena destruida: ${scene.name}`);
    }
}

// Hacer global para acceso desde Adobe Animate
window.SceneManager = SceneManager;

