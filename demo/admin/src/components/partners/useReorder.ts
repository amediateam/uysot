import { useState } from "react";

// Native HTML5 drag-to-reorder (recovered from the build). `onReorder(from, to)` fires on
// a successful drop; handleProps go on the drag handle, itemProps on the row.
export const useReorder = (onReorder: (from: number, to: number) => void) => {
  const [handleIndex, setHandleIndex] = useState<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const reset = () => {
    setHandleIndex(null);
    setDragging(null);
    setOver(null);
  };
  return {
    dragging,
    over,
    handleProps: (index: number) => ({
      onPointerDown: () => setHandleIndex(index),
      onPointerUp: () => setHandleIndex(null),
    }),
    itemProps: (index: number) => ({
      draggable: handleIndex === index,
      onDragStart: (event: React.DragEvent) => {
        event.dataTransfer.effectAllowed = "move";
        setDragging(index);
      },
      onDragOver: (event: React.DragEvent) => {
        if (dragging !== null) {
          event.preventDefault();
          setOver(index);
        }
      },
      onDrop: (event: React.DragEvent) => {
        event.preventDefault();
        if (dragging !== null && dragging !== index) onReorder(dragging, index);
        reset();
      },
      onDragEnd: reset,
    }),
  };
};
