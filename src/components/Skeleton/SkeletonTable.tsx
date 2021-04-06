import { Skeleton, Table, Tbody, Td, Th, Thead, Tr, useBreakpointValue } from "@chakra-ui/react";

const emptyArray = [...new Array(10)].map((_, index) => index);

interface SkeletonTableProps {
  numberOfColumns?: number;
}

export function SkeletonTable({ numberOfColumns = 3 }: SkeletonTableProps) {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  const columns = [...new Array(isWideVersion ? numberOfColumns : 1)]
    .map((_, index) => index);

  return (
    <Table colorScheme="whiteAlpha">
      <Thead>
        <Tr>
          <Th width="24">
            <Skeleton height="24px" startColor="gray.700" endColor="gray.600" />
          </Th>
          {columns.map((c) => {
            return (
              <Th key={c}>
                <Skeleton height="24px" startColor="gray.700" endColor="gray.600" />
              </Th>
            );
          })}
        </Tr>
      </Thead>
      <Tbody>
        {emptyArray.map((i) => {
          return (
            <Tr key={i}>
              <Td width="24">
                <Skeleton height="24px" startColor="gray.700" endColor="gray.600" />
              </Td>
              {columns.map((c) => {
                return (
                  <Th key={c}>
                    <Skeleton height="24px" startColor="gray.700" endColor="gray.600" />
                  </Th>
                );
              })}
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  );
}