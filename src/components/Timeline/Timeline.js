import React, { useEffect } from "react";
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";

import useTimelineLogic from "../../hooks/useTimelineLogic";
import TimelineControls from "../TimelineControls";
import TimelineGrid from "../TimelineGrid";
import TimelineItem from "../TimelineItem";
import styles from "./Timeline.module.css";

const Timeline = ({ items }) => {
  const {
    zoomLevel,
    activeId,
    editingItem,
    editValue,
    timelineItems,
    resizingItem,
    timelineRef,
    lanes,
    timelineWidth,
    timelineHeight,
    monthMarkers,
    LANE_HEIGHT,
    ITEM_HEIGHT,
    ITEM_MARGIN,
    TIMELINE_PADDING,
    getPositionFromDate,
    getItemWidth,
    handleZoomIn,
    handleZoomOut,
    handleDragStart,
    handleDragEnd,
    handleResizeStart,
    handleResizeMove,
    handleResizeEnd,
    startEditing,
    finishEditing,
    handleKeyPress,
    setEditValue,
  } = useTimelineLogic(items);

  useEffect(() => {
    if (resizingItem) {
      document.addEventListener("mousemove", handleResizeMove);
      document.addEventListener("mouseup", handleResizeEnd);
      return () => {
        document.removeEventListener("mousemove", handleResizeMove);
        document.removeEventListener("mouseup", handleResizeEnd);
      };
    }
  }, [resizingItem, handleResizeMove, handleResizeEnd]);

  const activeItem = activeId
    ? timelineItems.find((item) => item.id === activeId)
    : null;

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToHorizontalAxis]}
    >
      <div className={styles.container}>
        <TimelineControls
          zoomLevel={zoomLevel}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
        />

        <div className={styles.wrapper}>
          <div
            ref={timelineRef}
            className={styles.timelineContainer}
            style={{
              width: `${timelineWidth}px`,
              height: `${timelineHeight}px`,
              position: "relative",
            }}
          >
            <TimelineGrid
              monthMarkers={monthMarkers}
              timelineHeight={timelineHeight}
              timelinePadding={TIMELINE_PADDING}
            />

            {lanes.map((lane, laneIndex) =>
              lane.map((item) => {
                const x = getPositionFromDate(item.start);
                const y =
                  laneIndex * LANE_HEIGHT + ITEM_MARGIN + TIMELINE_PADDING / 2;
                const width = getItemWidth(item);

                return (
                  <TimelineItem
                    key={item.id}
                    item={item}
                    x={x}
                    y={y}
                    width={width}
                    height={ITEM_HEIGHT}
                    editingItem={editingItem}
                    editValue={editValue}
                    setEditValue={setEditValue}
                    startEditing={startEditing}
                    finishEditing={finishEditing}
                    handleKeyPress={handleKeyPress}
                    onResizeStart={handleResizeStart}
                    isResizing={resizingItem?.id === item.id}
                  />
                );
              })
            )}
          </div>
        </div>

        <DragOverlay>
          {activeItem ? (
            <div
              className={styles.dragOverlay}
              style={{
                width: getItemWidth(activeItem),
                height: ITEM_HEIGHT,
              }}
            >
              {activeItem.name}
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default Timeline;
