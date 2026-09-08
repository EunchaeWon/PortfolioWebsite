import fs from 'node:fs';
import assert from 'node:assert/strict';
import { AnimationClip, AnimationMixer, Group, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

globalThis.ProgressEvent ??= class { constructor(type, values) { Object.assign(this, { type }, values); } };
const bytes = fs.readFileSync(new URL('../public/world/cat-paw-world.glb', import.meta.url));
const length = bytes.readUInt32LE(12);
const json = JSON.parse(bytes.subarray(20, 20 + length).toString());
const binary = bytes.subarray(28 + length);
json.buffers[0].uri = `data:application/octet-stream;base64,${binary.toString('base64')}`;
// Test actual skin geometry without decoding unrelated textures in Node.
delete json.images;
delete json.textures;
json.materials = json.materials.map(() => ({}));
const { scene, animations } = await new GLTFLoader().parseAsync(JSON.stringify(json), '');
function setup(copy) {
  const rig = copy.getObjectByName('Armature');
  const motion = new Group();
  rig.parent.add(motion);
  motion.add(rig);
  const mesh = copy.getObjectByName('Spiderwoman_low');
  const mixer = new AnimationMixer(copy);
  mixer.clipAction(animations.find(a => a.name.includes('Moving'))).play();
  return { copy, motion, mesh, mixer };
}
function vertices(state) {
  state.copy.updateMatrixWorld(true);
  state.mesh.skeleton.update();
  return Array.from({ length: 32 }, (_, index) => state.mesh.getVertexPosition(
    Math.floor(index * (state.mesh.geometry.attributes.position.count - 1) / 31), new Vector3(),
  ).applyMatrix4(state.mesh.matrixWorld));
}
function check(copy) {
  const state = setup(copy);
  const initial = vertices(state);
  state.mixer.update(0.5);
  const animated = vertices(state);
  const deformation = Math.max(...animated.map((v, i) => v.distanceTo(initial[i])));
  state.motion.position.set(10, 0, 0);
  const moved = vertices(state);
  const displacement = moved[0].clone().sub(animated[0]);
  return { deformation, displacement: displacement.toArray(), state };
}
const before = check(scene.clone(true));
const after = check(clone(scene));
assert(after.deformation > 0.00001, 'Animation must deform actual skin vertices');
assert(Math.abs(after.displacement[0] - 10) < 0.0001, 'Skin must follow locomotion by 10 units');
const boneSet = new Set();
after.state.copy.traverse(node => boneSet.add(node));
assert(after.state.mesh.skeleton.bones.every(bone => boneSet.has(bone)), 'All bones must belong to the rendered clone');
console.log(JSON.stringify({ before: { deformation: before.deformation, displacement: before.displacement }, after: { deformation: after.deformation, displacement: after.displacement }, passed: true }, null, 2));
const importedClips = JSON.parse(fs.readFileSync(new URL('../public/world/spider-clips.json', import.meta.url))).map(clip => AnimationClip.parse(clip));
for (const clip of importedClips) {
  const state = setup(clone(scene));
  state.mixer.stopAllAction();
  const action = state.mixer.clipAction(clip).play();
  state.mixer.update(0.05);
  const initial = vertices(state);
  state.mixer.update(0.5);
  const current = vertices(state);
  const deformation = Math.max(...current.map((v, i) => v.distanceTo(initial[i])));
  assert(deformation > 0.00001, `${clip.name} must deform the world spider`);
  state.mixer.update(clip.duration * 2);
  assert(action.isRunning(), `${clip.name} must loop`);
  console.log({ clip: clip.name, deformation, looping: action.isRunning() });
}
