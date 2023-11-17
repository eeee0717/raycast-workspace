import { runAppleScript } from "run-applescript";

export async function openUrl(urls: string[]) {

  // workspace.urls = 'https://baidu.com,https://google.com';
  urls = urls.split(',');
  // 修除空格
  urls.forEach((url, index) => {
    urls[index] = url.trim();
  })
  console.log(urls);
  for (const url of urls) {
    await runAppleScript(`open location "${url}"`);
  }
}

export async function openFile(files: string[]) {
  //用默认程序打开文件夹
  console.log(files.length);
  for (const file of files) {
    console.log(file);
    await runAppleScript(`
      tell application "Finder"
        open POSIX file "${file}"
      end tell
    `);
  }

}
