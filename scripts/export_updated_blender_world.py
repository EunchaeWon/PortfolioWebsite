import bpy
import os
import runpy


OUTPUT = r"C:\Users\wonen\Documents\Unreal Projects\NoWhereNowHere\portfolio\public\world\cat-paw-world.glb"

# Apply character materials in memory only; never save the Blender source.
runpy.run_path(os.path.join(os.path.dirname(__file__), "apply_world_character_textures.py"), init_globals={"SAVE_BLEND": False})
bpy.ops.export_scene.gltf(
    filepath=OUTPUT,
    export_format="GLB",
    export_apply=True,
    export_animations=True,
    export_materials="EXPORT",
)

print(f"EXPORTED_UPDATED_WORLD|{OUTPUT}")
