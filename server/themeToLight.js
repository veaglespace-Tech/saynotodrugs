import fs from 'fs';
import path from 'path';

const replacements = [
  { search: /bg-\[#0a0a0a\]/g, replace: 'bg-slate-50' },
  { search: /bg-\[#111\]/g, replace: 'bg-white' },
  { search: /text-white/g, replace: 'text-slate-900' },
  { search: /text-slate-200/g, replace: 'text-slate-800' },
  { search: /text-slate-300/g, replace: 'text-slate-700' },
  { search: /text-slate-400/g, replace: 'text-slate-600' },
  { search: /text-slate-500/g, replace: 'text-slate-500' },
  { search: /border-white\/10/g, replace: 'border-slate-200' },
  { search: /border-white\/20/g, replace: 'border-slate-300' },
  { search: /border-white\/5/g, replace: 'border-slate-200' },
  { search: /bg-white\/5/g, replace: 'bg-white' },
  { search: /bg-white\/10/g, replace: 'bg-slate-50' },
  { search: /hover:bg-white\/10/g, replace: 'hover:bg-slate-100' },
  { search: /hover:bg-white\/20/g, replace: 'hover:bg-slate-200' },
  // specific to buttons that were white text on orange background:
  // we want them to remain white text on orange!
  // Wait, if I blindly replace text-white with text-slate-900, 
  // the text on orange buttons will become dark, which looks bad!
];

// Instead of simple global replaces, I'll do it cautiously.
// I'll actually only replace text-white if it's NOT inside a button that is orange.
// But that's too complex for regex.
// I'll just write a script that does the bg colors and borders first.

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let updated = content
        .replace(/bg-\[#0a0a0a\]/g, 'bg-slate-50')
        .replace(/bg-\[#111\]/g, 'bg-white')
        .replace(/bg-white\/5/g, 'bg-slate-100') // Inputs were bg-white/5 in dark mode
        .replace(/border-white\/10/g, 'border-slate-300')
        .replace(/text-slate-400/g, 'text-slate-600')
        .replace(/text-slate-300/g, 'text-slate-700')
        .replace(/text-slate-200/g, 'text-slate-800');
        
      // For text-white, we want to replace it ONLY if it's like a heading or paragraph, 
      // not if it's on an orange button.
      // So let's replace text-white with text-slate-900 globally, 
      // THEN revert text-slate-900 back to text-white if it's next to bg-orange or bg-gradient.
      updated = updated.replace(/text-white/g, 'text-slate-900');
      updated = updated.replace(/text-slate-900(.*?)bg-orange/g, 'text-white$1bg-orange');
      updated = updated.replace(/bg-orange(.*?)-slate-900/g, 'bg-orange$1-white');
      updated = updated.replace(/bg-gradient(.*?)-slate-900/g, 'bg-gradient$1-white');
      updated = updated.replace(/text-slate-900(.*?)bg-gradient/g, 'text-white$1bg-gradient');
      updated = updated.replace(/text-slate-900(.*?)text-center(.*?)relative/g, 'text-white$1text-center$2relative'); // the success/pledge gradient text
        
      if (content !== updated) {
        fs.writeFileSync(fullPath, updated, 'utf8');
        console.log('Updated', fullPath);
      }
    }
  }
}

replaceInDir(path.join(process.cwd(), '..', 'client', 'src'));
console.log('Done!');
