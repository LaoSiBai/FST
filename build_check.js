import { exec } from 'child_process';
exec('npm run build', (err, stdout, stderr) => {
    console.log("STDOUT:", stdout);
    console.error("STDERR:", stderr);
});
