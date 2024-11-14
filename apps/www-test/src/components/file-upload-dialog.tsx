import { Button } from "@repo/ui/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import DropZone from "@repo/ui/components/ui/sections/drop-zone";
import { Label } from "@repo/ui/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/ui/radio-group";
import { Upload } from "lucide-react";
import { NavigationAwareDialog } from "./compound-ui/navigation-aware-components";
import { useState } from "react";

export default function FileUploadDialog() {
    const [open, setOpen] = useState(false);

    return (
        <NavigationAwareDialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size={"icon"}
                    variant={"secondary"}
                    onClick={() => window.scrollTo(0, 0)}
                >
                    <Upload className="text-primary size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add txt files</DialogTitle>
                    <DialogDescription className="sr-only">
                        Select some txt files to view. Chose to add the notes or
                        replace the existing notes.
                    </DialogDescription>
                </DialogHeader>
                <DropZone onSuccess={() => setOpen(false)} />
                <RadioGroup defaultValue="option-one" className="flex">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-one" id="option-one" />
                        <Label>Add</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-two" id="option-two" />
                        <Label>Replace</Label>
                    </div>
                </RadioGroup>
            </DialogContent>
        </NavigationAwareDialog>
    );
}