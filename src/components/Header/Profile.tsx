import { Avatar, Box, Flex, Text } from "@chakra-ui/react";

interface ProfileProps {
  showProfileData?: boolean;
}

export function Profile({ showProfileData = true }: ProfileProps) {
  return (
    <Flex align="center">
      { showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>Diego Fernandes</Text>
          <Text color="gray.300" fontSize="small">
            diego.schell.f@gmail.com
          </Text>
        </Box>
      )}

      <Avatar size="md" name="Diego Fernandes" src="https://github.com/diego3g.png" />
    </Flex>
  );
}