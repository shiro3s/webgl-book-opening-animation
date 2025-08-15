import { State } from "./type";

type Args = {} & State;

export const getEventHandler = ({
	pointer,
	raycaster,
	camera,
	renderer,
}: Args) => {
	const handleMouseMove = (e: MouseEvent) => {
		if (!pointer || !camera) return;

		pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
		pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
	};

	const handleClick = () => {
		if (!pointer || !camera || !raycaster) return;
		raycaster.setFromCamera(pointer, camera);
	};

	const handleResize = () => {
		if (!renderer || !camera) return;
		const { innerHeight, innerWidth } = window;

		camera.aspect = innerWidth / innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(innerWidth, innerHeight);
	};

	return {
		handleMouseMove,
		handleClick,
		handleResize,
	};
};
