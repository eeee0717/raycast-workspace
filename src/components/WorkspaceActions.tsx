import { Action, ActionPanel, Keyboard } from "@raycast/api";
import { Workspace } from "../types";
import { runAppleScript } from "run-applescript";
import { url } from "inspector";

type WorkspaceActionsProps = {
  workspace: Workspace;
};



export default function WorkspaceActions({ workspace }: WorkspaceActionsProps) {
  async function openWorkspace() {

    // workspace.urls = 'https://baidu.com,https://google.com';
    const urls = workspace.urls.split(',');
    console.log(urls);
    for (const url of urls) {
      await runAppleScript(`open location "${url}"`);
    }

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
