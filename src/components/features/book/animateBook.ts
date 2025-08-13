import { Group, MathUtils, Object3D, Object3DEventMap } from "three";
import { sleep } from "@/utils/sleep";

type Args = {
	book?: Group<Object3DEventMap> | Object3D<Object3DEventMap>;
};

const insideCurveStrength = 0.08;
const outsideCurveStrength = 0.03;
const turningCurveStrength = 0.05;

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

			const targetRotation = page.userData.opened ? -Math.PI : Math.PI;
			const currentRotation = MathUtils.lerp(0, targetRotation, 2);

			for (let j = 0; j < bones.length; j += 1) {
				const bone = bones[j];

				const insideCurveIntensity = j < 8 ? Math.sin(j * 0.2 + 0.25) : 0;
				const outsideCurveIntensity = j >= 8 ? Math.cos(j * 0.3 + 0.09) : 0;
				const turningIntensity = Math.sin(j * Math.PI * bones.length);

				let rotationAngle =
					insideCurveStrength * insideCurveIntensity * currentRotation -
					outsideCurveStrength * outsideCurveIntensity * currentRotation +
					turningCurveStrength * turningIntensity * currentRotation;

				// 端に近い骨ほど回転を弱くする（丸まり防止）
				const edgeFactor = 1 - Math.abs(j / bones.length - 0.5) * 1.5; // 中央1.0 → 端0.25
				rotationAngle *= edgeFactor;

				// if (i < halfPageSize)
				bone.rotation.y = MathUtils.lerp(bone.rotation.y, rotationAngle, 0.1);
			}
		});
	}
};
