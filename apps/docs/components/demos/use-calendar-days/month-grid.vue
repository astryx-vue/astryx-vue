<script setup lang="ts">
import { useCalendarDays } from '@astryx-vue/core/Calendar'
import { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const weekStartsOn = ref<'0' | '1'>('0')
const { weeks, dayNames } = useCalendarDays(() => ({
  year: 2026,
  month: 12,
  weekStartsOn: weekStartsOn.value === '1' ? 1 : 0,
  hasVariableRowCount: true,
}))
</script>

<template>
  <VStack :gap="3">
    <HStack :gap="2" align="center">
      <Text type="body">
        Week starts on
      </Text>
      <SegmentedControl v-model="weekStartsOn" label="Week starts on" size="sm">
        <SegmentedControlItem value="0" label="Sunday" />
        <SegmentedControlItem value="1" label="Monday" />
      </SegmentedControl>
    </HStack>
    <table :style="{ tableLayout: 'fixed', width: '280px' }">
      <caption>
        <Text type="body" weight="bold">
          December 2026
        </Text>
      </caption>
      <thead>
        <tr>
          <th v-for="name in dayNames" :key="name" scope="col">
            <Text type="supporting" color="secondary">
              {{ name }}
            </Text>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="week in weeks" :key="week[0]!.iso">
          <td v-for="day in week" :key="day.iso" align="center">
            <Text type="body" :color="day.isOutside ? 'secondary' : 'primary'">
              {{ day.dayNumber }}
            </Text>
          </td>
        </tr>
      </tbody>
    </table>
  </VStack>
</template>
