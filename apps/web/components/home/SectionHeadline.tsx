import { Container, Heading, Text, VStack } from '@chakra-ui/react';

interface Props {
  title: string;
  description?: string;
}

export default function SectionHeadline({ title, description }: Props) {
  return (
    <Container maxW="7xl" textAlign={{ base: 'left', md: 'center' }} mb={16}>
      <VStack spacing={2} justify="start" align={{ base: 'start', md: 'center' }}>
        <Heading maxW="2xl" fontSize="4xl" lineHeight="shorter">
          {title}
        </Heading>
        {description && (
          <Text fontSize="lg" maxW="2xl">
            {description}
          </Text>
        )}
      </VStack>
    </Container>
  );
}
