## Features

- **Lane-based Layout**: Items automatically organize into horizontal lanes for space efficiency
- **Interactive Controls**: Drag to move items, resize by dragging edges, click to edit names
- **Zoom Functionality**: Scale from 20% to 500% for detailed or overview analysis
- **Month Grid**: Visual markers showing month boundaries
- **Real-time Updates**: All changes update immediately with visual feedback

## Quick Start

```bash
npm install
npm start
```

Opens at `http://localhost:1234`

## Architecture

```
src/
├── components/
│   ├── Timeline/           # Main container
│   ├── TimelineItem/       # Draggable items
│   ├── TimelineControls/   # Zoom controls
│   └── TimelineGrid/       # Month markers
├── hooks/
│   └── useTimelineLogic.js # State & business logic
└── assignLanes.js          # Lane assignment algorithm
```

## Key Design Decisions

- **Modular Components**: Each component has its own CSS module and focused responsibility
- **Custom Hook**: All business logic separated into `useTimelineLogic` hook
- **Hybrid Interactions**: @dnd-kit for movement + custom handlers for resizing
- **Immediate Feedback**: No save buttons - all changes apply instantly

## Usage

1. **Move Items**: Drag anywhere on an item to change its dates
2. **Resize Items**: Drag the right edge to extend/shorten duration
3. **Edit Names**: Click on item text to edit inline
4. **Zoom**: Use controls to scale timeline view
