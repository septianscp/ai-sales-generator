import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function ModalConfirm({ onDelete, isLoading, open, setOpen }: { onDelete: () => void, isLoading: boolean, open: boolean, setOpen: (open: boolean) => void }) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete Page</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this page?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button className="cursor-pointer" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button className="cursor-pointer" onClick={onDelete} disabled={isLoading} variant="destructive">{isLoading ? "Deleting..." : "Delete"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}