import fs from 'node:fs';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AnimationClip } from 'three';

globalThis.ProgressEvent ??= class { constructor(type, values) { Object.assign(this, { type }, values); } };
const bytes = fs.readFileSync(new URL('../public/world/spider-monster.glb', import.meta.url));
const length = bytes.readUInt32LE(12);
const json = JSON.parse(bytes.subarray(20, 20 + length).toString());
json.buffers[0].uri = `data:application/octet-stream;base64,${bytes.subarray(28 + length).toString('base64')}`;
delete json.images;
delete json.textures;
json.materials = json.materials.map(() => ({}));
const { animations } = await new GLTFLoader().parseAsync(JSON.stringify(json), '');
const clips = animations.filter(clip => ['Walk', 'Twitching'].includes(clip.name));
if (clips.length !== 2) throw new Error('Both spider clips are required');
fs.writeFileSync(new URL('../public/world/spider-clips.json', import.meta.url), JSON.stringify(clips.map(clip => AnimationClip.toJSON(clip))));
console.log(clips.map(clip => ({ name: clip.name, duration: clip.duration, tracks: clip.tracks.length })));
