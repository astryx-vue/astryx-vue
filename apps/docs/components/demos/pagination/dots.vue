<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { Card } from '@astryx-vue/core/Card'
import { Icon } from '@astryx-vue/core/Icon'
import { Pagination } from '@astryx-vue/core/Pagination'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const reviews = [
  {
    name: 'Jeannie Grant',
    date: 'June 01, 2025',
    stars: 5,
    quote: 'A thorough report was done on our financial situation. Better deals were found and processed on our behalf, which took a lot of stress away.',
  },
  {
    name: 'Derval Russell',
    date: 'November 09, 2025',
    stars: 5,
    quote: 'I have been a client for 8 years now and have always found the advice provided excellent. They take the time to explain things clearly.',
  },
  {
    name: 'Claire Dawson',
    date: 'October 15, 2025',
    stars: 5,
    quote: 'Constantly professional and concise. Our mortgage process was smooth from start to finish thanks to their dedicated team.',
  },
  {
    name: 'Marcus Webb',
    date: 'September 22, 2025',
    stars: 4,
    quote: 'Great service overall. The team was responsive and knowledgeable. Would definitely recommend to anyone looking for solid financial advice.',
  },
]

const page = ref(1)
</script>

<template>
  <VStack :gap="3" style="width: 100%; max-width: 480px">
    <Card :padding="5">
      <VStack :gap="3">
        <HStack :gap="0">
          <Icon
            v-for="star in reviews[page - 1].stars"
            :key="star"
            color="warning"
            icon="i-carbon-star-filled"
            size="sm"
          />
        </HStack>
        <Text type="body">
          {{ reviews[page - 1].quote }}
        </Text>
        <HStack align="center" :gap="3" h-align="start">
          <Avatar :name="reviews[page - 1].name" size="md" />
          <VStack :gap="0">
            <Text type="supporting" weight="bold">
              {{ reviews[page - 1].name }}
            </Text>
            <Text color="secondary" type="supporting">
              {{ reviews[page - 1].date }}
            </Text>
          </VStack>
        </HStack>
      </VStack>
    </Card>
    <Pagination
      v-model:page="page"
      :total-pages="reviews.length"
      variant="dots"
      style="justify-content: center; padding-top: 4px"
    />
  </VStack>
</template>
