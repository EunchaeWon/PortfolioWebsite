"""Bake the calibrated smallest-paw scale into the SpiderMonster GLB root."""

import json
import struct


GLB_PATH = r"C:\Users\wonen\Documents\Unreal Projects\NoWhereNowHere\portfolio\public\world\spider-monster.glb"
SCALE_FACTOR = 1.689


with open(GLB_PATH, "rb") as file:
    glb = file.read()

_, version, _ = struct.unpack("<4sII", glb[:12])
json_length, json_type = struct.unpack("<I4s", glb[12:20])
if version != 2 or json_type != b"JSON":
    raise RuntimeError("Expected a glTF 2.0 binary file")

document = json.loads(glb[20:20 + json_length].decode("utf-8"))
root = next((node for node in document["nodes"] if node.get("name") == "SpiderMonster"), None)
if root is None:
    raise RuntimeError("Could not find SpiderMonster GLB root")

root["scale"] = [value * SCALE_FACTOR for value in root.get("scale", [1, 1, 1])]
encoded = json.dumps(document, separators=(",", ":")).encode("utf-8")
encoded += b" " * ((4 - len(encoded) % 4) % 4)
remainder = glb[20 + json_length:]
header = struct.pack("<4sII", b"glTF", 2, 12 + 8 + len(encoded) + len(remainder))

with open(GLB_PATH, "wb") as file:
    file.write(header + struct.pack("<I4s", len(encoded), b"JSON") + encoded + remainder)

print(f"FITTED_SPIDER_GLB|root_scale={root['scale']}")
