import s from 'shelljs';
import config from './tsconfig.json';
const outDir = config.compilerOptions.outDir;

s.rm('-rf', outDir);
s.mkdir(outDir);
if (s.test('-f', '.env')) {
    s.cp('.env', `${outDir}/.env`);
}
s.mkdir('-p', `${outDir}/common/swagger`);
s.cp('server/common/api.yml', `${outDir}/common/api.yml`);
