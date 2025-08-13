import { Group, MathUtils, Object3D, Object3DEventMap } from "three";
import { sleep } from "@/utils/sleep";

type Args = {
	book?: Group<Object3DEventMap> | Object3D<Object3DEventMap>;
};

const insideCurveStrength = 0.18;
const outsideCurveStrength = 0.05;
const turningCurveStrength = 0.09;

export const animateBook = ({ book }: Args) => {
	if (!book) return;

	const pages = book.children;
	const halfPageSize = pages.length / 2;

	for (let i = 0; i < halfPageSize; i += 1) {
		const page = pages[i];
		const bones = page.userData.bones;

		sleep(1000).then(() => {
			page.userData.opened = true;
      

			const targetRotation = -Math.PI / 2;
			for (let j = 0; j < bones.length; j += 1) {
				const bone = bones[j];
				const insideCurveIntensity =
					i < halfPageSize ? Math.sin(i * 0.2 + 0.25) : 0;
				const outsideCurveIntensity =
					i >= halfPageSize ? Math.cos(i * 0.3 + 0.09) : 0;
				const turningIntensity = Math.sin((i * Math.PI) / bones.length);

				const rotationAngle =
					insideCurveStrength * insideCurveIntensity * targetRotation -
					outsideCurveStrength * outsideCurveIntensity * targetRotation +
					turningCurveStrength * turningIntensity * targetRotation;

				bone.rotation.y = MathUtils.lerp(bone.rotation.y, rotationAngle, 0.1);
			}
		});
	}
};
