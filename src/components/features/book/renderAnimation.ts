import { animateBook } from "./animateBook";
import { State } from "./type";

export const renderAnimation = ({
	renderer,
	scene,
	camera,
	controller,
	raycaster,
	pointer
}: State) => {
	let lastTime = 0;

	const animate = (time: number) => {
		if (!renderer || !scene || !camera || !controller || !raycaster || !pointer) return;

		
		const book = scene.children.find((model) => {
			return model.name === "book";
		});

		if (book) {
			const delta = (time - lastTime) / 1000;
			lastTime = time;

			const intersect = raycaster.intersectObject(book);
			if (intersect.length) animateBook({ delta, book });
		}

		controller.update();
		renderer.render(scene, camera);
	};

	return {
		animate,
	};
};
