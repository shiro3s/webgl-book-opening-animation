import {
	Bone,
	BoxGeometry,
	Float32BufferAttribute,
	Group,
	MeshStandardMaterial,
	Skeleton,
	SkinnedMesh,
	SRGBColorSpace,
	TextureLoader,
	Uint16BufferAttribute,
	Vector3,
} from "three";

const pageWidth = 1.28;
const pageHeight = 1.71;
const pageDepth = 0.003;
const pageSegments = 30;

const segmentWidth = pageWidth / pageSegments;

const getPageGeometry = () => {
	const pageGeometry = new BoxGeometry(
		pageWidth,
		pageHeight,
		pageDepth,
		pageSegments,
		2,
	);
	pageGeometry.translate(pageWidth / 2, 0, 0);

	const position = pageGeometry.attributes.position;
	const vertex = new Vector3();

	const skinIndexes: number[] = [];
	const skinWeights: number[] = [];

	for (let i = 0; i < position.count; i += 1) {
		vertex.fromBufferAttribute(position, i);

		const x = vertex.x;
		const skinIndex = Math.max(0, Math.floor(x / segmentWidth));
		const skinWeight = (x % segmentWidth) / segmentWidth;

		skinIndexes.push(skinIndex, skinIndex + 1, 0, 0);
		skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
	}

	pageGeometry.setAttribute(
		"skinIndex",
		new Uint16BufferAttribute(skinIndexes, 4),
	);
	pageGeometry.setAttribute(
		"skinWeight",
		new Float32BufferAttribute(skinWeights, 4),
	);

	return {
		pageGeometry,
	};
};

const createPage = (index: number, materials: MeshStandardMaterial[]) => {
	const bones: Bone[] = [];

	for (let i = 0; i <= pageSegments; i += 1) {
		const bone = new Bone();
		bone.position.x = i === 0 ? 0 : segmentWidth;
		if (i > 0) bones[i - 1].add(bone);
		bones.push(bone);
	}

	const skelton = new Skeleton(bones);

	const pageMaterials = [
		new MeshStandardMaterial({ color: "#fff" }),
		new MeshStandardMaterial({ color: "#111" }),
		new MeshStandardMaterial({ color: "#fff" }),
		new MeshStandardMaterial({ color: "#fff" }),
		...materials
	];

	const { pageGeometry } = getPageGeometry();

	const mesh = new SkinnedMesh(pageGeometry, pageMaterials);
	mesh.castShadow = true;
	mesh.receiveShadow = true;

	mesh.add(skelton.bones[0]);
	mesh.bind(skelton);

	mesh.userData = {
		index,
		opened: false,
		bones,
		emissiveTargets: [4, 5],
	};

	return mesh;
};

export const createBook = async () => {
  const book = new Group();
  const pages = Array.from({length: 30})

	const textureLoader = new TextureLoader()
	const frontTexture = await textureLoader.loadAsync("./front-cover.png");
	const backTexture = await textureLoader.loadAsync("./back-cover.png");

	frontTexture.colorSpace = SRGBColorSpace
	backTexture.colorSpace = SRGBColorSpace

	const coverMaterial = [
		new MeshStandardMaterial({
			color: "#fff",
			map: frontTexture,
			roughness: 0.1,
			emissive: "#FFA500",
			emissiveIntensity: 0
		}),
		new MeshStandardMaterial({
			color: "#fff",
			map: backTexture,
			roughness: 0.1,
			emissive: "#FFA500",
			emissiveIntensity: 0
		}),
	]

  for (let i = 0; i < pages.length; i+=1) {
    const page = createPage(i, coverMaterial);
    page.position.z = -i * pageDepth;
    book.add(page)
  }
  book.rotation.y = -Math.PI / 2;
	book.name = "book";
  
  return {
    book
  }
}
