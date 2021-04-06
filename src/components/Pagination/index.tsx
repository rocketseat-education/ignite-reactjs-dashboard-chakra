import { Box, HStack, Spinner, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { PaginationItem } from "./PaginationItem";

interface PaginationProps {
  totalCountOfRegisters: number;
  registersPerPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

function generatePagesArray(from: number, to: number) {
  return [...new Array(to - from)]
    .map((_, index) => {
      return from + index + 1
    })
    .filter(page => {
      return page > 0
    })
}

const siblingsCount = 1;

export function Pagination({ 
  totalCountOfRegisters, 
  registersPerPage = 10,
  currentPage = 1,
  onPageChange
}: PaginationProps) {
  const router = useRouter()
  const lastPage = Math.floor(totalCountOfRegisters / registersPerPage)

  const previousPages = currentPage > 1 
    ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1) 
    : []

  const nextPages = currentPage < lastPage
    ? generatePagesArray(currentPage, Math.min(currentPage + siblingsCount, lastPage))
    : []

  useEffect(() => {
    router.push({
      pathname: router.pathname,
      query: {
        page: currentPage,
      }
    })
  }, [currentPage])

  useEffect(() => {
    if (router.query.page) {
      onPageChange(Number(router.query.page))
    }
  }, [router.query.page])

  return (
    <Stack
      direction={["column", "row"]}
      mt="8"
      justifyContent="space-between"
      alignItems="center"
      spacing="6"
    >
      <Box>
        <Text fontSize="md" color="gray.50">
          <strong>
            {registersPerPage * (currentPage - 1)}
          </strong> 
          {' '}-{' '}
          <strong>
            {registersPerPage * currentPage}
          </strong> 
          {' '}de{' '} 
          <strong>
            {totalCountOfRegisters}
          </strong>
        </Text>
      </Box>

      <HStack spacing="2">
        {currentPage > (1 + siblingsCount) && (
          <>
            <PaginationItem number={1} onPageChange={onPageChange} />
            { currentPage > (2 + siblingsCount) && <Text color="gray.300" width="8" textAlign="center">...</Text> }
          </>
        )}

        {previousPages.length > 0 && previousPages.map(page => {
          return <PaginationItem key={page} number={page} onPageChange={onPageChange} />
        })}

        <PaginationItem number={currentPage} onPageChange={onPageChange} isCurrent />

        {nextPages.length > 0 && nextPages.map(page => {
          return <PaginationItem key={page} number={page} onPageChange={onPageChange} />
        })}

        {(currentPage + siblingsCount) < lastPage && (
          <>
            { (currentPage + 1 + siblingsCount) < lastPage && <Text color="gray.300" width="8" textAlign="center">...</Text> }
            <PaginationItem number={lastPage} onPageChange={onPageChange} />
          </>
        )}
      </HStack>
    </Stack>
  );
}