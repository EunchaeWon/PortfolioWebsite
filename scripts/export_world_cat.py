import bpy
from pathlib import Path

root = Path(__file__).resolve().parents[1]
textures = Path(r'C:/Users/wonen/Documents/Adobe/Adobe Substance 3D Painter/export/CatGame')
rig = next(o for o in bpy.context.scene.objects if o.type == 'ARMATURE')
run = bpy.data.actions['Run_Skinned Mesh 0.002']
for obj in bpy.context.scene.objects:
    if obj.animation_data:
        for track in list(obj.animation_data.nla_tracks):
            obj.animation_data.nla_tracks.remove(track)
        obj.animation_data.action = None
rig.animation_data_create()
rig.animation_data.action = run
for action in list(bpy.data.actions):
    if action != run:
        bpy.data.actions.remove(action)
run.name = 'Run'
mat = bpy.data.materials.new('Cat_PBR')
mat.use_nodes = True
nodes, links = mat.node_tree.nodes, mat.node_tree.links
shader = nodes.get('Principled BSDF')
def texture(pattern, space):
    node = nodes.new('ShaderNodeTexImage')
    node.image = bpy.data.images.load(str(next(textures.glob(pattern))))
    node.image.colorspace_settings.name = space
    return node
base = texture('*BaseColor*.1001.png', 'sRGB')
normal = texture('*Normal*.1001.png', 'Non-Color')
orm = texture('*OcclusionRoughnessMetallic*.1001.png', 'Non-Color')
links.new(base.outputs['Color'], shader.inputs['Base Color'])
normal_node = nodes.new('ShaderNodeNormalMap')
links.new(normal.outputs['Color'], normal_node.inputs['Color'])
links.new(normal_node.outputs['Normal'], shader.inputs['Normal'])
split = nodes.new('ShaderNodeSeparateRGB')
links.new(orm.outputs['Color'], split.inputs[0])
links.new(split.outputs['G'], shader.inputs['Roughness'])
links.new(split.outputs['B'], shader.inputs['Metallic'])
# glTF exporter recognizes this group as the occlusion input.
group = bpy.data.node_groups.new('glTF Settings', 'ShaderNodeTree')
group.inputs.new('NodeSocketFloat', 'Occlusion')
occlusion = nodes.new('ShaderNodeGroup')
occlusion.node_tree = group
links.new(split.outputs['R'], occlusion.inputs['Occlusion'])
for obj in bpy.context.scene.objects:
    obj.select_set(obj.type in {'MESH', 'ARMATURE'})
    if obj.type == 'MESH':
        obj.data.materials.clear()
        obj.data.materials.append(mat)
bpy.context.scene.frame_start = int(run.frame_range[0])
bpy.context.scene.frame_end = int(run.frame_range[1])
bpy.context.scene.frame_set(bpy.context.scene.frame_start)
bpy.ops.export_scene.gltf(filepath=str(root / 'public/world/running-cat.glb'),
    export_format='GLB', use_selection=True, export_animations=True,
    export_nla_strips=True, export_frame_range=True)
print('CAT_EXPORT_COMPLETE')
