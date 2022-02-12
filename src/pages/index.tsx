import { Box, Button } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';
import { CardList } from '../components/CardList';
import { Error } from '../components/Error';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { api } from '../services/api';

type AxiosReturnData = {
  data: {
    ts: number;
    id: string;
    title: string;
    description: string;
    url: string;
  }[];
  after: string | null;
};

export default function Home(): JSX.Element {
  async function dataFetch(obj: {
    pageParam?: string;
  }): Promise<AxiosReturnData> {
    const { data } = await api.get<AxiosReturnData>(`api/images`, {
      params: {
        after: obj.pageParam,
      },
    });
    return data;
  }

  function getNextPageParam(data: AxiosReturnData): string | null {
    return data ? data.after : null;
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', dataFetch, {
    getNextPageParam,
  });

  const formattedData = useMemo(() => {
    const formatted = data?.pages.flatMap(imageData => {
      return imageData.data.flat();
    });
    return formatted;
  }, [data]);

  if (isLoading && !isError) {
    return <Loading />;
  }

  if (!isLoading && isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            mt="40px"
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
