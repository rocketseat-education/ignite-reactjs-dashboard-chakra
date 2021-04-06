import { Button, ButtonProps } from "@chakra-ui/button";

interface PaginationItemProps extends ButtonProps {
  number: number;
  isCurrent?: boolean;
  onPageChange: (pageNumber: number) => void;
}

export function PaginationItem({ 
  isCurrent = false, 
  number,
  onPageChange,
  ...rest
}: PaginationItemProps) {
  if (isCurrent) {
    return (
      <Button
        size="sm"
        fontSize="xs"
        width="4"
        colorScheme="pink"
        disabled
        _disabled={{
          bg: 'pink.500',
          cursor: 'default',
        }}
        {...rest}
      >
        {number}
      </Button>
    )
  }

  return (
    <Button
      size="sm"
      fontSize="xs"
      width="4"
      bg="gray.700"
      _hover={{
        bg: 'gray.500'
      }}
      onClick={() => onPageChange(number)}
      {...rest}
    >
      {number}
    </Button>
  )
}