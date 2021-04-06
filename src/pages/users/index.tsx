import NextLink from "next/link";
import { useState } from "react";
import { GetServerSideProps } from "next";
import { 
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Spinner,
  Link,
  useBreakpointValue,
} from "@chakra-ui/react";
import { RiAddLine } from "react-icons/ri";

import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import { queryClient } from "../../services/queryClient";
import { fetchUser } from "../../services/hooks/useUser";
import { useUsers } from "../../services/hooks/useUsers";
import { SkeletonTable } from "../../components/Skeleton/SkeletonTable";

interface UserListProps {
  currentPage: number;
}

export default function UserList({ currentPage }: UserListProps) {
  const [page, setPage] = useState(currentPage);
  const { data, isLoading, isFetching, error } = useUsers(page)

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  async function handlePrefetchUser(userId: string) {
    await queryClient.prefetchQuery(['user', userId], fetchUser, {
      staleTime: 1000 * 60 * 10, // 10 minutes
    })
  }

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6" align="flex-start">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Usuários

              { !isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" /> }
            </Heading>

            <NextLink href="/users/create" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="pink"
                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              >
                Criar novo
              </Button>
            </NextLink>
          </Flex>

          { isLoading ? (
            <SkeletonTable />
          ) : error ? (
            <Flex justify="center">
              <Text>Falha ao obter dados</Text>
            </Flex>
          ) : (
            <>
              <Table size={isWideVersion ? 'md' : 'sm'} colorScheme="whiteAlpha">
                <Thead>
                  <Tr>
                    <Th px={["2", "4", "6"]} color="gray.300" width="8">
                      <Checkbox colorScheme="pink" />
                    </Th>
                    <Th color="gray.300">Usuário</Th>
                    { isWideVersion && <Th color="gray.300">Data de cadastro</Th> }
                  </Tr>
                </Thead>
                <Tbody>
                  {data.users.map(user => {
                    return (
                      <Tr key={user.id}>
                        <Td px={["2", "4", "6"]}>
                          <Checkbox colorScheme="pink" />
                        </Td>
                        <Td>
                          <NextLink href={`/users/${user.id}`}>
                            <Link color="purple.400" onMouseEnter={() => handlePrefetchUser(user.id)}>
                              {user.name}
                            </Link>
                          </NextLink>
                          <Text
                            fontSize="sm"
                            color="gray.300"
                            mt="1"
                            maxWidth={isWideVersion ? 'auto' : 160}
                            isTruncated
                          >
                            {user.email}
                          </Text>
                        </Td>
                        { isWideVersion && <Td>{user.createdAt}</Td> }
                      </Tr>
                    )
                  })}
                </Tbody>
              </Table>

              <Pagination 
                totalCountOfRegisters={data.totalCount}
                currentPage={page}
                onPageChange={setPage}
              />
            </>
          ) }
        </Box>
      </Flex>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      currentPage: query.page ? Number(query.page) : 1,
    }
  }
}