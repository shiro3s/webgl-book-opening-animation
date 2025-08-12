import { useRef } from "react";

export const useBook = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	return {
		canvasRef,
	};
};
