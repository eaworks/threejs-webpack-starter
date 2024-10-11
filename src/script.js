import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

const loader = new GLTFLoader()

gsap.registerPlugin(ScrollTrigger);

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

let jewel = null

// Objects
// const geometry = new THREE.TorusGeometry(.7, .2, 16, 100);
loader.load('/bullseye.gltf', function (gltf) {
    jewel = gltf.scene
    scene.add(gltf.scene)

    jewel.rotation.y = 1
    jewel.scale.set(0.5, 0.5, 0.5)

    const jewelFolder = gui.addFolder('Jewel')
    jewelFolder.add(jewel.position, 'x').min(-7).max(7).step(0.01).name('Position X')
    jewelFolder.add(jewel.position, 'y').min(-7).max(7).step(0.01).name('Position Y')
    jewelFolder.add(jewel.position, 'z').min(-7).max(7).step(0.01).name('Position Z')

    jewelFolder.add(jewel.rotation, 'x').min(-7).max(7).step(0.01).name('Rotation X')
    jewelFolder.add(jewel.rotation, 'y').min(-7).max(7).step(0.01).name('Rotation Y')
    jewelFolder.add(jewel.rotation, 'z').min(-7).max(7).step(0.01).name('Rotation Z')

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger:'section.animate',
            start: 'top bottom',
            end: 'bottom center',
            markers: true,
            scrub: true
        }
    })

    tl.to(jewel.position, {
        x: 1.72
    })
    tl.to(jewel.rotation, {
        y: -1.33
    }, "<")
    tl.to(jewel.scale, {
        x: 1,
        y: 1,
        z: 1,
    }, "<")
})

// Materials

// const material = new THREE.MeshBasicMaterial()
// material.color = new THREE.Color(0xff0000)

// Mesh
// const sphere = new THREE.Mesh(geometry, material)
// scene.add(sphere)

// Lights

const ambienLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambienLight)

const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)


// Dat.GUI

// const ringFolder = gui.addFolder('Ring')
// ringFolder.add(sphere.position, 'x').min(-3).max(3).step(0.01)
// ringFolder.add(sphere.position, 'y').min(-3).max(3).step(0.01)
// ringFolder.add(sphere.position, 'z').min(-3).max(3).step(0.01)

// let canvasEl = document.querySelector('canvas')
// let isZPositive = false
// const colorObject = { color: '#ffcc00' }

// canvasEl.addEventListener('click', () => {
//     const targetZ = isZPositive ? -3 : 1.78;
//     const changeColor = isZPositive ? '#ffcc00' : 'red';
//     gsap.to(sphere.position, { z: targetZ, duration: 2, ease: 'power3.inOut' })
//     gsap.to(colorObject, {
//         color: changeColor,
//         duration: 2,
//         ease: 'power3.inOut',
//         onUpdate: () => {
// sphere.material.color.set(colorObject.color)
//         }
//     })
//     isZPositive = !isZPositive
// })

/**
 * Sizes
 */

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

let baseY = 0; // Base y-position of the model
let amplitude = 0.1; // Amplitude of the bobbing, adjust as needed
let frequency = 2; // Frequency of the bobbing, adjust as needed

const clock = new THREE.Clock()

const tick = () => {

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // sphere.rotation.y = .5 * elapsedTime
    if(jewel){
        let time = performance.now() * 0.001; // Current time in seconds
        jewel.position.y = baseY + Math.sin(time * frequency) * amplitude;
    }

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

const lenis = new Lenis()
lenis.on('scroll', (e) => {
    console.log(e)
})
function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
requestAnimationFrame(raf)