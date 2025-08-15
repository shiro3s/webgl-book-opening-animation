import { Group, MathUtils, Object3D, Object3DEventMap } from "three";
import { sleep } from "@/utils/sleep";

import {
	insideCurveStrength,
	outsideCurveStrength,
	turningCurveStrength,
} from "./constants";

type Args = {
	book?: Group<Object3DEventMap> | Object3D<Object3DEventMap>;
};

export const animateBook = ({ book }: Args) => {
	if (!book) return;

	const pages = book.children;
	const halfPageSize = pages.length / 2;

	for (let i = 0; i < pages.length; i += 1) {
		const sleepTime = i < halfPageSize ? 100 * i : 0;

		sleep(sleepTime).then(() => {
			const page = pages[i];
			const bones = page.userData.bones;

			if (i < halfPageSize) page.userData.opened = true;

			const targetRotation = page.userData.opened ? -Math.PI / 2 : Math.PI / 2;

			for (let j = 0; j < bones.length; j += 1) {
				const bone = bones[j];

				// ページの内側
				const insideCurveIntensity = j < 8 ? Math.sin(j * 0.2 + 0.25) : 0;

				// ページの外側
				const outsideCurveIntensity = j >= 8 ? Math.cos(j * 0.3 + 0.09) : 0;

				// ページ全体
				const turningIntensity =
					Math.sin(j * Math.PI * bones.length);

				const rotationAngle =
					insideCurveStrength * insideCurveIntensity * targetRotation -
					outsideCurveStrength * outsideCurveIntensity * targetRotation +
					turningCurveStrength * turningIntensity * targetRotation;

				bone.rotation.y = MathUtils.lerp(bone.rotation.y, rotationAngle, 0.1);
			}
		});
	}

	book.rotation.y = MathUtils.lerp(book.rotation.y, -Math.PI, 0.1)
};
