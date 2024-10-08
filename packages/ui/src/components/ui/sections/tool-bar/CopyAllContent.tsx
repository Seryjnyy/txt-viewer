import { CopyIcon } from "@radix-ui/react-icons";
import { useNoteStore } from "@repo/lib/note-store";
import { Button } from "../../button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../tooltip";

import useClipboard from "@repo/lib/use-clipboard";
import { useMemo } from "react";
export default function CopyAllContent() {
    const clipboard = useClipboard();
    const notes = useNoteStore((state) => state.notes);

    const content = useMemo(() => {
        return notes.length > 0
            ? notes
                  .map((note) => note.content)
                  .reduce((prev, currVal) => prev + "\n\n" + currVal)
            : "";
    }, [notes]);

    console.log(content);

    const onCopy = () => {
        clipboard
            .copyToClipboard(content)
            .then(() => {
                // TODO : implement
            })
            .catch(() => {
                // TODO : implement
            });
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant={"ghost"}
                        onClick={onCopy}
                        disabled={content == ""}
                    >
                        <CopyIcon />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                    <p>Copy all content</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
