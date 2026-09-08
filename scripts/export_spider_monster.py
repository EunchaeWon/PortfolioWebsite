import bpy
import os
import json
import struct

WALK_FBX = r"C:\Users\wonen\Documents\Blender\Spider\Spidermonster_WalkingAnim.fbx"
TWITCH_FBX = r"C:\Users\wonen\Documents\Blender\Spider\Spidermonster_Twitching.fbx"
TEXTURE_DIR = r"C:\Users\wonen\Documents\Adobe\Adobe Substance 3D Painter\export\Website\SpiderMonster"
OUTPUT = r"C:\Users\wonen\Documents\Unreal Projects\NoWhereNowHere\portfolio\public\world\spider-monster.glb"
# Blender's FBX/glTF bridge writes a fixed armature conversion scale. Apply a
# calibrated scale to the exported GLB root so the animated silhouette matches
# the smallest cat paw, with no runtime Three.js correction.
SMALLEST_PAW_ROOT_SCALE = 0.3458

TEXTURES = {
    "base": "SpiderwomanNew_low_Spiderwoman_low_BaseColor_Utility - sRGB - Texture.1001.png",
    "normal": "SpiderwomanNew_low_Spiderwoman_low_Normal_Utility - Raw.1001.png",
    "orm": "SpiderwomanNew_low_Spiderwoman_low_OcclusionRoughnessMetallic_Utility - Raw.1001.png",
}


def find_object(object_type):
    return next((obj for obj in bpy.context.scene.objects if obj.type == object_type), None)


def load_image(path, non_color=False):
    image = bpy.data.images.load(path, check_existing=False)
    image.colorspace_settings.name = "Non-Color" if non_color else "sRGB"
    return image


def build_material(mesh):
    material = bpy.data.materials.new("SpiderMonster_Substance")
    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    nodes.clear()

    output = nodes.new("ShaderNodeOutputMaterial")
    output.location = (720, 0)
    shader = nodes.new("ShaderNodeBsdfPrincipled")
    shader.location = (420, 0)
    links.new(shader.outputs["BSDF"], output.inputs["Surface"])

    base = nodes.new("ShaderNodeTexImage")
    base.location = (-660, 250)
    base.image = load_image(os.path.join(TEXTURE_DIR, TEXTURES["base"]))
    links.new(base.outputs["Color"], shader.inputs["Base Color"])

    normal = nodes.new("ShaderNodeTexImage")
    normal.location = (-660, -30)
    normal.image = load_image(os.path.join(TEXTURE_DIR, TEXTURES["normal"]), non_color=True)
    normal_map = nodes.new("ShaderNodeNormalMap")
    normal_map.location = (80, -30)
    links.new(normal.outputs["Color"], normal_map.inputs["Color"])
    links.new(normal_map.outputs["Normal"], shader.inputs["Normal"])

    orm = nodes.new("ShaderNodeTexImage")
    orm.location = (-660, -310)
    orm.image = load_image(os.path.join(TEXTURE_DIR, TEXTURES["orm"]), non_color=True)
    separate = nodes.new("ShaderNodeSeparateRGB")
    separate.location = (-120, -300)
    links.new(orm.outputs["Color"], separate.inputs["Image"])
    links.new(separate.outputs["G"], shader.inputs["Roughness"])
    links.new(separate.outputs["B"], shader.inputs["Metallic"])

    mesh.data.materials.clear()
    mesh.data.materials.append(material)


def import_fbx(path):
    before_actions = set(bpy.data.actions)
    bpy.ops.import_scene.fbx(filepath=path)
    armature = find_object("ARMATURE")
    mesh = find_object("MESH")
    action = next((item for item in bpy.data.actions if item not in before_actions), None)
    if not armature or not mesh or not action:
        raise RuntimeError(f"Could not import armature, mesh, and animation from {path}")
    return armature, mesh, action


def scale_exported_root(path, factor):
    with open(path, "rb") as file:
        glb = file.read()
    _, version, _ = struct.unpack("<4sII", glb[:12])
    json_length, json_type = struct.unpack("<I4s", glb[12:20])
    if version != 2 or json_type != b"JSON":
        raise RuntimeError("Expected a glTF 2.0 binary file")
    document = json.loads(glb[20:20 + json_length].decode("utf-8"))
    root = next((node for node in document["nodes"] if node.get("name") == "SpiderMonster"), None)
    if root is None:
        raise RuntimeError("Could not find SpiderMonster GLB root")
    root["scale"] = [value * factor for value in root.get("scale", [1, 1, 1])]
    encoded = json.dumps(document, separators=(",", ":")).encode("utf-8")
    encoded += b" " * ((4 - len(encoded) % 4) % 4)
    remainder = glb[20 + json_length:]
    header = struct.pack("<4sII", b"glTF", 2, 12 + 8 + len(encoded) + len(remainder))
    with open(path, "wb") as file:
        file.write(header + struct.pack("<I4s", len(encoded), b"JSON") + encoded + remainder)


bpy.ops.wm.read_factory_settings(use_empty=True)

for name in TEXTURES.values():
    path = os.path.join(TEXTURE_DIR, name)
    if not os.path.isfile(path):
        raise RuntimeError(f"Missing Substance texture: {path}")

armature, mesh, walk_action = import_fbx(WALK_FBX)
armature.name = "SpiderMonster"
mesh.name = "SpiderMonsterMesh"
walk_action.name = "Walk"
walk_action.use_fake_user = True

_, twitch_mesh, twitch_action = import_fbx(TWITCH_FBX)
twitch_action.name = "Twitching"
twitch_action.use_fake_user = True

# The animation files share the same rig. Retain only the walking model and
# attach the second action to that rig through separate NLA tracks for glTF.
for obj in list(bpy.context.scene.objects):
    if obj != armature and obj != mesh:
        bpy.data.objects.remove(obj, do_unlink=True)

build_material(mesh)
mesh.select_set(False)
armature.select_set(True)
bpy.context.view_layer.objects.active = armature
armature.animation_data_create()
armature.animation_data.action = None

for action in (walk_action, twitch_action):
    track = armature.animation_data.nla_tracks.new()
    track.name = action.name
    strip = track.strips.new(action.name, int(action.frame_range[0]), action)
    strip.action_frame_start = action.frame_range[0]
    strip.action_frame_end = action.frame_range[1]
    strip.extrapolation = "NOTHING"
    strip.blend_type = "REPLACE"

for image in bpy.data.images:
    if image.source == "FILE":
        image.pack()

bpy.ops.export_scene.gltf(
    filepath=OUTPUT,
    export_format="GLB",
    export_apply=True,
    export_animations=True,
    export_nla_strips=True,
    export_nla_strips_merged_animation_name="",
    export_materials="EXPORT",
)
scale_exported_root(OUTPUT, SMALLEST_PAW_ROOT_SCALE)

print(f"EXPORTED_SPIDER_MONSTER|{OUTPUT}|{os.path.getsize(OUTPUT)}")
