import { List } from "@raycast/api";
import { Workspace } from "../types";
import WorkspaceActions from "./WorkspaceActions";

type WorkspaceListItemProps = {
  workspace: Workspace;
};

export default function WorkspaceListItem({
  workspace
}: WorkspaceListItemProps) {
  console.log('WorkspaceListItem', workspace);
  return <List.Item 
    key={workspace.id}
    title={workspace.title}
    actions={<WorkspaceActions workspace={workspace}/>}
  />
}
