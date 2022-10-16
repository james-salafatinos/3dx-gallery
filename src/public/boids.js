//External Libraries
import * as THREE from "/modules/three.module.js";
import Stats from "/modules/stats.module.js";
import { OrbitControls } from '/modules/OrbitControls.js'


//Internal Generators
import { BoidsGenerator } from "/utils/BoidsGenerator.js";
let Boids
let obstacles = []

let g1
let g2

//THREE JS
let camera, scene, renderer
let controls
let stats
let frameIndex = 0
let time = performance.now()



init();
animate();

function init() {
  //##############################################################################
  //THREE JS BOILERPLATE
  //##############################################################################
  let createScene = function () {
    scene = new THREE.Scene();
    // var loader = new THREE.TextureLoader(),
    //   texture = loader.load("/static/nightsky2.jpg");
    // scene.background = texture;
    scene.background = new THREE.Color(0xffffff)
    scene.fog = new THREE.Fog(0x102234, 1000, 2000);
  };
  createScene();

  let createLights = function () {
    // LIGHTS
    const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);
  };
  createLights();

  let createStats = function () {
    stats = new Stats();
    container.appendChild(stats.dom);
  };
  createStats();

  let createRenderer = function () {
    //Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


  };
  createRenderer();

  let createCamera = function () {
    //Camera
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.y = 30;
    camera.position.z = 150;
    camera.position.x = 10;
    camera.layers.enable(1);
  };
  createCamera();

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;


  //##############################################################################
  //Create Static Objects
  //##############################################################################

  let createPlane = function (x, y, z, rotx, roty) {
    let mat = new THREE.MeshPhongMaterial({
      wireframe: false,
      transparent: true,
      depthWrite: true,
      depthTest: false,
      side: THREE.DoubleSide,
      color: new THREE.Color(0x000000),
      opacity: 0.5,
    });
    let geo = new THREE.PlaneBufferGeometry(100, 100);
    let mesh = new THREE.Mesh(geo, mat);
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;
    mesh.rotation.x = rotx
    mesh.rotation.y = roty
    return mesh

  };
  let p1_mesh = createPlane(-50, 0, 0, 0, Math.PI / 2, 0);
  p1_mesh.userData.normal = new THREE.Vector3(1, 0, 0) // On left, pushes right
  p1_mesh.material.color = new THREE.Color(0xfa2faf) //Magenta

  let p2_mesh = createPlane(0, -50, 0, Math.PI / 2, 0);
  p2_mesh.userData.normal = new THREE.Vector3(0, 1, 0) //On bottom, pushes up
  p2_mesh.material.color = new THREE.Color(0xf2af2f) //gold

  let p3_mesh = createPlane(0, 50, 0, Math.PI / 2, 0);
  p3_mesh.userData.normal = new THREE.Vector3(0, -1, 0) //On top, pushes down
  p3_mesh.material.color = new THREE.Color(0x2f2a2f) //black

  let p4_mesh = createPlane(50, 0, 0, 0, Math.PI / 2, 0);
  p4_mesh.userData.normal = new THREE.Vector3(-1, 0, 0) // On right, pushes left
  p4_mesh.material.color = new THREE.Color(0x00a115) //green


  let p5_mesh = createPlane(0, 0, -50, 0, 0, 0);
  p5_mesh.userData.normal = new THREE.Vector3(0, 0, 1) // On back, pushes toward camera
  p5_mesh.material.color = new THREE.Color(0xa8a632) //yellow


  let p6_mesh = createPlane(0, 0, 50, 0, 0, 0);
  p6_mesh.userData.normal = new THREE.Vector3(0, 0, -1) // On front, pushes back
  p6_mesh.material.color = new THREE.Color(0x4d13af) //purple

  obstacles.push(p1_mesh, p2_mesh, p3_mesh, p4_mesh, p5_mesh, p6_mesh)
  scene.add(p1_mesh, p2_mesh, p3_mesh, p4_mesh, p5_mesh, p6_mesh);






  let createStars = function () {
    let M = 28;
    let N = 28;
    let vertices = [];
    for (let x = -M; x <= M; x += 1) {
      for (let z = -N; z <= N; z += 1) {
        // vertices.push(x / scaler, 0 / scaler, z / scaler)
        vertices.push(
          THREE.MathUtils.randFloatSpread(2000),
          THREE.MathUtils.randFloatSpread(2000),
          THREE.MathUtils.randFloatSpread(2000)
        );
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    let material = new THREE.PointsMaterial({
      size: 0.7,
      sizeAttenuation: true,
      alphaTest: 0.2,
      transparent: true,
    });
    material.color.setHSL(0.6, 0.8, 0.9);
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
  };
  createStars();




  Boids = new BoidsGenerator(scene, obstacles);
  Boids.numBoids = 100
  console.log(obstacles)

  Boids.create();
  console.log(Boids);


  let l = Boids.boidsObjects.length
  g1 = Boids.boidsObjects.slice(0, Math.floor(l / 2))
  g2 = Boids.boidsObjects.slice(Math.floor(l / 2), l)
  console.log(l, g1,g2)

}



function animate() {
  //Frame Start up
  requestAnimationFrame(animate);

  //Controls
  controls.update();

  //Force Application
  if (frameIndex % 1 == 0) {


    Boids.update(g1)
    // Boids.update([Boids.boidsObjects[0], Boids.boidsObjects[1],  Boids.boidsObjects[2]] )
    // Boids.update([Boids.boidsObjects[3], Boids.boidsObjects[4]] )

    Boids.update(g2)
  }


  time = performance.now();
  renderer.render(scene, camera);
  stats.update();
  frameIndex += 1;

}
