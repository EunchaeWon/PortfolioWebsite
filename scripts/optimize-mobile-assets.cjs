const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require(process.env.SHARP_MODULE || 'C:/Users/wonen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
(async () => {
  const directory = path.join(process.cwd(), 'public/characters');
  await fs.mkdir(path.join(directory, 'mobile'), {recursive:true});
  for (const name of await fs.readdir(directory)) {
    if (!name.endsWith('.png')) continue;
    await sharp(path.join(directory,name)).resize({width:640,height:640,fit:'inside',withoutEnlargement:true}).webp({quality:88,alphaQuality:100}).toFile(path.join(directory,'mobile',name.replace(/\.png$/,'.webp')));
  }
})();
