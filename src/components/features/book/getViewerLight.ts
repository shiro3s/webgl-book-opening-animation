import { AmbientLight, DirectionalLight } from "three";

export const getViewerLight = () => {
	const directionalLight = new DirectionalLight(0xffffff, 1);
	directionalLight.position.set(5, 5, 5);
  directionalLight.castShadow = true

  const ambientLight = new AmbientLight(0xffffff, 0.3);

	return { directionalLight, ambientLight };
};
