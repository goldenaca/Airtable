import React from "react";
import { useDraggable } from "@dnd-kit/core";
import styles from "./TimelineItem.module.css";

const TimelineItem = ({
  item,
  x,
  y,
  width,
  height,
  editingItem,
  editValue,
  setEditValue,
  startEditing,
  finishEditing,
  handleKeyPress,
  onResizeStart,
  isResizing,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
      data: { item },
    });

  const itemStyle = {
    position: "absolute",
    left: `${x}px`,
    top: `${y}px`,
    width: `${width}px`,
    height: `${height}px`,
    transform: transform ? `translate3d(${transform.x}px, 0, 0)` : undefined,
  };

  const handleResizeMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onResizeStart(e, item);
  };

  const itemClasses = [
    styles.timelineItem,
    isDragging && styles.dragging,
    isResizing && styles.resizing,
  ]
    .filter(Boolean)
    .join(" ");

  const resizeHandleClasses = [
    styles.resizeHandle,
    isResizing && styles.resizing,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={setNodeRef}
      style={itemStyle}
      className={itemClasses}
      title={`${item.name}\n${item.start} to ${item.end}`}
      {...attributes}
    >
      <div className={styles.itemBackground} {...listeners}>
        <div className={styles.itemContent}>
          {editingItem === item.id ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={finishEditing}
              onKeyDown={handleKeyPress}
              className={styles.itemInput}
              autoFocus
            />
          ) : (
            <div className={styles.itemText} onClick={() => startEditing(item)}>
              {item.name}
            </div>
          )}
        </div>
      </div>

      <div
        className={resizeHandleClasses}
        onMouseDown={handleResizeMouseDown}
      />
    </div>
  );
};

export default TimelineItem;
