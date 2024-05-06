declare module 'react-trello' {
  import { Component, ReactNode } from 'react';

  export interface BoardProps {
    data: {
      lanes: LaneProps[];
    };
    draggable?: boolean;
    handleDragStart?: (cardId: string, laneId: string) => void;
    handleDragEnd?: (cardId: string, sourceLaneId: string, targetLaneId: string, position: number) => void;
    onLaneClick?: (laneId: string) => void;
    addCardLink?: ReactNode;
    editable?: boolean;
    canAddLanes?: boolean;
    canAddCards?: boolean;
    hideCardDeleteIcon?: boolean;
    handleLaneAdd?: (lane: LaneData) => void;
    handleLaneDelete?: (laneId: string) => void;
    handleLaneClick?: (laneId: string) => void;
    handleCardAdd?: (card: CardData, laneId: string) => void;
    handleCardDelete?: (cardId: string, laneId: string) => void;
    components?: {
      LaneHeader?: Component;
      NewLaneSection?: Component;
      NewCardForm?: Component;
      Card?: Component;
      EditableCard?: Component;
      Lane?: Component;
      Footer?: Component;
    };
    style?: React.CSSProperties;
  }

  export interface LaneProps {
    id: string;
    title: string;
    label?: string;
    cards: CardProps[];
    draggable?: boolean;
    style?: React.CSSProperties;
  }

  export interface CardProps {
    id: string;
    title: string;
    description?: string;
    label?: string;
    metadata?: object;
    draggable?: boolean;
    style?: React.CSSProperties;
    isModified: boolean;
  }

  export interface LaneData {
    id: string;
    title: string;
    label?: string;
    cards?: CardData[];
    draggable?: boolean;
    style?: React.CSSProperties;
  }

  export interface CardData {
    id: string;
    title: string;
    description?: string;
    label?: string;
    metadata?: object;
    status: string;
    draggable?: boolean;
    style?: React.CSSProperties;
    isModified: boolean;
  }

  export default class Board extends Component<BoardProps> {}
}
