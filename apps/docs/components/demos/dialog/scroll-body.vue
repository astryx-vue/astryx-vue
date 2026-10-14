<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { DialogHeader } from '@astryx-vue/core/Dialog'
import { Layout, LayoutContent, LayoutFooter } from '@astryx-vue/core/Layout'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

defineProps<{ requestClose: () => void }>()

const terms = [
  'You agree to use the service only for lawful purposes and in compliance with all applicable laws and regulations in your jurisdiction.',
  'Your account credentials are your responsibility. Notify us immediately if you suspect unauthorized access to your account.',
  'We reserve the right to suspend accounts that violate these terms or engage in abusive behavior toward other users.',
  'Content you upload remains your property. You grant us a license to host and display it within the service.',
  'We may update these terms at any time. Continued use after changes constitutes acceptance of the updated terms.',
  'The service is provided as-is without warranties of any kind. We are not liable for data loss or service interruptions.',
  'You may cancel your account at any time. Your data will be deleted within 30 days of cancellation.',
  'Disputes will be resolved through binding arbitration in accordance with applicable regulations.',
  'You agree not to reverse-engineer, decompile, or disassemble any part of the service or its underlying technology.',
  'We may collect anonymized usage data to improve the service. Personal data is handled per our Privacy Policy.',
  'Third-party integrations are governed by their own terms. We are not responsible for third-party service outages.',
  'You are responsible for maintaining backups of your data. We provide export tools but do not guarantee data recovery.',
  'Commercial use requires a Business plan. Free accounts are limited to personal and non-commercial projects.',
  'We may introduce new features or discontinue existing ones with 30 days notice via email or in-app notification.',
  'Violation of these terms may result in immediate termination of your account without prior notice or refund.',
]
</script>

<template>
  <Layout>
    <template #header>
      <DialogHeader title="Terms and Conditions" has-close-button @open-change="requestClose()" />
    </template>
    <LayoutContent>
      <VStack :gap="3">
        <Text v-for="(term, index) in terms" :key="index" type="body">
          {{ index + 1 }}. {{ term }}
        </Text>
      </VStack>
    </LayoutContent>
    <template #footer>
      <LayoutFooter>
        <HStack h-align="end" :gap="2">
          <Button label="Decline" variant="secondary" @click="requestClose()" />
          <Button label="Accept" variant="primary" @click="requestClose()" />
        </HStack>
      </LayoutFooter>
    </template>
  </Layout>
</template>
