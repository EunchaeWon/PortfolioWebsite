import bpy
import os


BLEND_PATH = r"C:\Users\wonen\Documents\Blender\Website\catPawWorld.blend_spiderMonster_Facewall.blend"
SPIDER_TEXTURE_DIR = r"C:\Users\wonen\Documents\Adobe\Adobe Substance 3D Painter\export\Website\SpiderMonster"
FACE_TEXTURE_DIR = r"C:\Users\wonen\Documents\Adobe\Adobe Substance 3D Painter\export\CatGame\wallfaces"


def load_image(path, non_color=False):
    if not os.path.isfile(path):
        raise RuntimeError(f"Missing texture: {path}")
    image = bpy.data.images.load(path, check_existing=False)
    image.colorspace_settings.name = "Non-Color" if non_color else "sRGB"
    return image


def make_substance_material(name, texture_dir, texture_names):
    material = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    nodes.clear()

    output = nodes.new("ShaderNodeOutputMaterial")
    shader = nodes.new("ShaderNodeBsdfPrincipled")
    base = nodes.new("ShaderNodeTexImage")
    normal = nodes.new("ShaderNodeTexImage")
    normal_map = nodes.new("ShaderNodeNormalMap")
    orm = nodes.new("ShaderNodeTexImage")
    separate = nodes.new("ShaderNodeSeparateRGB")

    base.image = load_image(os.path.join(texture_dir, texture_names["base"]))
    normal.image = load_image(os.path.join(texture_dir, texture_names["normal"]), non_color=True)
    orm.image = load_image(os.path.join(texture_dir, texture_names["orm"]), non_color=True)

    links.new(base.outputs["Color"], shader.inputs["Base Color"])
    links.new(normal.outputs["Color"], normal_map.inputs["Color"])
    links.new(normal_map.outputs["Normal"], shader.inputs["Normal"])
    links.new(orm.outputs["Color"], separate.inputs["Image"])
    links.new(separate.outputs["G"], shader.inputs["Roughness"])
    links.new(separate.outputs["B"], shader.inputs["Metallic"])
    links.new(shader.outputs["BSDF"], output.inputs["Surface"])
    return material


def assign_material(object_name, material):
    mesh = bpy.data.objects.get(object_name)
    if mesh is None or mesh.type != "MESH":
        raise RuntimeError(f"Missing mesh: {object_name}")
    mesh.data.materials.clear()
    mesh.data.materials.append(material)


spider_material = make_substance_material(
    "SpiderMonster_Substance",
    SPIDER_TEXTURE_DIR,
    {
        "base": "SpiderwomanNew_low_Spiderwoman_low_BaseColor_Utility - sRGB - Texture.1001.png",
        "normal": "SpiderwomanNew_low_Spiderwoman_low_Normal_Utility - Raw.1001.png",
        "orm": "SpiderwomanNew_low_Spiderwoman_low_OcclusionRoughnessMetallic_Utility - Raw.1001.png",
    },
)
face_material = make_substance_material(
    "FacesWall_Substance",
    FACE_TEXTURE_DIR,
    {
        "base": "Faceswall_low_FemaleHead_low_BaseColor_Utility - sRGB - Texture.1001.png",
        "normal": "Faceswall_low_FemaleHead_low_Normal_Utility - Raw.1001.png",
        "orm": "Faceswall_low_FemaleHead_low_OcclusionRoughnessMetallic_Utility - Raw.1001.png",
    },
)

assign_material("Spiderwoman_low", spider_material)
assign_material("FemaleHead_low", face_material)

for image in bpy.data.images:
    if image.source == "FILE":
        image.pack()

if globals().get("SAVE_BLEND", False):
    bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)
print(f"APPLIED_TEXTURES|Spiderwoman_low={spider_material.name}|FemaleHead_low={face_material.name}")
