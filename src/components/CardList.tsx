import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const disclosure = useDisclosure();

  const [imgUrl, setImageUrl] = useState<string>();

  function handleViewImage(url: string): void {
    setImageUrl(url);
    disclosure.onOpen();
  }

  return (
    <>
      <SimpleGrid columns={3} spacing="40px">
        {cards.map(card => (
          <Card
            key={card.id}
            data={card}
            viewImage={(url: string) => handleViewImage(url)}
          />
        ))}
      </SimpleGrid>
      <ModalViewImage
        isOpen={disclosure.isOpen}
        onClose={disclosure.onClose}
        imgUrl={imgUrl}
      />
    </>
  );
}
