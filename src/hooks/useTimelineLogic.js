import { useState, useRef, useCallback } from "react";
import assignLanes from "../assignLanes.js";

const useTimelineLogic = (items) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeId, setActiveId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [timelineItems, setTimelineItems] = useState(items);
  const [resizingItem, setResizingItem] = useState(null);
  const timelineRef = useRef(null);

  const dates = timelineItems
    .map((item) => [new Date(item.start), new Date(item.end)])
    .flat();
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));
  const totalDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)) + 1;

  const lanes = assignLanes(timelineItems);

  const LANE_HEIGHT = 60;
  const ITEM_HEIGHT = 40;
  const ITEM_MARGIN = 10;
  const TIMELINE_PADDING = 40;
  const BASE_DAY_WIDTH = 30;
  const dayWidth = BASE_DAY_WIDTH * zoomLevel;

  const timelineWidth = totalDays * dayWidth + TIMELINE_PADDING * 2;
  const timelineHeight = lanes.length * LANE_HEIGHT + TIMELINE_PADDING;

  const getPositionFromDate = (date) => {
    const daysDiff = Math.ceil(
      (new Date(date) - minDate) / (1000 * 60 * 60 * 24)
    );
    return daysDiff * dayWidth + TIMELINE_PADDING;
  };

  const getDateFromPosition = (x) => {
    const daysDiff = Math.round((x - TIMELINE_PADDING) / dayWidth);
    const newDate = new Date(minDate);
    newDate.setDate(newDate.getDate() + daysDiff);
    return newDate.toISOString().split("T")[0];
  };

  const getItemWidth = (item) => {
    const startDate = new Date(item.start);
    const endDate = new Date(item.end);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(days * dayWidth, 80);
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev * 1.5, 5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev / 1.5, 0.2));

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, delta } = event;

    if (delta.x !== 0) {
      const item = timelineItems.find((item) => item.id === active.id);
      if (item) {
        const itemDuration = new Date(item.end) - new Date(item.start);
        const newStartDate = getDateFromPosition(
          getPositionFromDate(item.start) + delta.x
        );
        const newEndDate = new Date(
          new Date(newStartDate).getTime() + itemDuration
        );

        setTimelineItems((prev) =>
          prev.map((prevItem) =>
            prevItem.id === active.id
              ? {
                  ...prevItem,
                  start: newStartDate,
                  end: newEndDate.toISOString().split("T")[0],
                }
              : prevItem
          )
        );
      }
    }

    setActiveId(null);
  };

  const handleResizeStart = (e, item) => {
    const rect = timelineRef.current.getBoundingClientRect();
    const startX = e.clientX - rect.left;

    setResizingItem({
      ...item,
      startX,
      originalEnd: item.end,
    });
  };

  const handleResizeMove = useCallback(
    (e) => {
      if (!resizingItem) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const deltaX = currentX - resizingItem.startX;

      const newEndDate = getDateFromPosition(
        getPositionFromDate(resizingItem.originalEnd) + deltaX
      );

      if (newEndDate >= resizingItem.start) {
        setTimelineItems((prev) =>
          prev.map((item) =>
            item.id === resizingItem.id ? { ...item, end: newEndDate } : item
          )
        );
      }
    },
    [resizingItem, getDateFromPosition, getPositionFromDate]
  );

  const handleResizeEnd = useCallback(() => {
    setResizingItem(null);
  }, []);

  const startEditing = (item) => {
    setEditingItem(item.id);
    setEditValue(item.name);
  };

  const finishEditing = () => {
    if (editingItem && editValue.trim()) {
      setTimelineItems((prev) =>
        prev.map((item) =>
          item.id === editingItem ? { ...item, name: editValue.trim() } : item
        )
      );
    }
    setEditingItem(null);
    setEditValue("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      finishEditing();
    } else if (e.key === "Escape") {
      setEditingItem(null);
      setEditValue("");
    }
  };

  const generateMonthMarkers = () => {
    const markers = [];
    const current = new Date(minDate);
    current.setDate(1);

    while (current <= maxDate) {
      const position = getPositionFromDate(current.toISOString().split("T")[0]);
      markers.push({
        date: new Date(current),
        position,
      });
      current.setMonth(current.getMonth() + 1);
    }
    return markers;
  };

  return {
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
    monthMarkers: generateMonthMarkers(),
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
  };
};

export default useTimelineLogic;
