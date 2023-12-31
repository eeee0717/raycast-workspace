import { Toast, showToast, useNavigation } from "@raycast/api";
import { useCallback } from "react";
import { Workspace } from "../types";
import WorkspaceForm from "./WorkspaceForm";

function CreateWorkspaceForm(props: { draftValue?: Workspace; onCreate: (workspace: Workspace) => void }) {
  const { onCreate, draftValue } = props;
  const { pop } = useNavigation();

  const handleSubmit = useCallback(
    (workspace: Workspace) => {
      onCreate(workspace);
      showToast({
        style: Toast.Style.Success,
        title: "Created Workspace",
        message: workspace.title,
      });
      pop();
    },
    [onCreate, pop],
  );

  return <WorkspaceForm draftValue={draftValue} handleSubmit={handleSubmit} />;
}

export default CreateWorkspaceForm;
