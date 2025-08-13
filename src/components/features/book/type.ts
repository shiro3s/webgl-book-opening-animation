import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export type State = {
	renderer: WebGLRenderer | null;
	camera: PerspectiveCamera | null;
	scene: Scene | null;
	controller: OrbitControls | null
};
