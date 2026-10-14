<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { Banner } from '@astryx-vue/core/Banner'
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Step, Stepper } from '@astryx-vue/core/Stepper'
import { Text } from '@astryx-vue/core/Text'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'

const active = ref(0)
const name = ref('')
const repository = ref('')
</script>

<template>
  <div style="width: 680px; max-width: 100%">
    <Stepper :active-step="active" orientation="vertical" @step-click="active = $event">
      <Step
        description="Name it and point us at the source"
        indicator="number"
        label="Project details"
        :step="0"
      >
        <VStack v-if="active === 0" :gap="3">
          <HStack :gap="3">
            <TextInput v-model="name" label="Project name" placeholder="My awesome project" width="100%" />
            <TextInput v-model="repository" label="Repository URL" placeholder="https://github.com/..." width="100%" />
          </HStack>
          <div>
            <Button label="Continue" variant="primary" @click="active = 1" />
          </div>
        </VStack>
      </Step>
      <Step
        description="What we detected from your default branch"
        indicator="number"
        label="Review the build"
        :step="1"
      >
        <VStack v-if="active === 1" :gap="3">
          <Card :padding="3" variant="muted">
            <VStack :gap="2">
              <HStack align="center" :gap="2">
                <Text type="label">
                  Next.js 15
                </Text>
                <Badge variant="success">
                  Detected
                </Badge>
              </HStack>
              <Text type="supporting">
                Build command <code>next build</code> · Output <code>.next</code> · Node 20
              </Text>
            </VStack>
          </Card>
          <HStack :gap="2">
            <Button label="Back" variant="secondary" @click="active = 0" />
            <Button label="Looks right" variant="primary" @click="active = 2" />
          </HStack>
        </VStack>
      </Step>
      <Step description="Ships to production" indicator="number" label="Deploy" :step="2">
        <VStack v-if="active === 2" :gap="3">
          <Banner
            description="Later deploys reuse the build cache and finish in under a minute."
            status="info"
            title="First deploy takes a few minutes"
          />
          <HStack :gap="2">
            <Button label="Back" variant="secondary" @click="active = 1" />
            <Button label="Deploy now" variant="primary" @click="active = 3" />
          </HStack>
        </VStack>
      </Step>
      <Step indicator="number" label="Live" :step="3" />
    </Stepper>
  </div>
</template>
