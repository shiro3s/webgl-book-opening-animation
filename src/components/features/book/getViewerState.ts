import { PerspectiveCamera, Raycaster, Scene, Vector2, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export const getViewerState = (el: HTMLCanvasElement) => {
	const { clientWidth, clientHeight } = el;
	const aspect = clientWidth / clientHeight;

	// camera
	const camera = new PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.set(-2, 0, 0)

	// renderer
	const renderer = new WebGLRenderer({ antialias: true, canvas: el });
	renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;

  // scene
	const scene = new Scene()

  // controller
  const controller = new OrbitControls(camera, renderer.domElement)

  // raycaster
  const raycaster = new Raycaster();

  // pointer
  const pointer = new Vector2()

	return {
		camera,
		renderer,
		scene,
    controller,
    raycaster,
    pointer
	};
};
