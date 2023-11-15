import { ActionPanel, Detail, List, Action, Form } from "@raycast/api";

export function CreateWorkspaceForm() {
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm  title="Create Workspace"/>
        </ActionPanel>
      }>

    </Form>
  );
}
