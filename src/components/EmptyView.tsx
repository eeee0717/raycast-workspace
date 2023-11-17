import { Workspace } from "../types";
import CreateWorkspaceAction from "./CreateWorkspaceAction";
function EmptyView(props: { workspace: Workspace; searchText: string; onCreate: (workspace: Workspace) => void; }) {
  if (props.workspace.length > 0) {
    return (
      <List.EmptyView
        icon="😕"
        title="No matching workspace found"
        description={`Can't find a workspace matching ${props.searchText}.\nCreate it now!`}
        actions={
          <ActionPanel>
            <CreateWorkspaceAction defaultTitle={props.searchText} onCreate={props.onCreate} />
          </ActionPanel>
        }
      />
    );
  }

}

export default EmptyView;
