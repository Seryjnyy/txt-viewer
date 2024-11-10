import {
    LayoutPanelLeft,
    NotebookText,
    PaintbrushIcon,
    SettingsIcon,
    TextCursor,
} from "lucide-react";
import { Button } from "@repo/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@repo/ui/dialog";
import { FontFamilyIcon, KeyboardIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@repo/ui/scroll-area";
import { Tabs, TabsContent } from "@repo/ui/tabs";
import { useMemo, useRef, useState } from "react";
import { FontSelect } from "./font-tab/font-tab";
import { useHotkeys } from "react-hotkeys-hook";
import { TabButton } from "~/components/compound-ui/tab-button";
import { useBorderRadius } from "~/atoms/atoms";
import { AppearanceTab } from "./appearance-tab/appearance-tab";
import { CardTab } from "./card-tab/card-tab";

export const SettingsDialog = () => {
    const dialogTriggerRef = useRef<HTMLButtonElement>(null);
    const [borderRadius, setBorderRadius] = useBorderRadius();
    const SETTINGS_TABS = useMemo(
        () => [
            {
                label: "Font",
                icon: (
                    <FontFamilyIcon className="rounded-sm border border-foreground/10" />
                ),
                comp: <FontSelect />,
            },

            {
                label: "Appearance",
                icon: <PaintbrushIcon className="h-4 w-4" />,
                comp: (
                    <AppearanceTab
                        setBorderRadius={setBorderRadius}
                        borderRadius={borderRadius}
                    />
                ),
            },
            {
                label: "Card",
                icon: <NotebookText className="h-4 w-4" />,
                comp: <CardTab />,
            },
            {
                label: "Grid",
                icon: <LayoutPanelLeft className="h-4 w-4" />,
                comp: (
                    <AppearanceTab
                        setBorderRadius={setBorderRadius}
                        borderRadius={borderRadius}
                    />
                ),
            },
        ],
        [borderRadius, setBorderRadius]
    );
    const [currentTab, setCurrentTab] = useState(SETTINGS_TABS[0].label);
    // useHotkeys(KEYBINDS.SETTINGS.hotkey, () => {
    //   dialogTriggerRef.current?.click()
    // })

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    ref={dialogTriggerRef}
                    variant="secondary"
                    className="group gap-2 p-2"
                    // tooltipContent={KEYBINDS.SETTINGS.label}
                    // tooltipContentProps={{
                    //   className: 'text-xs',
                    // }}
                >
                    <SettingsIcon className="h-4 text-muted-foreground/60 transition-all group-hover:animate-spinOnce group-hover:text-accent-foreground" />
                </Button>
            </DialogTrigger>
            <DialogContent className="flex h-3/4 w-full max-w-5xl overflow-hidden">
                <div className="max-h-full w-fit">
                    <h2 className="mb-4 text-2xl font-bold">Settings</h2>
                    <div className="flex w-[12rem] flex-col gap-2">
                        {SETTINGS_TABS.map((tab, i) => (
                            <TabButton
                                key={tab.label}
                                label={tab.label}
                                icon={tab.icon}
                                tabIndex={i}
                                isActive={currentTab === tab.label}
                                setCurrentTab={setCurrentTab}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex flex-1 flex-col">
                    <h2 className="mb-4 text-xl font-bold">{currentTab}</h2>
                    <ScrollArea className="w-full overflow-y-auto">
                        <Tabs
                            className="pb-8 pl-1 pr-4"
                            value={currentTab}
                            orientation="vertical"
                            defaultValue="font"
                        >
                            {SETTINGS_TABS.map(({ label, comp }) => {
                                return (
                                    <TabsContent key={label} value={label}>
                                        {comp}
                                    </TabsContent>
                                );
                            })}
                        </Tabs>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
};
