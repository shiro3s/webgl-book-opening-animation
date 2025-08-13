import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// --- 定数 ---
const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71;
const PAGE_DEPTH = 0.003;
const PAGE_SEGMENTS = 30;
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;
const insideCurveStrength = 0.08;
const outsideCurveStrength = 0.03;
const turningCurveStrength = 0.05;

// --- 状態変数 ---
let targetPage = 0; // 最終的に行きたいページ
let delayedPage = 0; // 実際にめくられているページ（アニメーションで変化）
let pageTurnTimeout = null;

let currentRotation = 0;
const targetRotation = 0;

// --- シーンセットアップ ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

const camera = new THREE.PerspectiveCamera(
	45,
	window.innerWidth / window.innerHeight,
	0.1,
	100,
);
camera.position.set(3, 2, 4);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// --- ライト ---
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
light.castShadow = true;
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.3));

// --- 共通ジオメトリ ---
const pageGeometry = new THREE.BoxGeometry(
	PAGE_WIDTH,
	PAGE_HEIGHT,
	PAGE_DEPTH,
	PAGE_SEGMENTS,
	2,
);
pageGeometry.translate(PAGE_WIDTH / 2, 0, 0);

const position = pageGeometry.attributes.position;
const vertex = new THREE.Vector3();
const skinIndexes = [];
const skinWeights = [];

for (let i = 0; i < position.count; i++) {
	vertex.fromBufferAttribute(position, i);
	const x = vertex.x;
	const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH));
	const skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH;
	skinIndexes.push(skinIndex, skinIndex + 1, 0, 0);
	skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
}

pageGeometry.setAttribute(
	"skinIndex",
	new THREE.Uint16BufferAttribute(skinIndexes, 4),
);
pageGeometry.setAttribute(
	"skinWeight",
	new THREE.Float32BufferAttribute(skinWeights, 4),
);

// --- テクスチャ読み込み ---
const loader = new THREE.TextureLoader();
function loadTexture(path) {
	const tex = loader.load(path);
	tex.colorSpace = THREE.SRGBColorSpace;
	return tex;
}

// ページデータ（サンプル）
const pages = Array.from({length: 30});

// --- ページ作成 ---
function createPage(number, totalPages) {
	const picture = loadTexture(`./front-cover.png`);
	const picture2 = loadTexture(`./back-cover.png`);

	const whiteColor = new THREE.Color("white");
	const emissiveColor = new THREE.Color("orange");

	const bones = [];
	for (let i = 0; i <= PAGE_SEGMENTS; i++) {
		const bone = new THREE.Bone();
		bone.position.x = i === 0 ? 0 : SEGMENT_WIDTH;
		if (i > 0) bones[i - 1].add(bone);
		bones.push(bone);
	}
	const skeleton = new THREE.Skeleton(bones);

	const materials = [
		new THREE.MeshStandardMaterial({ color: whiteColor }),
		new THREE.MeshStandardMaterial({ color: "#111" }),
		new THREE.MeshStandardMaterial({ color: whiteColor }),
		new THREE.MeshStandardMaterial({ color: whiteColor }),
		new THREE.MeshStandardMaterial({
			color: whiteColor,
			map: picture,
			roughness: 0.1,
			emissive: emissiveColor,
			emissiveIntensity: 0,
		}),
		new THREE.MeshStandardMaterial({
			color: whiteColor,
			map: picture2,
			roughness: 0.1,
			emissive: emissiveColor,
			emissiveIntensity: 0,
		}),
	];

	const mesh = new THREE.SkinnedMesh(pageGeometry, materials);
	mesh.add(skeleton.bones[0]);
	mesh.bind(skeleton);
	mesh.castShadow = true;
	mesh.receiveShadow = true;

	mesh.userData = {
		number,
		opened: false,
		bones,
		emissiveTargets: [4, 5],
	};

	return mesh;
}

// --- 本を作成 ---
const bookGroup = new THREE.Group();
pages.forEach((_, i) => {
	const page = createPage(i, pages.length);
	page.position.z = -i * PAGE_DEPTH;
	bookGroup.add(page);
});
bookGroup.rotation.y = -Math.PI / 2;
scene.add(bookGroup);

// --- インタラクション ---
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let hoveredPage = null;

function onPointerMove(event) {
	pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onClick() {
	if (hoveredPage) {
		const num = hoveredPage.userData.number;
		targetPage = hoveredPage.userData.opened ? num : num + 1;
		startPageTurning();
	}
}

// ページ送りアニメーション開始
function startPageTurning() {
	clearTimeout(pageTurnTimeout);

	function step() {
		if (delayedPage === targetPage) return;
		delayedPage += targetPage > delayedPage ? 1 : -1;

		// ページ差が大きい場合は高速、少ない場合は遅め
		const delay = Math.abs(targetPage - delayedPage) > 2 ? 50 : 150;
		pageTurnTimeout = setTimeout(step, delay);
	}
	step();
}

window.addEventListener("pointermove", onPointerMove);
window.addEventListener("click", onClick);

// --- アニメーションループ ---
function animate() {
	requestAnimationFrame(animate);

	// レイキャストでページ判定
	raycaster.setFromCamera(pointer, camera);
	const intersects = raycaster.intersectObjects(bookGroup.children);
	hoveredPage = intersects.length > 0 ? intersects[0].object : null;

	// ページアニメーション
	bookGroup.children.forEach((page) => {
		const bones = page.userData.bones;
		const opened = delayedPage > page.userData.number;
		page.userData.opened = opened;

		const targetRotation = opened ? -Math.PI : Math.PI;

		currentRotation = THREE.MathUtils.lerp(
			0,
			targetRotation,
			2,
		);

		bones.forEach((bone, i) => {
			const insideCurveIntensity = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0;
			const outsideCurveIntensity = i >= 8 ? Math.cos(i * 0.3 + 0.09) : 0;
			const turningIntensity = Math.sin(i * Math.PI * bones.length);

			let rotationAngle =
				insideCurveStrength * insideCurveIntensity * currentRotation -
				outsideCurveStrength * outsideCurveIntensity * currentRotation +
				turningCurveStrength * turningIntensity * currentRotation;

			// 端に近い骨ほど回転を弱くする（丸まり防止）
			const edgeFactor = 1 - Math.abs(i / bones.length - 0.5) * 1.5; // 中央1.0 → 端0.25
			rotationAngle *= edgeFactor;

			bone.rotation.y = THREE.MathUtils.lerp(
				bone.rotation.y,
				rotationAngle,
				0.1,
			);
		});

		// ハイライト効果
		const emissiveIntensity = page === hoveredPage ? 0.22 : 0;
		page.userData.emissiveTargets.forEach((idx) => {
			page.material[idx].emissiveIntensity = THREE.MathUtils.lerp(
				page.material[idx].emissiveIntensity,
				emissiveIntensity,
				0.1,
			);
		});
	});

	controls.update();
	renderer.render(scene, camera);
}
animate();

// --- リサイズ対応 ---
window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});
