<template>
  <component
    :is="getWidgetComponent(widgetType)"
    v-bind="widgetProps"
    @update="$emit('update', $event)"
  />
</template>

<script setup>
import { computed } from 'vue'

// Chart 위젯들
import LineChartWidget from './charts/LineChartWidget.vue'
import BarChartWidget from './charts/BarChartWidget.vue'
import PieChartWidget from './charts/PieChartWidget.vue'

// Control 위젯들
import OnOffControlWidget from './controls/OnOffControlWidget.vue'
import UpDownControlWidget from './controls/UpDownControlWidget.vue'

// Display 위젯들
import BoxWidget from './display/BoxWidget.vue'
import BarGaugeWidget from './display/BarGaugeWidget.vue'
import StatusWidget from './display/StatusWidget.vue'

// System 위젯들
import AlarmWidget from './system/AlarmWidget.vue'
import EnergyReportWidget from './system/EnergyReportWidget.vue'

// Misc 위젯들
import PageLinkWidget from './misc/PageLinkWidget.vue'
import ImageWidget from './misc/ImageWidget.vue'

const props = defineProps({
  widgetType: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    default: () => ({}),
  },
  widgetData: {
    type: Object,
    default: () => ({}),
  },
  config: {
    type: Object,
    default: () => ({}),
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
  instanceId: {
    type: [String, Number],
    default: null,
  },
  initSize: {
    type: Object,
    default: () => ({ width: null, height: null }),
  },
})

// defineEmits(['update']) // 필요시 사용

// 위젯 타입에 따른 컴포넌트 매핑
const widgetComponents = {
  // Chart 위젯들
  'line-chart': LineChartWidget,
  'bar-chart': BarChartWidget,
  'pie-chart': PieChartWidget,

  // Control 위젯들
  'on-off-control': OnOffControlWidget,
  'up-down-control': UpDownControlWidget,

  // Display 위젯들
  'box-widget': BoxWidget,
  'bar-gauge-widget': BarGaugeWidget,
  'status-widget': StatusWidget,

  // System 위젯들
  'alarm-widget': AlarmWidget,
  'energy-report': EnergyReportWidget,

  // Misc 위젯들
  'page-link': PageLinkWidget,
  'image-widget': ImageWidget,
}

// 위젯 컴포넌트 가져오기
const getWidgetComponent = (type) => {
  return widgetComponents[type] || BoxWidget // 기본값으로 BoxWidget 사용
}

// 위젯에 전달할 props
const widgetProps = computed(() => ({
  data: props.data || props.widgetData || {},
  config: {
    ...props.config,
    isExpanded: props.config?.isExpanded || false,
  },
  isEditMode: props.isEditMode,
  instanceId: props.instanceId,
  initSize: props.initSize,
}))
</script>

<style scoped>
/* 위젯 팩토리는 스타일이 필요없음 - 각 위젯이 자체 스타일을 가짐 */
</style>
