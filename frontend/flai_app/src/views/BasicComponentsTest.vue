<template>
  <div>
    <h1>Buttons</h1>
    <custom-button
      label=""
      btnclass="prim_small_button_blue"
      @button-click="buttonClick"
    />
    <custom-button
      label=""
      btnclass="prim_small_button_orange"
      @button-click="buttonClick"
    />
    <custom-button
      label="Prim M"
      btnclass="prim_medium_button_blue"
      @button-click="buttonClick"
    />
    <custom-button
      label="Prim L"
      btnclass="prim_medium_button_orange"
      @button-click="buttonClick"
    />
    <custom-button
      label="Prim L"
      btnclass="prim_large_button_blue"
      @button-click="buttonClick"
    />
    <custom-button
      label="Prim L"
      btnclass="prim_large_button_orange"
      @button-click="buttonClick"
    />
    <custom-button
      label=""
      iconpath="/assets/icons/FLAI_Fehler.svg"
      btnclass="prim_medium_icon_button_blue"
      @button-click="buttonClick"
    />
    <div>Test Button click count is: {{ clickCount }}</div>
    <custom-button
      label=""
      btnclass="sec_small_button_blue"
      @button-click="buttonClick"
    />
    <custom-button
      label=""
      btnclass="sec_small_button_orange"
      @button-click="buttonClick"
    />
    <custom-button
      label="Sec M"
      btnclass="sec_medium_button_blue"
      @button-click="buttonClick"
    />
    <custom-button
      label="Sec M"
      btnclass="sec_medium_button_orange"
      @button-click="buttonClick"
    />
    <custom-button
      label="Sec L"
      btnclass="sec_large_button_blue"
      @button-click="buttonClick"
    />
    <custom-button
      label="Sec L"
      btnclass="sec_large_button_orange"
      @button-click="buttonClick"
    />
  </div>
  <div>
    <h1>Switch Button</h1>
    <switch-button
      :labels="['front', 'mid', 'sides']"
      btnclass="sec_small_button_blue_switch"
    />
  </div>
  <br />
  <div>
    <h1>Input Fields</h1>
    <text-input-field
      v-model="testInput"
      label-name="Test Input"
      placeholder="your test input"
      element-class="default_input_field"
      component-class="component_input"
    />
    <div>Test Input is: {{ testInput }}</div>
  </div>
  <br />
  <div>
    <h1>Checkboxes</h1>
    <custom-checkbox
      v-model="testCheckbox"
      label-name="Test Checkbox"
      element-class="checkbox-primary"
      component-class="primary-checkbox"
      checkmark-class="checkmark"
    />
    <div>Test Checkbox is: {{ testCheckbox }}</div>
  </div>
  <br />
  <div>
    <h1>Icons</h1>
    <icon-loader
      path="/assets/signs/pic/front/a_pic_front.webp"
      alt="This is the icon's alt description"
      element-class="icon-large"
    />
  </div>
  <div>
    <h1>Webcam</h1>
    <webcam borderclass="" />
  </div>
  <div class="stats-small-panel">
    <StatisticDashboardSmall />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import textInputField from '../components/TextInputField.vue'
import customCheckbox from '../components/CustomCheckbox.vue'
import iconLoader from '../components/IconLoader.vue'
import webcam from '../components/Webcam.vue'
import customButton from '../components/CustomButton.vue'
import StatisticDashboardSmall from '../components/Statistic/StatisticDashboardSmall.vue'
import SwitchButton from '../components/SwitchButton.vue'

const testInput = ref('')
const testCheckbox = ref(false)
const clickCount = ref(0)

const buttonClick = (): void => {
  clickCount.value++
}
</script>
