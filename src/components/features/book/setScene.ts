import { AmbientLight, DirectionalLight, Group, Object3DEventMap } from "three";
import { State } from "./type";

type Model = AmbientLight | DirectionalLight | Group<Object3DEventMap>;
type Args = {
	models: Model[];
} & State;

export const setScene = (args: Args) => {
	args.scene?.clear()

	const models = new Set(args.models);
	for (const model of models) args.scene?.add(model);
};
