import { CSSProperties, FC } from "react";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { Typography } from "@mui/material";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

interface Props {
  height?: CSSProperties["height"];
  label?: string;
  value?: string;
  onChange?: (
    value?: string,
    event?: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
}

const MarkdownEditor: FC<Props> = (props) => {
  return (
    <>
      <Typography fontSize={18} pb={1}>
        {props.label}
      </Typography>
      <div data-color-mode="light">
        <MDEditor {...props} preview="edit" />
      </div>
    </>
  );
};

export default MarkdownEditor;
