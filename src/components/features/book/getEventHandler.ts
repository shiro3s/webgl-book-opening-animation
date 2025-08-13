import { State } from "./type";

type Args = {} & State;

export const getEventHandler = ({
	pointer,
	raycaster,
	camera,
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

	return {
		handleMouseMove,
		handleClick,
	};
};
