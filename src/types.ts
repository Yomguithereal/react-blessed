import * as blessed from "blessed";
declare global {
  namespace JSX {
    interface IntrinsicElements {
      element: any;
      box: any;
      // @ts-ignore
      text: any;
      // @ts-ignore
      line: any;
      scrollablebox: any;
      scrollabletext: any;
      bigtext: any;
      list: any;
      filemanager: any;
      listtable: any;
      listbar: any;
      // @ts-ignore
      form: any;
      // @ts-ignore
      input: any;
      // @ts-ignore
      textarea: any;
      textbox: any;
      // @ts-ignore
      button: any;
      checkbox: any;
      radioset: any;
      radiobutton: any;
      // @ts-ignore
      table: any;
      prompt: any;
      question: any;
      message: any;
      loading: any;
      progressbar: any;
    }
  }
}

export type Instance = {
  type: Type;
  eventListener: (channel: any, event: any) => void;
  isUpdating: boolean;
  props: Record<string, any>;
  element: blessed.Widgets.BlessedElement;
};
export type TextInstance = Instance;

export type Type =
  | "element"
  | "box"
  | "text"
  | "line"
  | "scrollablebox"
  | "scrollabletext"
  | "bigtext"
  | "list"
  | "filemanager"
  | "listtable"
  | "listbar"
  | "form"
  | "input"
  | "textarea"
  | "textbox"
  | "button"
  | "checkbox"
  | "radioset"
  | "radiobutton"
  | "table"
  | "prompt"
  | "question"
  | "message"
  | "loading"
  | "progressbar";
export type Props = Record<string, any>;
export type Container = blessed.Widgets.BlessedElement;
export type HydratableInstance = Instance;
export type PublicInstance = Instance;
export type HostContext = {};
export type UpdatePayload = unknown;
export type ChildSet = unknown;
export type TimeoutHandle = unknown;
export type NoTimeout = null;
