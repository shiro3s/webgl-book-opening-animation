import { AmbientLight, DirectionalLight, Group, Object3DEventMap } from "three";
import { State } from "./type";

type Model = AmbientLight | DirectionalLight | Group<Object3DEventMap>;
type Args = {
	models: Model[];
} & State;

export const setScene = (args: Args) => {
	for (let i = 0; i < args.models.length; i += 1) {
		const model = args.models[i];
		args.scene?.add(model);
	}
};
