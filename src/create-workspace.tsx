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

  // console.log(state);

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
          apps?: [];
          files?: [];
        } = {
          id:nanoid(),
          title: values.title,
        };
        if (values.urls) {
          workspace.urls = values.urls;
        }
        if (values.apps) {
          workspace.apps = values.apps;
        }
        if (values.files) {
          workspace.files = values.files;
        }
        const newWorkspaces = [...state.workspaces, workspace];
        setState((previous) => ({ ...previous, workspaces: newWorkspaces}));
        [state.workspaces, setState]
        console.log(state.workspaces);
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

  });


  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} title="Create Workspace" />
        </ActionPanel>
      }>
      <Form.TextField {...itemProps.title} title="Workspace Title" placeholder="New Workspace" />
      <Form.Separator />
      <Form.TextField {...itemProps.urls} title="URLs" placeholder="please separate with ," />
      <Form.FilePicker id="files" title="Files or Apps" info="Please select your file, folder, App" canChooseDirectories/>
    </Form>
  );
}

export default function Command() {
  // LocalStorage.clear();
  // console.log(LocalStorage.getItem<string>("workspaces"));
  return <CreateWorkspaceForm />;
}
