import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"; // For potentially long lists of suggestions

interface AISuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions: string[];
  onAccept: (suggestion: string) => void;
  title?: string;
}

const AISuggestionsModal: React.FC<AISuggestionsModalProps> = ({
  isOpen,
  onClose,
  suggestions,
  onAccept,
  title = "AI Suggestions",
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {suggestions && suggestions.length > 0 ? (
          <ScrollArea className="max-h-[300px] pr-6"> {/* Adjust max-h as needed */}
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 border rounded-md"
                >
                  <p className="text-sm text-gray-700 flex-1 mr-2">{suggestion}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onAccept(suggestion);
                      onClose(); // Optionally close modal on accept
                    }}
                  >
                    Accept
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <p className="text-sm text-gray-500">No suggestions available at the moment.</p>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AISuggestionsModal;
