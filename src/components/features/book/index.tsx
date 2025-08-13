import React from "react";
import styles from "./style.module.css";
import { useBook } from "./useBook";

export const Book: React.FC = () => {
	const { canvasRef } = useBook();

	return (
    <canvas ref={canvasRef} className={styles.canvas} />
  );
};
