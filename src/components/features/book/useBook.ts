import { useEffect, useRef } from "react";
import { createBook } from "./createBook";
import { getEventHandler } from "./getEventHandler";
import { getViewerLight } from "./getViewerLight";
import { getViewerState } from "./getViewerState";
import { renderAnimation } from "./renderAnimation";
import { setScene } from "./setScene";
import { State } from "./type";

export const useBook = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const stateRef = useRef<State>({
		camera: null,
		renderer: null,
		scene: null,
		controller: null,
		raycaster: null,
		pointer: null,
	});

	useEffect(() => {
		const el = canvasRef.current;
		if (el) {
			stateRef.current = getViewerState(el);
			const { directionalLight, ambientLight } = getViewerLight();

			createBook().then(({ book }) => {
				const models = [book, directionalLight, ambientLight];
				setScene({ ...stateRef.current, models });
			});

			const { handleMouseMove, handleClick, handleResize } = getEventHandler(
				stateRef.current,
			);

			const { animate } = renderAnimation(stateRef.current);

			stateRef.current.renderer?.setAnimationLoop(animate);

			window.addEventListener("mousemove", handleMouseMove);
			window.addEventListener("click", handleClick);
			window.addEventListener("resize", handleResize);

			return () => {
				window.removeEventListener("mousemove", handleMouseMove);
				window.removeEventListener("click", handleClick);
				window.removeEventListener("resize", handleResize);
			};
		}
	}, []);

	return {
		canvasRef,
	};
};
