import { Action, Icon } from "@raycast/api";

function OpenWorkspaceAction(props: { workspace: Workspace; onOpen: (workspace: Workspace) => void }) {
  return (
    <Action
      icon={Icon.List}
      title="Open Workspace"
      onAction={props.onOpen}
    />
  )
}
export default OpenWorkspaceAction;

