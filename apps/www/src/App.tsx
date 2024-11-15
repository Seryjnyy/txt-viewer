import { ExclamationTriangleIcon, UpdateIcon } from "@radix-ui/react-icons";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@repo/ui/components/ui/alert";
import { Button } from "@repo/ui/components/ui/button";
import DropZone from "@repo/ui/components/ui/sections/drop-zone";
import { Toaster } from "@repo/ui/components/ui/toaster";
import { TooltipProvider } from "@repo/ui/components/ui/tooltip";
import { Circle } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";
import NoteCard from "./components/compound-ui/note-card.js";
import { ThemeSwitcherList } from "./components/theme-switcher-list.js";
import { useNotes } from "./hooks/use-notes.js";
import { cn } from "./lib/utils.js";

import { ReactNode, useCallback } from "react";
import SkipToNavLink from "./components/skip-to-nav-link.js";
import NoteNav from "./components/toolbar/note-nav.js";
import Toolbar from "./components/toolbar/toolbar.js";
import {
    NoteListProvider,
    useNoteList,
} from "./providers/note-list-provider.js";
import { useNoteDisplaySettings } from "./stores/note-display-settings-store.js";

function App() {
    return (
        <>
            <TooltipProvider>
                <Main />
            </TooltipProvider>
            <Toaster />
        </>
    );
}

const Main = () => {
    const { notes } = useNotes();
    const hasNotes = notes.length > 0;

    return (
        <main className="bg-background ">
            <header className="pt-4">
                <h1 className="sr-only">Txt viewer</h1>
            </header>

            {!hasNotes && (
                <section className="w-3/4 mx-auto">
                    <h2 className="text-muted-foreground text-center text-sm">
                        ADD TXT FILES
                    </h2>
                    <div
                        className={cn(
                            " py-2",
                            !hasNotes ? "h-[80vh]" : "h-[10rem]"
                        )}
                    >
                        <DropZone />
                    </div>

                    <div className="">
                        <ThemeSwitcherList />
                    </div>
                </section>
            )}
            {hasNotes && (
                <section className="w-full h-fit  pt-4 mt-4 ">
                    <SkipToNavLink />
                    <h2 className="text-muted-foreground text-center text-sm">
                        YOUR NOTES
                    </h2>

                    <ErrorBoundary
                        fallback={
                            <div className="flex flex-col gap-4 pt-8 px-8">
                                <Alert variant="destructive">
                                    <ExclamationTriangleIcon className="h-4 w-4" />
                                    <AlertTitle>
                                        Something went wrong
                                    </AlertTitle>
                                    <AlertDescription>
                                        Refresh the page, if error persists try
                                        resetting <br />
                                        preferences. If nothing works please let
                                        me know.
                                    </AlertDescription>
                                </Alert>
                                <Button
                                    className="space-x-2"
                                    // onClick={onResetPreferences}
                                >
                                    <span>Reset preferences</span>{" "}
                                    <UpdateIcon />
                                </Button>
                            </div>
                        }
                    >
                        <NoteListProvider>
                            <div className="mb-40 sm:mb-16 ">
                                <Notes />
                            </div>
                            <BottomToolbarAndNav />
                        </NoteListProvider>
                    </ErrorBoundary>
                </section>
            )}
        </main>
    );
};

const BottomToolbarAndNav = () => {
    return (
        <div className="bottom-0 fixed left-0   flex justify-center w-full">
            <div
                className="flex  border-t border-l rounded-t-[var(--radius)] backdrop-blur-md border-r  w-fit flex-wrap"
                tabIndex={-1}
                id="main-nav"
            >
                <div className="z-50  p-2  w-full ">
                    <Toolbar />
                </div>
                <div className="  p-2 w-fit mx-auto">
                    <NoteNav />
                </div>
            </div>
        </div>
    );
};

const NotesList = ({ children }: { children: ReactNode }) => {
    const cols = useNoteDisplaySettings.use.cols();
    const colsGap = useNoteDisplaySettings.use.colsGap();
    const paddingX = useNoteDisplaySettings.use.paddingX();
    const paddingY = useNoteDisplaySettings.use.paddingY();

    return (
        <ul
            className="grid"
            style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gap: `${colsGap}px`,
                padding: `${paddingY}px ${paddingX}px`,
            }}
        >
            {children}
        </ul>
    );
};

const SingleNote = ({
    removeNote,
}: {
    removeNote: (noteID: string) => void;
}) => {
    const paddingX = useNoteDisplaySettings.use.paddingX();
    const paddingY = useNoteDisplaySettings.use.paddingY();
    const { notes, activeIndex, setActiveIndex } = useNoteList();

    const handleRemoveNote = useCallback(
        (noteID: string) => {
            removeNote(noteID);

            if (activeIndex >= notes.length - 1) {
                setActiveIndex(activeIndex - 1);
            }
        },
        [activeIndex, notes, removeNote]
    );

    const getNote = useCallback(() => {
        if (notes.length == 0 || activeIndex < 0 || activeIndex >= notes.length)
            return null;

        const note = notes[activeIndex];
        return (
            <NoteCard note={note} key={note.id} onDelete={handleRemoveNote} />
        );
    }, [notes, activeIndex]);

    return (
        <div
            className="mb-16"
            style={{
                padding: `${paddingY}px ${paddingX}px`,
            }}
        >
            <div className="relative">
                {getNote()}
                <div className="absolute bottom-2  right-2">
                    <Circle className="size-3 text-primary" />
                </div>
            </div>
        </div>
    );
};

const Notes = () => {
    const { removeNote } = useNotes(); // TODO : useNoteList context already uses this hook, should it get it from there?
    const { notes, activeIndex, setActiveIndex, getRef } = useNoteList();
    const display = useNoteDisplaySettings.use.display();

    if (display === "slideshow") return <SingleNote removeNote={removeNote} />;

    // TODO : rerenders everything every time notes are navigated, could be a issue with lots of notes
    // TODO : should this be virtualized?
    return (
        <NotesList>
            {notes.map((note, index) => (
                <li
                    key={note.id}
                    ref={getRef(note.id)}
                    onClick={() => setActiveIndex(index)}
                    className={`relative`}
                >
                    <NoteCard note={note} onDelete={removeNote} />
                    {index === activeIndex && (
                        <div className="absolute bottom-2  right-2">
                            {/* <Circle className="size-3 text-primary" /> */}
                            <div className="size-3 border-2 border-primary rounded-[var(--radius)]"></div>
                        </div>
                    )}
                </li>
            ))}
        </NotesList>
    );
};

export default App;
