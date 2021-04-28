import { Box, Flex, SimpleGrid, Text, theme } from "@chakra-ui/react";
import dynamic from 'next/dynamic';
import { useEffect } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { setupAuthClient } from "../services/auth";
import { authClient } from "../services/authClient";
import { GetServerSideProps } from "next";
import { useAuth } from "../contexts/AuthContext";
import { Can } from "../components/Can";
import { RefreshTokenError } from "../services/errors/RefreshTokenError";
import { parseCookies } from 'nookies'
import { withSSRAuth } from "../utils/withSSRAuth";

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

const options = {
  chart: {
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    foreColor: theme.colors.gray[500],
  },
  grid: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    enabled: false,
  },
  xaxis: {
    type: 'datetime',
    axisBorder: {
      color: theme.colors.gray[600]
    },
    axisTicks: {
      color: theme.colors.gray[600]
    },
    categories: [
      '2021-03-18T00:00:00.000Z',
      '2021-03-19T00:00:00.000Z',
      '2021-03-20T00:00:00.000Z',
      '2021-03-21T00:00:00.000Z',
      '2021-03-22T00:00:00.000Z',
      '2021-03-23T00:00:00.000Z',
      '2021-03-24T00:00:00.000Z',
    ],
  },
  fill: {
    opacity: 0.3,
    type: 'gradient',
    gradient: {
      shade: 'dark',
      opacityFrom: 0.7,
      opacityTo: 0.3,
    },
  },
};

const series = [
  { name: 'series1', data: [31, 120, 10, 28, 61, 18, 109] }
]

export default function Dashboard() {
  const { user } = useAuth()

  console.log(user);

  useEffect(() => {
    authClient.get('/me').then(response => console.log(response.data));
  }, [])

  return (
    <Flex direction="column" h="100vh">
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <SimpleGrid flex="1" gap="4" minChildWidth="320px" align="flex-start">
          <Can permissions={['metrics.list']}>
            <Box
              p={["6", "8"]}
              bg="gray.800"
              borderRadius={8}
              pb="4"
            >
              <Text fontSize="lg" mb="4">Incritos da semana</Text>
              <Chart options={options} series={series} type="area" height={160} />
            </Box>
          </Can>
          <Can permissions={['metrics.list']}>
            <Box
              p={["6", "8"]}
              bg="gray.800"
              borderRadius={8}
              pb="4"
            >
              <Text fontSize="lg" mb="4">Taxa de abertura</Text>
              <Chart options={options} series={series} type="area" height={160} />
            </Box>
          </Can>
        </SimpleGrid>
      </Flex>
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps = withSSRAuth(async (ctx) => {
  const auth = setupAuthClient(ctx)

  try {
    await auth.get('/me');

    return {
      props: {}
    }
  } catch (err) {
    if (err instanceof RefreshTokenError) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        }
      }
    };
  }
}, {
  permissions: ['metrics.list']
});