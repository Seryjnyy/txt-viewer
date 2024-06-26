import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "../use-toast";
import { useNoteStore } from "@repo/lib/note-store";
import { Note } from "@repo/lib/types";
import { guidGenerator } from "@repo/lib/metadata-utils";
import { usePreferenceStore } from "@repo/lib/preference-store";
import { sortNotes } from "@repo/lib/note-sorting";

export default function DropZone() {
  const setNotes = useNoteStore((state) => state.setNotes);
  const settings = usePreferenceStore((state) => state.settings);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const readInNotes: Note[] = [];

      for (const file of acceptedFiles) {
        console.log(file.type);
        if (file.type != "text/plain") {
          console.log("wrong type");
          toast({
            variant: "destructive",
            title: "Wrong type of file provided",
            description: `Only text/plain files allowed, you added a ${file.type}.`,
          });
          continue;
        }

        const txt = await file.text();
        readInNotes.push({
          id: guidGenerator(),
          fileName: file.name,
          content: txt,
          size: file.size,
          lastModified: file.lastModified,
          characterCount: txt.length,
        });
      }

      setNotes(sortNotes(readInNotes.slice(), settings));
    },
    [settings]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <div
        {...getRootProps()}
        className="border p-8 flex justify-center items-center w-full hover:ring ring-primary cursor-pointer rounded-lg"
      >
        <input {...getInputProps()} className="border" />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
    </>
  );
}
