"use client";

import { Html, OrbitControls, useAnimations, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Box3, Group, LoopRepeat, Mesh, MeshStandardMaterial, Object3D, Raycaster, Vector3 } from "three";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import { AnimationClip, AnimationMixer, FileLoader } from "three";

const WORLD_MODEL_URL = "/world/cat-paw-world-web-production.glb?v=20260908-web-production";
const DRACO_DECODER_PATH = "/draco/";
const SPIDER_MODEL_URL = "/world/spider-monster.glb?v=20260907-reimport-v4";
const FACES_WALL_MODEL_URL = "/world/faces-wall.glb?v=20260906";
const WORLD_SCALE = 0.012;
// The standalone import recipe uses its true exported size rather than a
// corrective runtime scale.
const SPIDER_PAW_SCALE = 1;
const SPIDER_PAW_ROUTE = [
  new Vector3(0, 0, -8),
  new Vector3(2.5, 0, -12),
  new Vector3(-2.5, 0, -16),
  new Vector3(0, 0, -21.98),
];

type SpiderMode = "walk" | "twitch";

// Retained only as an import recipe for a later deliberate re-add; it is not
// mounted or preloaded in Cat Paw World.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SpiderMonster({
  pawColliders = [],
  mode = "walk",
  position,
  scale = SPIDER_PAW_SCALE,
}: {
  pawColliders?: Object3D[];
  mode?: SpiderMode;
  position?: [number, number, number];
  scale?: number;
}) {
  const { scene, animations } = useGLTF(SPIDER_MODEL_URL);
  const model = useMemo(() => scene.clone(true), [scene]);
  const root = useRef<Group>(null);
  const { actions } = useAnimations(animations, root);
  const routePosition = useMemo(() => new Vector3(), []);
  const routeTangent = useMemo(() => new Vector3(), []);
  const currentMotion = useRef<SpiderMode | null>(null);
  const routeStartTime = useRef<number | null>(null);
  const pawRoute = useRef<Vector3[] | null>(null);
  const floorRaycaster = useMemo(() => new Raycaster(), []);
  const rayOrigin = useMemo(() => new Vector3(), []);
  const downDirection = useMemo(() => new Vector3(0, -1, 0), []);

  useEffect(() => {
    const activeAction = mode === "twitch" ? actions.Twitching : actions.Walk;
    if (!activeAction) return;

    Object.values(actions).forEach((action) => {
      if (!action || action === activeAction) return;
      action.fadeOut(0.28);
    });
    activeAction.reset().setLoop(LoopRepeat, Infinity).setEffectiveTimeScale(0.5).fadeIn(0.28).play();

    return () => {
      activeAction.fadeOut(0.2);
    };
  }, [actions, mode]);

  useFrame(({ clock }) => {
    if (mode !== "walk") return;

    if (!root.current) return;

    pawColliders.forEach((collider) => collider.updateWorldMatrix(true, false));
    if (pawRoute.current === null && pawColliders.length > 0) {
      const discovered: Vector3[] = [];

      pawColliders.forEach((collider) => {
        const bounds = new Box3().setFromObject(collider);
        const widths = [0.25, 0.5, 0.75];
        let landingPoint: Vector3 | undefined;

        for (const xRatio of widths) {
          for (const zRatio of widths) {
            rayOrigin.set(
              bounds.min.x + (bounds.max.x - bounds.min.x) * xRatio,
              bounds.max.y + 4,
              bounds.min.z + (bounds.max.z - bounds.min.z) * zRatio,
            );
            floorRaycaster.set(rayOrigin, downDirection);
            const hit = floorRaycaster.intersectObject(collider, true)[0];
            if (hit) {
              landingPoint = hit.point.clone();
              break;
            }
          }
          if (landingPoint) break;
        }

        if (!landingPoint) return;
        const landingHeight = landingPoint.y / WORLD_SCALE;
        // The walkable paw tops live just above Blender's ground plane.
        // Exclude the underside of large display meshes and distant scenery.
        if (landingHeight < 0 || landingHeight > 20) return;
        const next = new Vector3(
          landingPoint.x / WORLD_SCALE,
          0,
          landingPoint.z / WORLD_SCALE,
        );
        if (!discovered.some((point) => point.distanceToSquared(next) < 16)) discovered.push(next);
      });

      pawRoute.current = discovered
        .sort((a, b) => a.lengthSq() - b.lengthSq())
        .slice(0, 4);
    }

    // Spend time crawling on each paw, then leap only across the open gap to
    // the next paw. Every landing point is the center of an actual paw mesh.
    const segmentDuration = 1.8;
    if (routeStartTime.current === null) routeStartTime.current = clock.getElapsedTime();
    const elapsed = clock.getElapsedTime() - routeStartTime.current;
    const routeStep = Math.floor(elapsed / segmentDuration);
    const segmentProgress = (elapsed % segmentDuration) / segmentDuration;
    const activeRoute = pawRoute.current && pawRoute.current.length > 1
      ? pawRoute.current
      : SPIDER_PAW_ROUTE;
    const start = activeRoute[routeStep % activeRoute.length];
    const end = activeRoute[(routeStep + 1) % activeRoute.length];
    const isJumping = segmentProgress >= 0.12;
    const jumpProgress = isJumping ? (segmentProgress - 0.12) / 0.88 : 0;

    routePosition.copy(start);
    if (isJumping) routePosition.lerp(end, jumpProgress);
    routeTangent.subVectors(end, start);

    const desiredMotion: SpiderMode = isJumping ? "walk" : "twitch";
    if (currentMotion.current !== desiredMotion) {
      const activeAction = desiredMotion === "walk" ? actions.Walk : actions.Twitching;
      if (activeAction) {
        Object.values(actions).forEach((action) => {
          if (action && action !== activeAction) action.fadeOut(0.2);
        });
        activeAction.reset().setLoop(LoopRepeat, Infinity).setEffectiveTimeScale(0.5).fadeIn(0.2).play();
        currentMotion.current = desiredMotion;
      }
    }

    // The paw meshes act as the world's walkable collision surfaces. Cast
    // down at each position so landings stay exactly on the paw's top surface.
    // Raycaster works in rendered world-space, while the imported Blender
    // scene and the spider route use Blender units. Convert only for the
    // collision query, then convert the hit back before positioning the spider.
    rayOrigin.set(
      routePosition.x * WORLD_SCALE,
      450 * WORLD_SCALE,
      routePosition.z * WORLD_SCALE,
    );
    floorRaycaster.set(rayOrigin, downDirection);
    const floorHit = floorRaycaster.intersectObjects(pawColliders, true)[0];
    const floorHeight = floorHit ? floorHit.point.y / WORLD_SCALE + scale * 0.1 : 0;
    const jumpHeight = isJumping ? Math.sin(jumpProgress * Math.PI) * 8 : 0;
    root.current.position.set(routePosition.x, floorHeight + jumpHeight, routePosition.z);
    root.current.rotation.y = Math.atan2(routeTangent.x, routeTangent.z);
  });

  return (
    <group ref={root} position={position} scale={scale}>
      <primitive object={model} />
    </group>
  );
}

// The current Blender world already contains the Facewall at its authored
// transform. Keep this importer unmounted so no duplicate is added.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function FacesWall({
  position = [0, 0, 100],
  scale = 42,
}: {
  position?: [number, number, number];
  scale?: number;
}) {
  const { scene } = useGLTF(FACES_WALL_MODEL_URL);
  const model = useMemo(() => scene.clone(true), [scene]);
  const root = useRef<Group>(null);
  const wobbleUniform = useRef<{ value: number } | null>(null);

  useEffect(() => {
    const materials: MeshStandardMaterial[] = [];

    model.traverse((object) => {
      if (!(object as Mesh).isMesh) return;
      const mesh = object as Mesh;
      const sourceMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const nextMaterials = sourceMaterials.map((source) => {
        const material = (source as MeshStandardMaterial).clone();
        material.onBeforeCompile = (shader) => {
          shader.uniforms.uFacesWallTime = { value: 0 };
          wobbleUniform.current = shader.uniforms.uFacesWallTime as { value: number };
          shader.vertexShader = `uniform float uFacesWallTime;\n${shader.vertexShader}`.replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
              float ripple = sin(position.x * 1.65 + position.y * 1.12 + uFacesWallTime * 0.72);
              float rippleDetail = sin(position.z * 2.15 - uFacesWallTime * 0.48);
              transformed += normal * (ripple * 0.075 + rippleDetail * 0.035);`,
          );
        };
        material.customProgramCacheKey = () => "faces-wall-wobble-v1";
        material.needsUpdate = true;
        materials.push(material);
        return material;
      });
      mesh.material = Array.isArray(mesh.material) ? nextMaterials : nextMaterials[0];
    });

    return () => materials.forEach((material) => material.dispose());
  }, [model]);

  useFrame(({ clock }, delta) => {
    if (wobbleUniform.current) wobbleUniform.current.value = clock.getElapsedTime();
    if (root.current) root.current.rotation.y += delta * 0.035;
  });

  return (
    <group ref={root} position={position} scale={scale}>
      <primitive object={model} />
    </group>
  );
}

function CatPawWorldModel() {
  const { scene } = useGLTF(WORLD_MODEL_URL, DRACO_DECODER_PATH);
  const clipData = useLoader(FileLoader, "/world/spider-clips.json");
  const animations = useMemo(() => (JSON.parse(clipData as string) as Parameters<typeof AnimationClip.parse>[0][]).map(clip => AnimationClip.parse(clip)), [clipData]);
  const model = useMemo(() => {
    // Object3D.clone shares the original skeleton. Rebind the cloned mesh to
    // the cloned bones so the mixer and renderer operate on the same rig.
    const model = cloneSkeleton(scene);
    const armature = model.getObjectByName("Armature");
    const locomotion = new Group();
    locomotion.name = "SpiderLocomotion";
    locomotion.scale.setScalar(60);
    if (armature?.parent) {
      armature.parent.add(locomotion);
      locomotion.add(armature);
    }
    return model;
  }, [scene]);
  const worldRoot = useRef<Group>(null);
  const giantSpider = useMemo(() => {
    const copy = cloneSkeleton(scene);
    const armature = copy.getObjectByName("Armature");
    const group = new Group();
    group.name = "GiantSpiderLocomotion";
    group.scale.setScalar(600);
    group.position.set(90, 0, -60);
    if (armature) group.add(armature);
    return group;
  }, [scene]);
  const spiderStartPosition = useRef<Vector3 | null>(null);
  const spiderRoute = useMemo(
    () => [
      new Vector3(0, 0, 0),
      new Vector3(42, 0, -24),
      new Vector3(65, 0, 18),
      new Vector3(18, 0, 42),
      new Vector3(-32, 0, 16),
    ],
    [],
  );
  const spiderPosition = useMemo(() => new Vector3(), []);
  const spiderDirection = useMemo(() => new Vector3(), []);
  // Recreate the mixer with each loaded scene so bindings never point at a
  // replaced model after a texture export or hot reload.
  const mixer = useMemo(() => new AnimationMixer(model), [model]);
  const actions = useMemo(() => Object.fromEntries(animations.map(clip => [clip.name, mixer.clipAction(clip)])), [animations, mixer]);
  const giantMixer = useMemo(() => new AnimationMixer(giantSpider), [giantSpider]);
  const giantActions = useMemo(() => Object.fromEntries(animations.map(clip => [clip.name, giantMixer.clipAction(clip)])), [animations, giantMixer]);
  const faceTime = useRef({ value: 0 });
  useEffect(() => {
    const face = model.getObjectByName("FemaleHead_low") as Mesh | undefined;
    if (!face?.isMesh) return;
    const originals = face.material;
    const materials = (Array.isArray(originals) ? originals : [originals]).map(source => {
      const material = (source as MeshStandardMaterial).clone();
      material.onBeforeCompile = shader => {
        shader.uniforms.uFacesWallTime = faceTime.current;
        shader.vertexShader = `uniform float uFacesWallTime;\n${shader.vertexShader}`.replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
          float ripple = sin(position.x * 1.65 + position.y * 1.12 + uFacesWallTime * 0.72);
          float detail = sin(position.z * 2.15 - uFacesWallTime * 0.48);
          transformed += normal * (ripple * 0.075 + detail * 0.035);`,
        );
      };
      material.customProgramCacheKey = () => "world-facewall-ripple-v2";
      return material;
    });
    face.material = Array.isArray(originals) ? materials : materials[0];
    return () => {
      face.material = originals;
      materials.forEach(material => material.dispose());
    };
  }, [model]);
  const activeClip = useRef<string | null>(null);
  const elapsedMotion = useRef(0);
  const motionPhase = useRef({ moving: true, remaining: 6 });
  const giantPhase = useRef({ moving: true, remaining: 4.5 });
  const giantElapsed = useRef(0);
  const giantActiveClip = useRef<string | null>(null);
  const giantPosition = useMemo(() => new Vector3(), []);
  const giantDirection = useMemo(() => new Vector3(), []);

  useEffect(() => {
    activeClip.current = null;
    giantActiveClip.current = null;
    return () => { mixer.stopAllAction(); giantMixer.stopAllAction(); };
  }, [actions, mixer, giantMixer]);

  useFrame((_, delta) => {
    faceTime.current.value += delta;
    // Translate bones and skin together through an unanimated parent. Moving
    // only an attached SkinnedMesh is cancelled by its inverse bind matrix.
    const spider = worldRoot.current?.getObjectByName("SpiderLocomotion");
    if (!spider) return;
    if (spiderStartPosition.current === null) {
      spiderStartPosition.current = spider.position.clone();
    }

    // Keep the Blender-authored pose animation playing while the whole
    // Armature travels continuously around nearby paws. No segment resets
    // its location, so the movement cannot appear as a teleport.
    const segmentDuration = 40 / 1.2;
    // Pause route time during rest, then resume at the same location and speed.
    let remainingDelta = delta;
    while (remainingDelta > 0) {
      const step = Math.min(remainingDelta, motionPhase.current.remaining);
      if (motionPhase.current.moving) elapsedMotion.current += step;
      motionPhase.current.remaining -= step;
      remainingDelta -= step;
      if (motionPhase.current.remaining <= 0) {
        motionPhase.current.moving = !motionPhase.current.moving;
        motionPhase.current.remaining = 4 + Math.random() * 4;
      }
    }
    const travel = elapsedMotion.current / segmentDuration;
    const moving = motionPhase.current.moving;
    const clipName = moving ? "Walk" : "Twitching";
    if ((activeClip.current !== clipName || !actions[clipName]?.isRunning()) && actions[clipName]) {
      for (const characterActions of [actions]) {
        const previous = activeClip.current ? characterActions[activeClip.current] : null;
        const next = characterActions[clipName]!;
        next.reset().setLoop(LoopRepeat, Infinity).setEffectiveTimeScale(0.6).setEffectiveWeight(1).play();
        if (previous) previous.crossFadeTo(next, 0.25, false);
      }
      activeClip.current = clipName;
    }
    mixer.update(delta);
    const segmentIndex = Math.floor(travel) % spiderRoute.length;
    const nextIndex = (segmentIndex + 1) % spiderRoute.length;
    const progress = travel - Math.floor(travel);
    spiderPosition.copy(spiderRoute[segmentIndex]).lerp(spiderRoute[nextIndex], progress);
    spiderDirection.subVectors(spiderRoute[nextIndex], spiderRoute[segmentIndex]);
    spider.position.copy(spiderStartPosition.current).add(spiderPosition);
    spider.rotation.y = Math.atan2(spiderDirection.x, spiderDirection.z);
    const giant = worldRoot.current?.getObjectByName("GiantSpiderLocomotion");
    if (giant) {
      let giantDelta = delta;
      while (giantDelta > 0) {
        const step = Math.min(giantDelta, giantPhase.current.remaining);
        if (giantPhase.current.moving) giantElapsed.current += step;
        giantPhase.current.remaining -= step;
        giantDelta -= step;
        if (giantPhase.current.remaining <= 0) {
          giantPhase.current.moving = !giantPhase.current.moving;
          giantPhase.current.remaining = 4 + Math.random() * 4;
        }
      }
      const giantClip = giantPhase.current.moving ? "Walk" : "Twitching";
      if (giantActiveClip.current !== giantClip || !giantActions[giantClip]?.isRunning()) {
        const next = giantActions[giantClip];
        const previous = giantActiveClip.current ? giantActions[giantActiveClip.current] : null;
        if (next) {
          next.reset().setLoop(LoopRepeat, Infinity).setEffectiveTimeScale(0.6).setEffectiveWeight(1).play();
          if (previous) previous.crossFadeTo(next, 0.25, false);
          giantActiveClip.current = giantClip;
        }
      }
      // Traverse the route in reverse, with its own clock and rest intervals.
      const giantTravel = giantElapsed.current * 2 / segmentDuration;
      const from = (spiderRoute.length - Math.floor(giantTravel) % spiderRoute.length) % spiderRoute.length;
      const to = (from + spiderRoute.length - 1) % spiderRoute.length;
      giantPosition.copy(spiderRoute[from]).lerp(spiderRoute[to], giantTravel % 1);
      giantDirection.subVectors(spiderRoute[to], spiderRoute[from]);
      giant.position.set(giantPosition.x + 90, giantPosition.y, giantPosition.z - 60);
      giant.rotation.y = Math.atan2(giantDirection.x, giantDirection.z);
    }
    giantMixer.update(delta);
  });

  return (
    // Keep Blender's native origin: this makes the camera's orbit target and
    // the scene's (0, 0, 0) exactly the same point.
    <group scale={WORLD_SCALE}>
      <group ref={worldRoot}>
        <primitive object={model} />
        <primitive object={giantSpider} />
      </group>
    </group>
  );
}

function LoadingWorld() {
  return (
    <Html center>
      <span className="world-loading">LOADING WORLD...</span>
    </Html>
  );
}

export function WorldViewer() {
  return (
    <div className="world-viewer" aria-label="Interactive 3D cat paw world">
      <Canvas
        camera={{ fov: 46, near: 0.01, far: 200, position: [0.028895, -0.093691, -0.011751] }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={["#07152d"]} />
        <fog attach="fog" args={["#07152d", 14, 36]} />
        <ambientLight intensity={1.35} />
        <directionalLight position={[5, 7, 6]} intensity={2.8} color="#fff1fa" />
        <pointLight position={[-6, 3, 5]} intensity={48} color="#28ffe1" distance={20} decay={1.65} />
        <pointLight position={[6, 1, 4]} intensity={44} color="#ff35b8" distance={18} decay={1.6} />
        <pointLight position={[0, -4, 5]} intensity={34} color="#8b5cff" distance={17} decay={1.7} />
        <pointLight position={[-4, 5, -5]} intensity={38} color="#32a8ff" distance={19} decay={1.65} />
        <pointLight position={[5, 4, -4]} intensity={32} color="#ffea38" distance={17} decay={1.7} />
        <Suspense fallback={<LoadingWorld />}>
          <CatPawWorldModel />
        </Suspense>
        <OrbitControls
          autoRotate
          // Convert 0.1 times the first leg's rendered units/second to
          // radians/second (one-unit radius), then to OrbitControls units.
          autoRotateSpeed={(Math.hypot(42, 24) / 40) * WORLD_SCALE * 0.1 * 60 / (2 * Math.PI) * 1.2}
          enablePan={false}
          minDistance={0.01}
          maxDistance={32}
          target={[0, 0, 0]}
          zoomToCursor
        />
      </Canvas>
      <span className="world-scanlines" aria-hidden="true" />
    </div>
  );
}

useGLTF.preload(WORLD_MODEL_URL, DRACO_DECODER_PATH);
