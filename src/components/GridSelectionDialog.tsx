import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { useGrid } from "@/app/components/providers/gridProvider";

interface GridSection {
  title: string;
  grid: any[];
  gridColumns: number;
  visibility?: "public" | "private";
  isPrivate?: boolean; // Legacy property
}

interface GridSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sections: GridSection[];
  appName: string;
  onGridSelect: (gridIndex: number) => void;
  onCancel: () => void;
}

export default function GridSelectionDialog({ 
  open, 
  onOpenChange, 
  sections, 
  appName, 
  onGridSelect,
  onCancel 
}: GridSelectionDialogProps) {
  const [selectedGridIndex, setSelectedGridIndex] = useState<string>("");
  const { isLoading, error } = useGrid();

  // Debug logging
  // Separate public and private grids - handle both old and new schema
  const publicGrids = sections.filter(section => {
    // New schema: visibility === "public"
    if (section.visibility !== undefined) {
      return section.visibility === "public";
    }
    // Legacy schema: isPrivate === false (or undefined, default to public)
    return section.isPrivate === false || section.isPrivate === undefined;
  });

  const privateGrids = sections.filter(section => {
    // New schema: visibility === "private"  
    if (section.visibility !== undefined) {
      return section.visibility === "private";
    }
    // Legacy schema: isPrivate === true
    return section.isPrivate === true;
  });
  
  const handleDone = () => {
    if (selectedGridIndex) {
      onGridSelect(parseInt(selectedGridIndex));
    }
  };

  const handleCancel = () => {
    setSelectedGridIndex("");
    onCancel();
  };

  const handleClose = () => {
    setSelectedGridIndex("");
    onOpenChange(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md mx-auto p-0 rounded-xl overflow-hidden">
          <div className="bg-white relative">
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6">
              <DialogHeader className="space-y-3 text-center mb-6">
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Clone widget
                </DialogTitle>
                <p className="text-sm text-gray-600">
                  Loading your grids...
                </p>
              </DialogHeader>

              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Show error state
  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md mx-auto p-0 rounded-xl overflow-hidden">
          <div className="bg-white relative">
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6">
              <DialogHeader className="space-y-3 text-center mb-6">
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Clone widget
                </DialogTitle>
                <p className="text-sm text-red-600">
                  Error loading grids: {error}
                </p>
              </DialogHeader>

              <div className="flex justify-center">
                <Button 
                  onClick={handleCancel}
                  variant="outline"
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // If no sections are available, show a message
  if (!sections || sections.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md mx-auto p-0 rounded-xl overflow-hidden">
          <div className="bg-white relative">
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6">
              <DialogHeader className="space-y-3 text-center mb-6">
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Clone widget
                </DialogTitle>
                <p className="text-sm text-gray-600">
                  No grids found on your Universal Profile. Please create a grid first.
                </p>
              </DialogHeader>

              <div className="flex justify-center">
                <Button 
                  onClick={handleCancel}
                  variant="outline"
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto p-0 rounded-xl overflow-hidden">
        <div className="bg-white relative">
          {/* Close button */}
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="p-6">
            <DialogHeader className="space-y-3 text-center mb-6">
              <DialogTitle className="text-xl font-bold text-gray-900">
                Clone widget
              </DialogTitle>
              <p className="text-sm text-gray-600">
                Please select to which Grid you want to clone this widget.
              </p>
            </DialogHeader>

            <div className="space-y-6">
              {/* Grid Selection Dropdown */}
              <div>
                <Select value={selectedGridIndex} onValueChange={setSelectedGridIndex}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a grid..." />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Public Grids Section */}
                    {publicGrids.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          PUBLIC GRIDS
                        </div>
                        {publicGrids.map((grid, index) => {
                          const originalIndex = sections.findIndex(s => s.title === grid.title);
                          return (
                            <SelectItem key={`public-${grid.title}`} value={originalIndex.toString()}>
                              <div className="flex flex-col items-start">
                                <span className="font-medium">{grid.title}</span>
                                <span className="text-xs text-gray-500">
                                  {grid.grid.length} widget{grid.grid.length !== 1 ? 's' : ''} • {grid.gridColumns} columns
                                </span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </>
                    )}

                    {/* My Apps / Private Grids Section */}
                    {privateGrids.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mt-2">
                          MY APPS
                        </div>
                        {privateGrids.map((grid, index) => {
                          const originalIndex = sections.findIndex(s => s.title === grid.title);
                          return (
                            <SelectItem key={`private-${grid.title}`} value={originalIndex.toString()}>
                              <div className="flex flex-col items-start">
                                <span className="font-medium">{grid.title}</span>
                                <span className="text-xs text-gray-500">
                                  {grid.grid.length} widget{grid.grid.length !== 1 ? 's' : ''} • {grid.gridColumns} columns
                                </span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleDone}
                  disabled={!selectedGridIndex}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 