import { Action, ActionPanel, Color, Icon, List, getPreferenceValues, LocalStorage } from "@raycast/api";
import {CreateWorkspaceForm} from "./create-workspace";
import { Workspace } from "./types";
import { useState,useEffect } from "react";
import WorkspaceListItem from "./components/WorkspaceListItem";

type State={
  isLoading: boolean;
  workspaces:Workspace[];
}

export default function Command() {
  const [state, setState] = useState<State>({
    isLoading: true,
    workspaces:[]
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
        setState((previous) => ({ ...previous, workspaces: [], isLoading: false }));
      }
    })();
  }, []);
  // console.log(state);



  return (
    <List
      isLoading={false}
    >
      {state.workspaces.map((workspace) =>  (
        <List.Section key = {workspace.id}>
          <WorkspaceListItem workspace={workspace}/>
        </List.Section>
        
      ))}

      <List.EmptyView
        title="No Workspace"
        description="Create a new workspace by pressing the ⏎ key."
        actions={
          <ActionPanel>
            <Action.Push
              title="Create workspace"
              icon={Icon.Plus}
              target={<CreateWorkspaceForm/>}
            >

            </Action.Push>
          </ActionPanel>
        }
      >
      </List.EmptyView>
    </List>
  )
}
