import { Action, ActionPanel, Keyboard } from "@raycast/api";
import { Workspace } from "../types";
import { runAppleScript } from "run-applescript";
import { url } from "inspector";

type WorkspaceActionsProps = {
  workspace: Workspace;
};

async function openUrl(urls: string[]) {

  // workspace.urls = 'https://baidu.com,https://google.com';
  if (!urls || urls.length === 0) {
    return;
  }
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

async function openFile(files: string[]) {
  //用默认程序打开文件夹
  if(!files || files.length === 0){
    return;
  }
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


export default function WorkspaceActions({ workspace }: WorkspaceActionsProps) {
  async function openWorkspace() {

    await openUrl(workspace.urls);
    await openFile(workspace.files);
  }


  return (
    <ActionPanel title={workspace.title}>
      <Action
        title="Open Workspace"
        onAction={openWorkspace}
      />
      <Action.Push
        title="Edit Workspace"
        // target={<EditWorkspace workspace={workspace} />}
        shortcut={Keyboard.Shortcut.Common.Edit} />
    </ActionPanel>
  )
}
