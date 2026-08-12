import fs from 'fs';
import path from 'path';

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let updated = content
        .replace(/rose-/g, 'orange-')
        .replace(/rgba\(225,29,72/g, 'rgba(249,115,22');
        
      if (content !== updated) {
        fs.writeFileSync(fullPath, updated, 'utf8');
        console.log('Updated', fullPath);
      }
    }
  }
}

replaceInDir(path.join(process.cwd(), '..', 'client', 'src'));
console.log('Done!');
