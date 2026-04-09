import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  MeshBuilder,
  SceneLoader,
  AbstractMesh,
  GlowLayer,
  LightGizmo,
  GizmoManager,
  Light,
  Color3,
  PointLight,
  SpotLight,
} from "@babylonjs/core";
import "@babylonjs/loaders";

export class LightsShadows {
  scene: Scene;
  engine: Engine;
  lightTubes!: AbstractMesh[];
  models!: AbstractMesh[];
  ball!: AbstractMesh;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.engine.resize();
    this.scene = this.CreateScene();
    this.CreateEnvironment();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  CreateScene(): Scene {
    const scene = new Scene(this.engine);
    const camera = new FreeCamera("camera", new Vector3(0, 1, -4), this.scene);
    camera.attachControl();
    camera.speed = 0.2;

    return scene;
  }

  async CreateEnvironment(): Promise<void> {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "LightingScene.glb"
    );

    this.models = meshes;

    this.lightTubes = meshes.filter(
      (mesh) =>
        mesh.name === "lightTube_left" || mesh.name === "lightTube_right"
    );

    this.ball = MeshBuilder.CreateSphere("ball", { diameter: 0.5 }, this.scene);
    this.ball.position = new Vector3(0, 1, -1);

    const glowLayer = new GlowLayer("glowLayer", this.scene);
    glowLayer.intensity = 0.75;

    this.CreateLights();
  }

  CreateLights(): void {
    // const pointLight = new PointLight(
    //   "pointLight",
    //   new Vector3(0, 1, 0),
    //   this.scene
    // );

    // pointLight.diffuse = new Color3(172 / 255, 246 / 255, 250 / 255);
    // pointLight.intensity = 0.25;

    // const pointClone = pointLight.clone("pointClone") as PointLight;

    // pointLight.parent = this.lightTubes[0];
    // pointClone.parent = this.lightTubes[1];

    // this.CreateGizmos(pointLight);
    // this.CreateGizmos(pointClone);

    const spotLight = new SpotLight(
      "spotLight",
      new Vector3(0, 0.5, -3),
      new Vector3(0, 1, 3),
      Math.PI / 2,
      10,
      this.scene
    );

    spotLight.intensity = 10;

    this.CreateGizmos(spotLight);
  }

  CreateGizmos(customLight: Light): void {
    const lightGizmo = new LightGizmo();
    lightGizmo.scaleRatio = 2;
    lightGizmo.light = customLight;

    const gizmoManager = new GizmoManager(this.scene);
    gizmoManager.positionGizmoEnabled = true;
    gizmoManager.rotationGizmoEnabled = true;
    gizmoManager.usePointerToAttachGizmos = false;
    gizmoManager.attachToMesh(lightGizmo.attachedMesh);
  }
}
