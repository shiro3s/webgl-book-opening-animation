import { Group, MathUtils, Object3D, Object3DEventMap } from "three";
import { sleep } from "@/utils/sleep";

import {
	insideCurveStrength,
	outsideCurveStrength,
	pageSegments,
	scale,
	turningCurveStrength,
} from "./constants";

type Args = {
	delta: number
	book?: Group<Object3DEventMap> | Object3D<Object3DEventMap>;
};

export const animateBook = ({ delta, book }: Args) => {
	if (!book) return;

	const pages = book.children;
	const halfPageSize = pages.length / 2;

	for (let i = 0; i < pages.length; i += 1) {
		const sleepTime = i < halfPageSize ? 100 * i : 0;

		sleep(sleepTime).then(() => {
			const page = pages[i];
			const bones = page.userData.bones;

			if (i < halfPageSize) page.userData.opened = true;
			
			let turningTime = Math.min(400, delta) / 400
			turningTime = Math.sin(2 * Math.PI)

			const targetRotation = page.userData.opened ? -Math.PI / 2 : Math.PI / 2;

			for (let j = 0; j < bones.length; j += 1) {
				const bone = bones[j];

				// ページの内側
				const insideCurveIntensity = j < 8 ? Math.sin(j * 0.2 + 0.25) : 0;

				// ページの外側
				const outsideCurveIntensity = j >= 8 ? Math.cos(j * 0.3 + 0.09) : 0;

				// ページ全体
				const turningIntensity =
					Math.sin(j * Math.PI * (1 / bones.length)) * turningTime;

				const rotationAngle =
					insideCurveStrength * insideCurveIntensity * targetRotation -
					outsideCurveStrength * outsideCurveIntensity * targetRotation +
					turningCurveStrength * turningIntensity * targetRotation;

				// // 端に近い骨ほど回転を弱くする（丸まり防止）
				// const edgeFactor = 1 - Math.abs(j / bones.length - 0.5) * 1.5; // 中央1.0 → 端0.25
				// rotationAngle *= edgeFactor;

				// if (i < halfPageSize)
					bone.rotation.y = MathUtils.lerp(bone.rotation.y, rotationAngle, 0.1);
			}
		});
	}
	
	book.rotation.y = MathUtils.lerp(book.rotation.y, -3.1, 0.1);
};
