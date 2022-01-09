import "./style.css"
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

const gridCheckbox = document.querySelector("#grid");
const backgroundCheckbox = document.querySelector("#background");
const realisticCheckbox = document.querySelector("#realistic");
const speedRange = document.querySelector("#speed");
const dayCounter = document.querySelector(".day-counter");
let day = 0;

let isRealistic = JSON.parse(window.localStorage.getItem("isRealistic")) || false;
if (isRealistic){
  realisticCheckbox.checked = true;
}

// Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.setZ(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);

// Grid Helper
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);
gridHelper.visible = false;

gridCheckbox.addEventListener("click", () => {
  gridHelper.visible = !gridHelper.visible;
});

// Background
const background = new THREE.TextureLoader().load("background.jpg");
console.log(scene.background === null)
backgroundCheckbox.addEventListener("click", () => {
  if (scene.background === null){
    scene.background = background;
  } else {
    scene.background = null
  }
});

realisticCheckbox.addEventListener("click", () => {
  isRealistic = !isRealistic;
  if (isRealistic){
    window.localStorage.setItem("isRealistic", JSON.stringify(true));
  } else {
    window.localStorage.setItem("isRealistic", JSON.stringify(false));
  }
  location.reload();
});

// Stars
// function addStar() {
//   const geometry = new THREE.SphereGeometry(0.25, 24, 24);
//   const material = new THREE.MeshStandardMaterial({ color: 0xffffff, name: "star" });
//   const star = new THREE.Mesh(geometry, material);

//   const [x, y, z] = Array(3)
//     .fill()
//     .map(() => THREE.MathUtils.randFloatSpread(400));

//   star.position.set(x, y, z);
//   scene.add(star);
// }

// Array(200).fill().forEach(addStar);

const planets = [
  {
    "name": "sun", // i know sun is not a planet
    "sizeRealistic": 696340,
    "size": 10,
    "positionRealistic": 0,
    "position": 0,
  },
  {
    "name": "mercury",
    "sizeRealistic": 2439,
    "size": 0.3,
    "positionRealistic": 0.39,
    "position": 20,
    "orbit": 0,
    // spinnig speed
    "aroundSun": 47.87,
    "aroundSelf": 10.83
  },
  {
    "name": "venus",
    "sizeRealistic": 6051,
    "size": 0.5,
    "positionRealistic": 0.72,
    "position": 25,
    "orbit": 0,
    "aroundSun": 35.02,
    "aroundSelf": 6.52
  },
  {
    "name": "earth",
    "sizeRealistic": 6371,
    "size": 0.7,
    "positionRealistic": 1,
    "position": 30,
    "orbit": 0,
    "aroundSun": 29.78,
    "aroundSelf": 1574
  },
  {
    "name": "mars",
    "sizeRealistic": 3389,
    "size": 0.9,
    "positionRealistic": 1.52,
    "position": 40,
    "orbit": 0,
    "aroundSun": 24.077,
    "aroundSelf": 866
  },
  {
    "name": "jupiter",
    "sizeRealistic": 69911,
    "size": 1.1,
    "positionRealistic": 5.2,
    "position": 50,
    "orbit": 0,
    "aroundSun": 13.07,
    "aroundSelf": 45583
  },
  {
    "name": "saturn",
    "sizeRealistic": 58232,
    "size": 1.3,
    "positionRealistic": 9.54,
    "position": 60,
    "orbit": 0,
    "aroundSun": 9.69,
    "aroundSelf": 36840
  },
  {
    "name": "uranus",
    "sizeRealistic": 25362,
    "size": 1.5,
    "positionRealistic": 33.5,
    "position": 70,
    "orbit": 0,
    "aroundSun": 6.80,
    "aroundSelf":  9320
  },
  {
    "name": "neptune",
    "sizeRealistic": 24622,
    "size": 1.7,
    "positionRealistic": 30.06,
    "position": 80,
    "orbit": 0,
    "aroundSun": 5.43,
    "aroundSelf": 9719
  }
];

let speed = 1;

speedRange.addEventListener("change", () => {
  speed = speedRange.value;
});

planets.forEach(planet => {
  const texture = new THREE.TextureLoader().load(`./planets/${planet.name}.jpg`);
  let planet3D;
  if (isRealistic){
    planet3D = new THREE.Mesh(
      new THREE.SphereGeometry(planet.sizeRealistic * 0.00001, 32, 32),
      new THREE.MeshStandardMaterial({ map: texture }));
      scene.add(planet3D);
      planet3D.position.x = planet.positionRealistic * 30;
      function animate() {
        requestAnimationFrame(animate);
        if (planet.name !== "sun") {
          planet.orbit += planet.aroundSun * 0.005 * speed;
          const radians = planet.orbit * Math.PI / 180;
          planet3D.position.x = Math.cos(radians) * planet.positionRealistic * 30;
          planet3D.position.z = Math.sin(radians) * planet.positionRealistic * 30;
          planet3D.rotation.y += planet.aroundSelf * 0.005 * speed;
          if (planet.name === "earth"){
            const days = (planet.aroundSelf * Math.PI) / 90 * speed;
            day += days / 365;
            dayCounter.innerText = Math.round(day);
          }
        }
        renderer.render(scene, camera);
      }
      animate();
  } else {
    planet3D = new THREE.Mesh(
      new THREE.SphereGeometry(planet.size, 32, 32),
      new THREE.MeshStandardMaterial({ map: texture }));
      scene.add(planet3D);
      planet3D.position.x = planet.position;
      function animate() {
        requestAnimationFrame(animate);
        if (planet.name !== "sun") {
          planet.orbit += planet.aroundSun * 0.005 * speed;
          const radians = planet.orbit * Math.PI / 180;
          planet3D.position.x = Math.cos(radians) * planet.position;
          planet3D.position.z = Math.sin(radians) * planet.position;
          planet3D.rotation.y += planet.aroundSelf * 0.005 * speed;
          if (planet.name === "earth"){
            const days = (planet.aroundSelf * Math.PI) / 90 * speed;
            day += days / 365;
            dayCounter.innerText = Math.round(day);
          }
        }
        renderer.render(scene, camera);
      }
      animate();
      console.log("a")
  }
});

console.log(scene)