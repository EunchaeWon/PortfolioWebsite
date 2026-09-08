"""Adjust only the exported web GLB; the Blender source is never written."""

import json
import struct


GLB_PATH = r"C:\Users\wonen\Documents\Unreal Projects\NoWhereNowHere\portfolio\public\world\cat-paw-world.glb"
# Keep the authored Blender Armature transform exactly as it is in the source
# scene. This is intentionally not a web-specific size correction.
TARGET_ARMATURE_SCALE = 5.5131333


with open(GLB_PATH, "rb") as file:
    glb = file.read()

_, version, _ = struct.unpack("<4sII", glb[:12])
json_length, json_type = struct.unpack("<I4s", glb[12:20])
if version != 2 or json_type != b"JSON":
    raise RuntimeError("Expected a glTF 2.0 binary file")

document = json.loads(glb[20:20 + json_length].decode("utf-8"))
armature = next((node for node in document["nodes"] if node.get("name") == "Armature"), None)
if armature is None:
    raise RuntimeError("Could not find the Blender SpiderMonster armature")

armature["scale"] = [TARGET_ARMATURE_SCALE] * 3
encoded = json.dumps(document, separators=(",", ":")).encode("utf-8")
encoded += b" " * ((4 - len(encoded) % 4) % 4)
remainder = glb[20 + json_length:]
header = struct.pack("<4sII", b"glTF", 2, 12 + 8 + len(encoded) + len(remainder))

with open(GLB_PATH, "wb") as file:
    file.write(header + struct.pack("<I4s", len(encoded), b"JSON") + encoded + remainder)

print(f"WORLD_SPIDER_SCALE|{armature['scale']}")
