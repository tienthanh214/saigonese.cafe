import { $ } from 'zx';

const dataFolderExists = await $`[ -d ./data ] && echo "true" || echo "false"`;

if (dataFolderExists.stdout.trim() === "false") {
  await $`git clone https://github.com/monodyle/awesome-saigon-coffee.git data`;
  await $`rm -rf ./data/.git`;
}

await $`node ./scripts/process.mjs`;
