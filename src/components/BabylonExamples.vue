<template>
  <div class="previs-container">
    <div class="tab-bar">
      <button
        :class="['tab-btn', activeView === 'visualiser' ? 'active' : '']"
        @click="switchView('visualiser')"
      >
        Visualiser
      </button>
      <button
        :class="['tab-btn', activeView === 'floorplan' ? 'active' : '']"
        @click="switchView('floorplan')"
      >
        Floor Plan
      </button>
    </div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { PrevisScene } from "@/BabylonExamples/PrevisScene";

export default defineComponent({
  name: "BabylonExamples",
  setup() {
    const canvas = ref<HTMLCanvasElement | null>(null);
    const activeView = ref<"visualiser" | "floorplan">("visualiser");
    let previsScene: PrevisScene | null = null;

    onMounted(() => {
      if (canvas.value) {
        previsScene = new PrevisScene(canvas.value);
      }
    });

    function switchView(view: "visualiser" | "floorplan") {
      activeView.value = view;
      if (view === "visualiser") {
        previsScene?.switchToVisualiser();
      } else {
        previsScene?.switchToFloorPlan();
      }
    }

    return { canvas, activeView, switchView };
  },
});
</script>

<style scoped>
.previs-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
}

.tab-bar {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  justify-content: center;
}

.tab-btn {
  padding: 0.5rem 2rem;
  background: transparent;
  color: white;
  border: 1px solid white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-family: 'Roboto Condensed', sans-serif;
}

.tab-btn.active {
  background: white;
  color: black;
}

canvas {
  width: 100%;
  height: calc(100vh - 70px);
  outline: none;
}
</style>
