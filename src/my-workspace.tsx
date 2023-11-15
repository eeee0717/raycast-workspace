import { Action, ActionPanel, Color, Icon, List, getPreferenceValues } from "@raycast/api";
import {CreateWorkspaceForm} from "./create-workspace";

export default function Command() {
  return (
    <List
      isLoading={false}
    >

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
