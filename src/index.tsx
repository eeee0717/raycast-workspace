import { ActionPanel, List, LocalStorage,showToast,Toast } from "@raycast/api";
import { Workspace } from "./types";
import { useState, useEffect, useCallback } from "react";
import { CreateWorkspaceAction, DeleteWorkspaceAction, OpenWorkspaceAction } from "./components";
import { nanoid } from "nanoid";
import { openFile, openUrl } from "./api";


type State = {
  isLoading: boolean;
  workspaces: Workspace[];
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
      if (workspace.urls?.length===0 && workspace.files?.length===0) {
        console.log('handleOpenError');
        await showToast({
          style: Toast.Style.Failure,
          title: "Content is Empty",
          message: "Please add URLs or Files",
        });
      }
      await openUrl(workspace.urls);
      await openFile(workspace.files);
    },
  );

  return (
    <List
      isLoading={state.isLoading}
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
