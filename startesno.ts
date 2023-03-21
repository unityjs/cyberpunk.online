import esno from 'esno';
import path from 'path';

esno(path.join(process.cwd(), './src/index.ts')).then((mainModule) => {
  mainModule.default();
});