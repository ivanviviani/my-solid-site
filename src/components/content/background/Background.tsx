import { Component, onMount } from "solid-js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { IMAGES_FOLDER } from "../../../utils/constants";
import { debounce } from "../../../utils/utils";
import "./Background.scss";

const Background: Component = () => {

    let canvas;
    onMount(() => {
        const { renderer, camera, moon } = createScene(canvas);
        /*const debouncedResize = debounce((renderer : THREE.WebGLRenderer) => {
            resize(renderer);
        }, 500);*/
        window.addEventListener('resize', () => {
            resize(renderer, camera);
        });
        document.body.onscroll = () => {
            moveCamera(camera, moon);
        };
    });

    return <canvas class="background" ref={canvas}></canvas>;
};

export default Background;

function createScene(canvas: HTMLCanvasElement): {
    renderer: THREE.WebGLRenderer,
    camera: THREE.PerspectiveCamera,
    moon: THREE.Mesh
} {
    // create scene
    const scene = new THREE.Scene();
    createSpaceTexture(scene);

    // create geometries and lights
    const torus = createTorusGeometry();
    //scene.add(torus);
    const pointLight = createPointLight();
    //scene.add(pointLight);
    const ambientLight = createAmbientLight();
    scene.add(ambientLight);
    const stars = Array(200).fill({}).map(() => createStarGeometry());
    scene.add(...stars);
    const moon = createMoonGeometry();
    scene.add(moon);

    // create helpers
    const { pointLightHelper, gridHelper } = createHelpers(pointLight);
    if (pointLightHelper) {
        //scene.add(pointLightHelper);
    }
    //scene.add(gridHelper);

    // camera and renderer
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.setZ(30);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
    });

    // orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);

    resize(renderer, camera);
    animate(renderer, scene, camera, controls, torus);

    return { renderer, camera, moon };
}

function resize(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera): void {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    controls: OrbitControls,
    torus?: THREE.Mesh
): void {
    requestAnimationFrame(() => animate(renderer, scene, camera, controls, torus));

    if (torus) {
        torus.rotation.x += .01;
        torus.rotation.y += .005;
        torus.rotation.z += .01;
    }

    controls.update();
    renderer.render(scene, camera);
}

function createHelpers(pointLight?: THREE.PointLight): {
    pointLightHelper?: THREE.PointLightHelper,
    gridHelper: THREE.GridHelper
} {
    let pointLightHelper = undefined;
    if (pointLight) 
        pointLightHelper = createPointLightHelper(pointLight);
    const gridHelper = createGridHelper();
    return { pointLightHelper, gridHelper };
}

function createTorusGeometry(): THREE.Mesh {
    const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const material = new THREE.MeshStandardMaterial({
        color: 0xFF6347,
    });
    const torus = new THREE.Mesh(geometry, material);
    return torus;
}

function createPointLight(): THREE.PointLight {
    const pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.position.set(5, 5, 5);
    return pointLight;
}

function createAmbientLight(): THREE.AmbientLight {
    const ambientLight = new THREE.AmbientLight(0xFFFFFF);
    return ambientLight;
}

function createPointLightHelper(pointLight: THREE.PointLight): THREE.PointLightHelper {
    const pointLightHelper = new THREE.PointLightHelper(pointLight);
    return pointLightHelper;
}

function createGridHelper(): THREE.GridHelper {
    const gridHelper = new THREE.GridHelper(200, 50);
    return gridHelper;
}

function createStarGeometry(): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    const star = new THREE.Mesh(geometry, material);
    const [x, y, z] = Array(3).fill({}).map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
    return star;
}

function createSpaceTexture(scene: THREE.Scene): void {
    const spaceTexture = new THREE.TextureLoader().load(IMAGES_FOLDER + 'space.jpg');
    scene.background = spaceTexture;
}

function createMoonGeometry(): THREE.Mesh {
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

function moveCamera(camera: THREE.PerspectiveCamera, moon: THREE.Mesh) {
    const t = document.body.getBoundingClientRect().top;
    // update moon position
    moon.rotation.x += .05;
    moon.rotation.y += .075;
    moon.rotation.z += .05;
    // update camera position
    camera.position.z = t * -.01;
    camera.position.x = t * -.0002;
    camera.position.y = t * -.0002;
}