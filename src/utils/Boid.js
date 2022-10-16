import * as THREE from "/modules/three.module.js";

class Boids {
  constructor() {
    this.mesh;
    this.pos = new THREE.Vector3(
      Math.random() * 25 - 12,
      Math.random() * 25 - 12,
      Math.random() * 25 - 12
    );
    this.velocity = new THREE.Vector3(
      0.01 * (2 * Math.random() - 1),
      0.01 * (2 * Math.random() - 1),
      0.01 * (2 * Math.random() - 1)
    );
    this.acceleration = new THREE.Vector3(0, 0, 0);
  }
  create() {
    // console.log("Creating!");

    return this._createSphere(this.pos.x, this.pos.y, this.pos.z);
  }

  // Mover applyForce
  _applyForce(force) {
    let a = force.clone();
    this.acceleration.add(a);
  }

  _updatePhysics() {
    this.velocity.add(this.acceleration.clone());
    this.pos.add(this.velocity.clone());
    this.acceleration.multiplyScalar(0);
  }

  _createSphere(posx, posy, posz) {
    let mat = new THREE.MeshPhongMaterial({
      wireframe: false,
      transparent: false,
      depthTest: true,
      side: THREE.DoubleSide,
      color: new THREE.Color(0, 0, 0),
    });
    let geo = new THREE.IcosahedronGeometry(1, 1);
    let mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.position.x = posx;
    mesh.position.y = posy;
    mesh.position.z = posz;
    this.mesh = mesh;

    return mesh;
  }
  _updateMesh() {
    this.mesh.position.x = this.pos.x;
    this.mesh.position.y = this.pos.y;
    this.mesh.position.z = this.pos.z;
  }

  _calculateAlignmentForce(listOfBoids) {
    let sumOfVelocities = new THREE.Vector3(0, 0, 0);
    for (let i = 0; i < listOfBoids.length; i++) {
      sumOfVelocities.add(listOfBoids[i].velocity.clone());
    }
    sumOfVelocities.normalize();
    let m = 1 - sumOfVelocities.dot(this.velocity.clone().normalize());
    //magnitude is 0 when aligned, 1 when orthogonal, 2 when opposite directions
    sumOfVelocities.multiplyScalar(m);
    return sumOfVelocities.multiplyScalar(10);
  }

  _calculateSeparationForce(listOfBoids) {
    let force = new THREE.Vector3(0, 0, 0);
    let epsilon = 0.00000001;
    for (let i = 0; i < listOfBoids.length; i++) {
      let dir = this.pos.clone().sub(listOfBoids[i].pos.clone()).normalize();
      let distance =
        this.pos.clone().distanceTo(listOfBoids[i].pos.clone()) + epsilon;
      force.add(dir.multiplyScalar(1 / distance));
    }
    return force.multiplyScalar(10);
  }

  _calculateCohesionForce(listOfBoids) {
    //Comment
    let force = new THREE.Vector3(0, 0, 0);
    for (let i = 0; i < listOfBoids.length; i++) {
      let dir = this.pos.clone().sub(listOfBoids[i].pos.clone()).normalize();
      let distance = this.pos.clone().distanceTo(listOfBoids[i].pos.clone());

      force.add(dir.multiplyScalar(-1 * distance));
    }
    return force.multiplyScalar(0.05);
  }

  _calculateCenterForce() {
    //Comment
    let force = new THREE.Vector3(0, 0, 0);
    let center = new THREE.Vector3(0, 0, 0);

    let dir = this.pos.clone().sub(center).normalize()
    force.add(dir)
    return force.multiplyScalar(-2);
  }

  _calculateWallRepulsionForce(obstacles) {
    let force = new THREE.Vector3(0, 0, 0);
    for (let i = 0; i < obstacles.length; i++) {
      let obj = obstacles[i]
      let dir = obj.userData.normal.clone()
      let distance = null

      if (dir.x != 0) {
        distance = Math.abs(this.pos.clone().x - obj.position.clone().x)

        if (distance < 5) {
          //Loss of energy
          this.velocity.multiplyScalar(.9)
        }

      }
      if (dir.y != 0) {
        distance = Math.abs(this.pos.clone().y - obj.position.clone().y)
        
        if (distance < 5) {
          //Loss of energy
          this.velocity.multiplyScalar(.9)
        }
      }
      if (dir.z != 0) {
        distance = Math.abs(this.pos.clone().z - obj.position.clone().z)
        
        if (distance < 5) {
          //Loss of energy
          this.velocity.multiplyScalar(.9)
        }
      }


      let strength = 1000 / (distance ** 2 + 1)

      let _force = dir.multiplyScalar(strength)
      force.add(_force)

    }
    return force

  }


  
}

export { Boids };