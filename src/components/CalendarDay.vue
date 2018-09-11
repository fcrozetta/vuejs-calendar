<template>
  <div :class="classObject" @click="captureClick">{{day.format("D")}}</div>
</template>

<script>
export default {
  props: ['day'],
  methods: {
    captureClick(event) {
      this.$store.commit('eventFormPos', {
        x: event.clientX,
        y: event.clientY,
      });
      this.$store.commit('eventFormActive', true);
    },
  },
  computed: {
    classObject() {
      return {
        day: true,
        today: this.day.isSame(this.$moment(), 'day'),
        past: this.day.isSameOrBefore(
          this.$moment().subtract(1, 'days'),
          'day'
        ),
      };
    },
  },
};
</script>

<style>
</style>
