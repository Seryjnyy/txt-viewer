import { ThemeProvider } from "@repo/ui/components/theme-provider";
import { Toaster } from "@repo/ui/components/ui/toaster";
import { useEffect } from "react";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "~/components/ui/resizable";
import MainDialog from "./components/main-dialog";

import FileExplorer from "./components/ui/file-explorer";
import Sidebar from "./components/ui/sidebar";
import TabbedView from "./components/ui/tabbed-view";
import Titlebar from "./components/ui/titlebar";
import NewVault from "./components/ui/vault-manager";

import { produce } from "immer";
import NoteViewer from "./components/note-viewer";
import CommandBox from "./components/ui/command-box";
import FileSearchBox from "./components/ui/file-search-box";
import { useUiState } from "./lib/ui-store";
import { useWorkspaceConfig } from "./lib/workspace-store";

function App() {
    // TODO : Should probably in component to reduce rerendering everything, or does zustand prevent that, I can't remember
    const uiState = useUiState.use.uiState();
    const setUiState = useUiState.use.setUiState();
    const workspace = useWorkspaceConfig.use.currentWorkspace();
    // const setWorkspacePath = useWorkspaceConfig(
    //     (state) => state.setCurrentWorkspace
    // );

    useEffect(() => {
        const setUp = async () => {
            // const res = await invoke("get_current_workspace");
            // if (typeof res == "string") {
            // TODO : Check if actual directory
            // TODO : Check if have access to it
            // const config = JSON.parse(res) as WorkspaceConfig;
            // console.log("getting workspace", config.currentWorkspace);
            // if (config.currentWorkspace == "") {
            //     return;
            // }
            // setWorkspacePath(config.currentWorkspace);
            // }
            if (!workspace) {
                setUiState(
                    produce(uiState, (draft) => {
                        draft.section = "vault-manager";
                    })
                );
            } else {
                console.log("there is a workspace");
                setUiState(
                    produce(uiState, (draft) => {
                        draft.section = "note-manager";
                    })
                );
            }
        };

        setUp();
    }, []);

    useEffect(() => {
        if (workspace) {
            setUiState(
                produce(uiState, (draft) => {
                    draft.section = "note-manager";
                })
            );
        } else {
            setUiState(
                produce(uiState, (draft) => {
                    draft.section = "vault-manager";
                })
            );
        }
    }, [workspace]);

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className={` w-full h-screen flex flex-col  pt-7 `}>
                <Titlebar />
                {/* <MinimalTitlebar /> */}
                {uiState.section == "vault-manager" && <NewVault />}
                {(uiState.section == "note-viewer" ||
                    uiState.section == "note-manager") && (
                    <div className="h-screen overflow-hidden flex  ">
                        {uiState.sidebar && <Sidebar />}

                        <ResizablePanelGroup
                            direction="horizontal"
                            className="w-full     "
                        >
                            {uiState.sideSection != "none" && (
                                <ResizablePanel
                                    minSize={28}
                                    id="file-explorer"
                                    order={1}
                                >
                                    {uiState.sideSection == "file-explorer" && (
                                        <FileExplorer />
                                    )}
                                </ResizablePanel>
                            )}
                            <ResizableHandle className="hover:bg-primary transition-all border-none bg-transparent " />

                            <ResizablePanel
                                className="bg-background border-l border-secondary"
                                id="main-content"
                                order={2}
                            >
                                {uiState.section == "note-manager" && (
                                    <div>
                                        <TabbedView />
                                    </div>
                                )}
                                {uiState.section == "note-viewer" && (
                                    <div className="w-full ">
                                        {/* <MainPage /> */}
                                        <NoteViewer />
                                    </div>
                                )}
                            </ResizablePanel>
                        </ResizablePanelGroup>

                        <MainDialog />
                    </div>
                )}
                <Toaster />

                <CommandBox />
                <FileSearchBox />
            </div>
        </ThemeProvider>
    );
}

export default App;
