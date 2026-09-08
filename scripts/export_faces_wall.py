import bpy
import os

MODEL = r"C:\Users\wonen\Documents\Zbrush\CatGame\Faceswall_low.fbx"
TEXTURE_DIR = r"C:\Users\wonen\Documents\Adobe\Adobe Substance 3D Painter\export\CatGame\wallfaces"
OUTPUT = r"C:\Users\wonen\Documents\Unreal Projects\NoWhereNowHere\portfolio\public\world\faces-wall.glb"

TEXTURES = {
    "base": "Faceswall_low_FemaleHead_low_BaseColor_Utility - sRGB - Texture.1001.png",
    "normal": "Faceswall_low_FemaleHead_low_Normal_Utility - Raw.1001.png",
    "orm": "Faceswall_low_FemaleHead_low_OcclusionRoughnessMetallic_Utility - Raw.1001.png",
}


def load_image(path, non_color=False):
    image = bpy.data.images.load(path, check_existing=False)
    image.colorspace_settings.name = "Non-Color" if non_color else "sRGB"
    return image


def build_material(mesh):
    material = bpy.data.materials.new("FacesWall_Substance")
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


bpy.ops.wm.read_factory_settings(use_empty=True)

for filename in TEXTURES.values():
    path = os.path.join(TEXTURE_DIR, filename)
    if not os.path.isfile(path):
        raise RuntimeError(f"Missing Substance texture: {path}")

bpy.ops.import_scene.fbx(filepath=MODEL)
meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
if not meshes:
    raise RuntimeError("Faces wall FBX did not contain a mesh")

for mesh in meshes:
    mesh.name = "FacesWallMesh"
    # FBX imports this ZBrush mesh at 1/100 scale. Bake that correction into
    # the geometry so the web scene can use the same world scale as the paws.
    mesh.scale = tuple(component * 100 for component in mesh.scale)
    bpy.context.view_layer.objects.active = mesh
    mesh.select_set(True)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    build_material(mesh)

for image in bpy.data.images:
    if image.source == "FILE":
        image.pack()

bpy.ops.export_scene.gltf(
    filepath=OUTPUT,
    export_format="GLB",
    export_apply=True,
    export_materials="EXPORT",
)

print(f"EXPORTED_FACES_WALL|{OUTPUT}|{os.path.getsize(OUTPUT)}")
