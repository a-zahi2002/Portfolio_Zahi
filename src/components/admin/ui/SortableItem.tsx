import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  id: string;
  children: (props: {
    ref: (node: HTMLElement | null) => void;
    style: React.CSSProperties;
    dragHandleProps: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      attributes: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      listeners: any;
    };
    isDragging: boolean;
  }) => React.ReactNode;
}

export const SortableItem: React.FC<SortableItemProps> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <>
      {children({
        ref: setNodeRef,
        style,
        dragHandleProps: { attributes, listeners },
        isDragging,
      })}
    </>
  );
};

export default SortableItem;
