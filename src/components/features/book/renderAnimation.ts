import { animateBook } from "./animateBook";
import { State } from "./type";

export const renderAnimation = ({
	renderer,
	scene,
	camera,
	controller,
	raycaster,
	pointer,
}: State) => {
	const animate = () => {
		if (!renderer || !scene || !camera || !controller || !raycaster || !pointer)
			return;

		const book = scene.children.find((model) => {
			return model.name === "book";
		});

		if (book) {
			const intersect = raycaster.intersectObject(book);
			if (intersect.length) animateBook({ book });
		}

		controller.update();
		renderer.render(scene, camera);
	};

	return {
		animate,
	};
};
