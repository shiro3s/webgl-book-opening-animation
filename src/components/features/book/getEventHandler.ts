import { animateBook } from "./animateBook";
import { State } from "./type";

type Args = {} & State;

export const getEventHandler = ({
	pointer,
	raycaster,
	camera,
	scene,
}: Args) => {
	const handleMouseMove = (e: MouseEvent) => {
		if (!pointer || !raycaster || !camera) return;

		pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
		pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
		raycaster.setFromCamera(pointer, camera);
	};

	const handleClick = () => {
		// const book = scene.children.find((model) => {
		// 	return model.name === "book";
		// });

		// if (!book) return;

		// const intersect = raycaster.intersectObject(book);
		// if (intersect.length) animateBook({ book });
	};

	return {
		handleMouseMove,
		handleClick,
	};
};
