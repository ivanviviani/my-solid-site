import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { randomColor } from "../utils/utils";
import { IMAGES_FOLDER } from "../utils/constants";

export class ThreeDRendererService {

    #canvas: HTMLCanvasElement;
    #scene: THREE.Scene;
    #camera: THREE.PerspectiveCamera;
    #renderer: THREE.WebGLRenderer;
    #controls: THREE.OrbitControls;
    #pointLight: THREE.PointLight;
    #ambientLight: THREE.AmbientLight;
    #pointLightHelper?: THREE.PointLightHelper;
    #gridHelper?: THREE.GridHelper;

    #torus?: THREE.Mesh;
    #moon?: THREE.Mesh;
    #stars?: THREE.Mesh[];

    constructor() {}

    createScene(canvas: HTMLCanvasElement): void {
        this.#canvas = canvas;

        // create scene
        this.#scene = new THREE.Scene();
        this.#scene.background = new THREE.Color();
        //this.#createSpaceTexture();
    
        // create geometries and lights
        this.#ambientLight = this.#getAmbientLight();
        this.#scene.add(this.#ambientLight);
        this.#stars = Array(800).fill({}).map(() => this.#getStarGeometry());
        this.#scene.add(...this.#stars);
    
        // create helpers
        this.#createHelpers();
    
        // camera and renderer
        this.#createCamera();
        this.#createRenderer();
    
        // orbit controls
        this.#createControls();
    
        this.resize();
        this.animate();
    }
    
    resize(): void {
        this.#camera.aspect = window.innerWidth / window.innerHeight;
        this.#camera.updateProjectionMatrix();
        this.#renderer.setPixelRatio(window.devicePixelRatio);
        this.#renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate(): void {
        requestAnimationFrame(() => this.animate());
    
        if (this.#torus) {
            this.#torus.rotation.x += .01;
            this.#torus.rotation.y += .005;
            this.#torus.rotation.z += .01;
        }
    
        this.#controls.update();
        this.#renderer.render(this.#scene, this.#camera);
    }
    
    #createHelpers(): void {
        if (this.#pointLight) 
            this.#pointLightHelper = new THREE.PointLightHelper(this.#pointLight);
        this.#gridHelper = new THREE.GridHelper(200, 50);
    }

    #createCamera(): void {
        this.#camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.#camera.position.setZ(30);
    }

    #createRenderer(): void {
        this.#renderer = new THREE.WebGLRenderer({ canvas: this.#canvas });
    }

    #createControls(): void {
        this.#controls = new OrbitControls(this.#camera, this.#renderer.domElement);
    }
    
    #getTorusGeometry(): THREE.Mesh {
        const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
        const material = new THREE.MeshStandardMaterial({
            color: 0xFF6347,
        });
        const torus = new THREE.Mesh(geometry, material);
        return torus;
    }
    
    #getPointLight(): THREE.PointLight {
        const pointLight = new THREE.PointLight(0xFFFFFF);
        pointLight.position.set(5, 5, 5);
        return pointLight;
    }
    
    #getAmbientLight(): THREE.AmbientLight {
        const ambientLight = new THREE.AmbientLight(0xFFFFFF);
        return ambientLight;
    }
    
    #getStarGeometry(): THREE.Mesh {
        const geometry = new THREE.SphereGeometry(0.25, 24, 24);
        const material = new THREE.MeshStandardMaterial({ color: randomColor(90) });
        const star = new THREE.Mesh(geometry, material);
        const [x, y, z] = Array(3).fill({}).map(() => THREE.MathUtils.randFloatSpread(100));
        star.position.set(x, y, z);
        star
        return star;
    }
    
    #createSpaceTexture(): void {
        const spaceTexture = new THREE.TextureLoader().load(IMAGES_FOLDER + 'space.jpg');
        this.#scene.background = spaceTexture;
    }
    
    #getMoonGeometry(): THREE.Mesh {
        const moonTexture = new THREE.TextureLoader().load(IMAGES_FOLDER + 'moon.jpg');
        const normalTexture = new THREE.TextureLoader().load(IMAGES_FOLDER + 'normal-texture.jpg');
        const moon = new THREE.Mesh(
            new THREE.SphereGeometry(3, 32, 32),
            new THREE.MeshStandardMaterial({
                map: moonTexture,
                normalMap: normalTexture,
            })
        );
        moon.position.setZ(30);
        moon.position.setX(-10);
        return moon;
    }
    
    moveCamera() {
        const t = document.body.getBoundingClientRect().top;

        if (this.#moon) {
            // update moon position
            this.#moon.rotation.x += .05;
            this.#moon.rotation.y += .075;
            this.#moon.rotation.z += .05;
        }

        // update camera position
        this.#camera.position.z = t * -.01;
        this.#camera.position.x = t * -.0002;
        this.#camera.position.y = t * -.0002;
    }
}