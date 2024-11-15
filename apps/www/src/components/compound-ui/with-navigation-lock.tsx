import { useNavigationLock } from "~/hooks/use-navigation-lock";

interface OpenChangeProps {
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
}

export function withNavigationLock<T extends OpenChangeProps>(
    WrappedDialog: React.ComponentType<T>
) {
    return function NavigationAwareDialog(props: T) {
        const { disableNavigation, enableNavigation } = useNavigationLock();

        return (
            <WrappedDialog
                {...props}
                onOpenChange={(open) => {
                    if (open) {
                        disableNavigation();
                    } else {
                        enableNavigation();
                    }
                    props.onOpenChange?.(open);
                }}
            >
                {props.children}
            </WrappedDialog>
        );
    };
}
