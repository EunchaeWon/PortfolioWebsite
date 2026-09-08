import bpy

for obj in bpy.context.scene.objects:
    if obj.type in {"MESH", "ARMATURE"}:
        print(
            f"OBJECT|{obj.name}|{obj.type}|"
            f"location={tuple(round(value, 4) for value in obj.location)}|"
            f"scale={tuple(round(value, 4) for value in obj.scale)}|"
            f"hidden={obj.hide_viewport or obj.hide_render}|"
            f"materials={','.join(material.name for material in getattr(obj.data, 'materials', []) if material)}"
        )

for material in bpy.data.materials:
    print(f"MATERIAL|{material.name}")
