import {
  Scene,
  Engine,
  FreeCamera,
  ArcRotateCamera,
  Vector3,
  MeshBuilder,
  SceneLoader,
  AbstractMesh,
  GlowLayer,
  Color3,
  PointLight,
  UniversalCamera,
} from "@babylonjs/core";
import "@babylonjs/loaders";

export class PrevisScene {
  scene: Scene;
  engine: Engine;
  perspectiveCamera!: FreeCamera;
  orthoCamera!: UniversalCamera;
  activeView: "visualiser" | "floorplan" = "visualiser";
  lightTubes!: AbstractMesh[];
  models!: AbstractMesh[];
  ball!: AbstractMesh;
  pointLight1!: PointLight;
  pointLight2!: PointLight;

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

    // Perspective camera for 3D visualiser view
    this.perspectiveCamera = new FreeCamera(
      "perspectiveCamera",
      new Vector3(0, 1, -4),
      scene
    );
    this.perspectiveCamera.attachControl();
    this.perspectiveCamera.speed = 0.2;

    // Orthographic camera for floor plan view - looking straight down
    this.orthoCamera = new UniversalCamera(
      "orthoCamera",
      new Vector3(0, 20, 0),
      scene
    );
    this.orthoCamera.setTarget(new Vector3(0, 0, 0));
    this.orthoCamera.mode = 1;
    this.orthoCamera.orthoTop = 10;
    this.orthoCamera.orthoBottom = -10;
    this.orthoCamera.orthoLeft = -10;
    this.orthoCamera.orthoRight = 10;

    // Start in visualiser view
    scene.activeCamera = this.perspectiveCamera;

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
    this.pointLight1 = new PointLight(
      "pointLight1",
      new Vector3(-2, 1, 0),
      this.scene
    );
    this.pointLight1.diffuse = new Color3(172 / 255, 246 / 255, 250 / 255);
    this.pointLight1.intensity = 0.5;

    this.pointLight2 = new PointLight(
      "pointLight2",
      new Vector3(2, 1, 0),
      this.scene
    );
    this.pointLight2.diffuse = new Color3(172 / 255, 246 / 255, 250 / 255);
    this.pointLight2.intensity = 0.5;
  }

  switchToVisualiser(): void {
    this.scene.activeCamera = this.perspectiveCamera;
    this.perspectiveCamera.attachControl();
    this.activeView = "visualiser";
  }

  switchToFloorPlan(): void {
    this.perspectiveCamera.detachControl();
    this.scene.activeCamera = this.orthoCamera;
    this.activeView = "floorplan";
  }
}
