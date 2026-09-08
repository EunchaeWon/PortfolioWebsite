import bpy
import os


CAT_PAW = r"C:\Users\wonen\Documents\Adobe\Adobe Substance 3D Painter\export\Website\CatPaw"
CAT_PAW_2 = r"C:\Users\wonen\Documents\Adobe\Adobe Substance 3D Painter\export\Website\CatPaw2"
OUTPUT = r"C:\Users\wonen\Documents\Unreal Projects\NoWhereNowHere\portfolio\public\world\cat-paw-world.glb"


TEXTURES = {
    "Paw1_low": {
        "base": os.path.join(CAT_PAW, "CatPaw_Paw1_low_SeamsColor_BaseColor_Utility - sRGB - Texture.1001.png"),
        "normal": os.path.join(CAT_PAW, "CatPaw_Paw1_low_SeamsColor_Normal_Utility - Raw.1001.png"),
        "orm": os.path.join(CAT_PAW, "CatPaw_Paw1_low_SeamsColor_OcclusionRoughnessMetallic_Utility - Raw.1001.png"),
    },
    "PawJelly1_low": {
        "base": os.path.join(CAT_PAW, "CatPaw_PawJelly1_low_SeamsColor_BaseColor_Utility - sRGB - Texture.1001.png"),
        "normal": os.path.join(CAT_PAW, "CatPaw_PawJelly1_low_SeamsColor_Normal_Utility - Raw.1001.png"),
        "orm": os.path.join(CAT_PAW, "CatPaw_PawJelly1_low_SeamsColor_OcclusionRoughnessMetallic_Utility - Raw.1001.png"),
    },
    "Paw2": {
        "base": os.path.join(CAT_PAW_2, "CatPaw2_Paw2_BaseColor_Utility - sRGB - Texture.1001.png"),
        "normal": os.path.join(CAT_PAW_2, "CatPaw2_Paw2_Normal_Utility - Raw.1001.png"),
        "orm": os.path.join(CAT_PAW_2, "CatPaw2_Paw2_OcclusionRoughnessMetallic_Utility - Raw.1001.png"),
    },
    "Paw2Jelly": {
        "base": os.path.join(CAT_PAW_2, "CatPaw2_Paw2Jelly_BaseColor_Utility - sRGB - Texture.1001.png"),
        "normal": os.path.join(CAT_PAW_2, "CatPaw2_Paw2Jelly_Normal_Utility - Raw.1001.png"),
        "orm": os.path.join(CAT_PAW_2, "CatPaw2_Paw2Jelly_OcclusionRoughnessMetallic_Utility - Raw.1001.png"),
    },
}


def load_image(path, non_color=False):
    # Always read the current Substance export from disk. The .blend may contain
    # an older packed image with the same filepath.
    image = bpy.data.images.load(path, check_existing=False)
    image.filepath = path
    image.colorspace_settings.name = "Non-Color" if non_color else "sRGB"
    return image


def configure_material(material_name, paths):
    material = bpy.data.materials.get(material_name)
    if material is None:
        raise RuntimeError(f"Missing material: {material_name}")

    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    nodes.clear()

    output = nodes.new("ShaderNodeOutputMaterial")
    output.location = (720, 0)
    principled = nodes.new("ShaderNodeBsdfPrincipled")
    principled.location = (430, 0)
    principled.inputs["Roughness"].default_value = 0.45
    links.new(principled.outputs["BSDF"], output.inputs["Surface"])

    base = nodes.new("ShaderNodeTexImage")
    base.name = f"{material_name}_BaseColor"
    base.label = "Base Color"
    base.location = (-620, 220)
    base.image = load_image(paths["base"])
    links.new(base.outputs["Color"], principled.inputs["Base Color"])

    normal_tex = nodes.new("ShaderNodeTexImage")
    normal_tex.name = f"{material_name}_Normal"
    normal_tex.label = "Normal"
    normal_tex.location = (-620, -80)
    normal_tex.image = load_image(paths["normal"], non_color=True)
    normal_map = nodes.new("ShaderNodeNormalMap")
    normal_map.location = (120, -80)
    normal_map.inputs["Strength"].default_value = 1.0
    links.new(normal_tex.outputs["Color"], normal_map.inputs["Color"])
    links.new(normal_map.outputs["Normal"], principled.inputs["Normal"])

    orm = nodes.new("ShaderNodeTexImage")
    orm.name = f"{material_name}_ORM"
    orm.label = "Occlusion / Roughness / Metallic"
    orm.location = (-620, -380)
    orm.image = load_image(paths["orm"], non_color=True)
    separate = nodes.new("ShaderNodeSeparateRGB")
    separate.location = (-140, -350)
    links.new(orm.outputs["Color"], separate.inputs["Image"])
    links.new(separate.outputs["G"], principled.inputs["Roughness"])
    links.new(separate.outputs["B"], principled.inputs["Metallic"])

    # The glTF exporter recognises this group input as the occlusion channel.
    group_tree = bpy.data.node_groups.get("glTF Material Output")
    if group_tree is None:
        group_tree = bpy.data.node_groups.new("glTF Material Output", "ShaderNodeTree")
        group_tree.inputs.new("NodeSocketFloat", "Occlusion")
    occlusion = nodes.new("ShaderNodeGroup")
    occlusion.node_tree = group_tree
    occlusion.location = (120, -430)
    links.new(separate.outputs["R"], occlusion.inputs["Occlusion"])


# Fully unlink the previously packed texture images before loading the current
# Substance exports, so no stale image can survive through Blender name reuse.
for image in list(bpy.data.images):
    if image.name not in {"Render Result", "Viewer Node"}:
        bpy.data.images.remove(image, do_unlink=True)

# Replace the remaining seam-preview materials with the production materials.
for obj in bpy.data.objects:
    if obj.type != "MESH":
        continue
    for slot in obj.material_slots:
        if slot.material and slot.material.name.endswith("_SeamsColor"):
            clean_name = slot.material.name.removesuffix("_SeamsColor")
            clean_material = bpy.data.materials.get(clean_name)
            if clean_material:
                slot.material = clean_material

for name, texture_paths in TEXTURES.items():
    for texture_path in texture_paths.values():
        if not os.path.isfile(texture_path):
            raise RuntimeError(f"Missing texture: {texture_path}")
    configure_material(name, texture_paths)

for material in list(bpy.data.materials):
    if material.name.endswith("_SeamsColor") and material.users == 0:
        bpy.data.materials.remove(material)

# Remove split/custom normals that can preserve a visible line along UV cuts,
# then export consistently smooth vertex normals for the web viewer.
for obj in bpy.data.objects:
    if obj.type != "MESH":
        continue
    mesh = obj.data
    if getattr(mesh, "has_custom_normals", False):
        mesh.free_normals_split()
    for polygon in mesh.polygons:
        polygon.use_smooth = True
    if hasattr(mesh, "use_auto_smooth"):
        mesh.use_auto_smooth = False
    mesh.update()

for image in list(bpy.data.images):
    if image.users == 0 and image.name not in {"Render Result", "Viewer Node"}:
        bpy.data.images.remove(image)

for image in bpy.data.images:
    if image.source == "FILE" and image.filepath:
        image.pack()

bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
bpy.ops.export_scene.gltf(
    filepath=OUTPUT,
    export_format="GLB",
    export_apply=True,
    export_yup=True,
    export_materials="EXPORT",
)

print(f"EXPORTED_TEXTURED_WORLD|{OUTPUT}|{os.path.getsize(OUTPUT)}")
