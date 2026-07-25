import { useEditor, EditorContent } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

import Link from "@tiptap/extension-link";

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Heading2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { useEffect } from "react";


interface RichTextEditorProps {
  value: string;

  onChange: (
    value: string
  ) => void;

  placeholder?: string;

  disabled?: boolean;
}



export default function RichTextEditor({
  value,
  onChange,
  disabled = false,
}: RichTextEditorProps) {


  const editor = useEditor({

    extensions: [

      StarterKit,

      Link.configure({
        openOnClick: false,
      }),

    ],


    content: value,


    editable: !disabled,


    onUpdate({
      editor,
    }) {

      onChange(
        editor.getHTML()
      );

    },

  });



  useEffect(() => {

    if (
      editor &&
      value !== editor.getHTML()
    ) {

      editor.commands.setContent(
        value
      );

    }

  }, [
    value,
    editor,
  ]);



  if (!editor) {
    return null;
  }



  const addLink = () => {

    const url =
      window.prompt(
        "Enter URL"
      );


    if (!url) return;


    editor
      .chain()
      .focus()
      .setLink({
        href: url,
      })
      .run();

  };



  return (

    <div className="rounded-lg border">

      {/* Toolbar */}

      <div className="flex flex-wrap gap-2 border-b p-2">


        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
        >

          <Bold className="h-4 w-4" />

        </Button>



        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
        >

          <Italic className="h-4 w-4" />

        </Button>



        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 2,
              })
              .run()
          }
        >

          <Heading2 className="h-4 w-4" />

        </Button>



        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }
        >

          <List className="h-4 w-4" />

        </Button>



        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          }
        >

          <ListOrdered className="h-4 w-4" />

        </Button>



        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={addLink}
        >

          <LinkIcon className="h-4 w-4" />

        </Button>


      </div>


      {/* Editor */}

      <EditorContent
        editor={editor}
        className="min-h-[250px] p-4 prose max-w-none"
      />

    </div>

  );
}