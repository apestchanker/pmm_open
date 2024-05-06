import React from 'react';
import Board, { BoardProps, LaneProps, CardData, LaneData } from 'react-trello';

interface KanbanBoardProps {
  columns: Array<LaneData>; //string[];
  cards: Array<CardData>;
  onCardClick: (id: string) => void;
  handleCardMove: (cardId: string, sourceLane: string, targetLane: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ columns, cards, onCardClick, handleCardMove }) => {
  const lanes: Array<LaneProps> = columns.map((column) => {
    //console.log('Entro al KanbanBoard');
    const filteredCards = cards.filter((card) => card.status === column.title);
    return {
      id: column.id,
      title: column.title,
      draggable: false,
      cards: filteredCards.map((card) => ({
        id: card.id,
        title: card.title,
        description: card.description,
        draggable: card.draggable,
        isModified: card.isModified,
        style: card.style,
        onClick: () => onCardClick(card.id),
      })),
    };
  });

  const boardProps: BoardProps = {
    style: { background: 'transparent' },
    data: { lanes },
    handleDragEnd(cardId, sourceLaneId, targetLaneId, position) {
      handleCardMove(cardId, sourceLaneId, targetLaneId);
    },
  };

  return (
    <div>
      <Board {...boardProps} />
    </div>
  );
};

export default KanbanBoard;
