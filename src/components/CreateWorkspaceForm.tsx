import { ActionPanel, Detail, List, Action, Form, LocalStorage, Toast, showToast, useNavigation, LaunchProps } from "@raycast/api";
import { useCallback } from "react";
import { Workspace } from "../types";


type State = {
  isLoading: boolean;
  workspaces: Workspace[];
}

export function CreateWorkspaceForm(props: { draftValue?: Workspace; onCreate: (workspace: Workspace) => void; }) {
  const {onCreate, draftValue} = props;
  const { pop } = useNavigation();

  const handleSubmit = useCallback(
    (workspaces: Workspace) => {
      onCreate(workspaces);
      showToast({
        style: Toast.Style.Success,
        title: "Created Workspace",
        message: workspaces.title,
      });
      pop()
    },
    [onCreate, pop]
  );

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} title="Create Workspace" />
        </ActionPanel>
      }>
      <Form.TextField defaultValue={draftValue?.title}
        id="title"
        title="Workspace Title"
        placeholder="New Workspace" />
      <Form.Separator />
      <Form.TextField defaultValue={draftValue?.urls}
        id="urls"
        title="URLs"
        placeholder="please separate with ," />
      <Form.FilePicker
        id="files"
        title="Files or Apps"
        info="Please select your file, folder, App"
        canChooseDirectories />
    </Form>
  );
}

// export default function Command(props: LaunchProps<{ draftValues: Workspace }>) {
//   // LocalStorage.clear();
//   // console.log(LocalStorage.getItem<string>("workspaces"));
//   return <CreateWorkspaceForm draftValue={props.draftValues} />;
// }

export default CreateWorkspaceForm;
