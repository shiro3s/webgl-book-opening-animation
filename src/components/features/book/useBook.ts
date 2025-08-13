import { useEffect, useRef } from "react";
import { createBook } from "./createBook";
import { getViewerLight } from "./getViewerLight";
import { getViewerState } from "./getViewerState";
import { renderAnimate } from "./renderAnimate";
import { setScene } from "./setScene";
import { State } from "./type";

export const useBook = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const stateRef = useRef<State>({
		camera: null,
		renderer: null,
		scene: null,
    controller: null
	});

	useEffect(() => {
		const el = canvasRef.current;
		if (el) {
			stateRef.current = getViewerState(el);
			const { directionalLight, ambientLight } = getViewerLight();
			const { book } = createBook();

			const models = [book, directionalLight, ambientLight];
			setScene({ ...stateRef.current, models });
			const { animate } = renderAnimate(stateRef.current);

			stateRef.current.renderer?.setAnimationLoop(animate);
		}
	}, []);

	return {
		canvasRef,
	};
};
