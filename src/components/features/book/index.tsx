import React from "react";
import { useBook } from "./useBook";

export const Book: React.FC = () => {
	const { canvasRef } = useBook();

	return <canvas ref={canvasRef} />;
};
