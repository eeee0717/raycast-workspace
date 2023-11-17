import { Action, ActionPanel, Color, Icon, List, getPreferenceValues, LocalStorage } from "@raycast/api";
import { Workspace } from "./types";
import { useState, useEffect, useCallback } from "react";
import { CreateWorkspaceAction, DeleteWorkspaceAction, EmptyView, OpenWorkspaceAction } from "./components";
import { nanoid } from "nanoid";
import { runAppleScript } from "run-applescript";

type State = {
  isLoading: boolean;
  workspaces: Workspace[];
}

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
  if (!files || files.length === 0) {
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


export default function Command() {

  const [state, setState] = useState<State>({
    isLoading: true,
    workspaces: []
  });
  // 读取workspaces
  useEffect(() => {
    (async () => {
      const storedWorkspaces = await LocalStorage.getItem<string>("workspaces");

      if (!storedWorkspaces) {
        setState((previous) => ({ ...previous, isLoading: false }));
        return;
      }

      try {
        const workspaces: Workspace[] = JSON.parse(storedWorkspaces);
        setState((previous) => ({ ...previous, workspaces, isLoading: false }));
      } catch (e) {
        // can't decode todos
        setState((previous) => ({ ...previous, workspaces: [], isLoading: false }));
      }
    })();
  }, []);

  useEffect(() => {
    LocalStorage.setItem("workspaces", JSON.stringify(state.workspaces));
  }, [state.workspaces]);

  const handleCreate = useCallback(
    (workspace: Workspace) => {
      workspace.id = nanoid();
      const newWorkspaces = [...state.workspaces, workspace];
      setState((previous) => ({ ...previous, workspaces: newWorkspaces }));
    },
    [state.workspaces, setState]
  );

  console.log(state.workspaces);

  const handleDelete = useCallback(
    (index: number) => {
      const newWorkspaces = [...state.workspaces];
      newWorkspaces.splice(index, 1);
      setState((previous) => ({ ...previous, workspaces: newWorkspaces }));
    },
    [state.workspaces, setState]
  );

  const handleOpen = useCallback(
    async (workspace: Workspace) => {
      console.log('handleOpen');
      console.log(workspace);
      await openUrl(workspace.urls);
      await openFile(workspace.files);
    },
  );

  return (
    <List
      isLoading={false}
    >
      {state.workspaces.map((workspace, index) => (
        <List.Item
          key={workspace.id}
          title={workspace.title}
          actions={
            <ActionPanel>
              <OpenWorkspaceAction onOpen={() => handleOpen(workspace)} />
              <CreateWorkspaceAction onCreate={handleCreate} />
              <DeleteWorkspaceAction onDelete={() => handleDelete(index)} />
            </ActionPanel>
          }
        />

      ))}

      <List.EmptyView
        title="No Workspace"
        description="Create a new workspace by pressing the ⏎ key."
        actions={
          <ActionPanel>
            <CreateWorkspaceAction onCreate={handleCreate} />
          </ActionPanel>
        }
      />
    </List>
  )
}
