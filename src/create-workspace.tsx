import { ActionPanel, Detail, List, Action, Form, LocalStorage } from "@raycast/api";
import { FormValidation, MutatePromise, useForm } from "@raycast/utils";
import { useState,useEffect } from "react";
import { runAppleScript } from "run-applescript";
import { Workspace } from "./types";
import { nanoid } from "nanoid";

type State={
  isLoading: boolean;
  workspaces:Workspace[];
}

export function CreateWorkspaceForm() {
  const [state, setState] = useState<State>({
    isLoading: true,
    workspaces:[]
  });

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


  const { itemProps, handleSubmit, focus, values, setValue } = useForm<Workspace>({
    validation: {
      title: FormValidation.Required,
    },
    async onSubmit(values) {
      try {
        const workspace: {
          id:string;
          title: string;
          urls?: [];
        } = {
          id:nanoid(),
          title: values.title,
        };
        if (values.urls) {
          workspace.urls = values.urls;
        }
        const newWorkspaces = [...state.workspaces, workspace];
        setState((previous) => ({ ...previous, workspaces: newWorkspaces}));
        [state.workspaces, setState]

      } catch (error) {
        console.log(error);
        const message = error instanceof Error ? error.message : JSON.stringify(error);

        await showToast({
          style: Toast.Style.Failure,
          title: "Unable to create workspace",
          message,
        });
      }
    },
    async clearWorkspace(){
      LocalStorage.removeItem("workspaces");
    }
  });


  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} title="Create Workspace" />
          <Action.SubmitForm clearWorkspace={handleSubmit} title="Clear Workspace"/>
        </ActionPanel>
      }>
      <Form.TextField {...itemProps.title} title="Workspace Title" placeholder="New Workspace" />
      <Form.Separator />
      <Form.TextField {...itemProps.urls} title="URLs" placeholder="please separate with ;" />


    </Form>
  );
}

export default function Command() {
  // LocalStorage.clear();
  // console.log(LocalStorage.getItem<string>("workspaces"));
  return <CreateWorkspaceForm />;
}
