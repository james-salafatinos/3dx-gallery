import * as THREE from "/modules/three.module.js";
import { Boids } from "./Boid.js";
class BoidsGenerator {
    constructor(scene, obstacles) {
        this.scene = scene;
        this.numBoids = 30;
        this.boidsObjects = [];

        this.obstacles = obstacles

        this.totalForceScalar = .002
    }
    create() {
        //Comment
        console.log("Creating!");

        for (let i = 0; i < this.numBoids; i++) {
            // console.log("Created Boid with id:", i);
            let b = new Boids();
            this.scene.add(b.create());
            this.boidsObjects.push(b);
        }

        console.log("List of Boids", this.boidsObjects);


    }

    _calculateForces(boid, boidsObjects) {

        let alignment_force = boid._calculateAlignmentForce(
            boidsObjects
        );
        let separation_force = boid._calculateSeparationForce(
            boidsObjects
        );
        let cohesion_force = boid._calculateCohesionForce(
            boidsObjects
        );
        let center_force = boid._calculateCenterForce();
        let wall_force = boid._calculateWallRepulsionForce(this.obstacles);

        return { alignment_force, separation_force, cohesion_force, center_force, wall_force };

    }

    update(boidsObjects) {
        if (boidsObjects == null) {
            boidsObjects = this.boidsObjects;
        }

        for (let i = 0; i < boidsObjects.length; i++) {

            let { alignment_force, separation_force, cohesion_force, center_force, wall_force } = this._calculateForces(boidsObjects[i], boidsObjects)

            boidsObjects[i]._applyForce(alignment_force.multiplyScalar(this.totalForceScalar));
            boidsObjects[i]._applyForce(separation_force.multiplyScalar(this.totalForceScalar));
            boidsObjects[i]._applyForce(cohesion_force.multiplyScalar(this.totalForceScalar));

            boidsObjects[i]._applyForce(center_force.multiplyScalar(this.totalForceScalar));
            boidsObjects[i]._applyForce(wall_force.multiplyScalar(this.totalForceScalar));

            boidsObjects[i]._updatePhysics();
            boidsObjects[i]._updateMesh();
        }
    }
    updateByGroup(num) {

        let groups_of_boids = []
        for (let i = 0; i < this.boidsObjects; i++) {
            if (i % num == 0) {
                groups_of_boids.push(this.boidsObjects[i])

                this.update(boidsObjects);
            }

        }
    }

        _selectRandomBoid() {
            return this.boidsObjects[Math.floor(Math.random() * this.boidsObjects.length)];
        }
        _selectRandomSetOfBoids(num) {
            let boids = [];
            for (let i = 0; i < num; i++) {
                boids.push(this._selectRandomBoid());
            }
            return boids;
        }
    }

export { BoidsGenerator };