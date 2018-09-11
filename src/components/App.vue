<template>
<div>
  <div id="header">
    <div>
      <img src="../assets/logo.png">
      <h1>Vue.js Calendar</h1>
    </div>
    <div>
      <current-month></current-month>
    </div>
  </div>
<div id="day-bar">
  <div>Seg</div>
  <div>Ter</div>
  <div>Qua</div>
  <div>Qui</div>
  <div>Sex</div>
  <div>Sab</div>
  <div>Dom</div>
</div>
<div id="calendar">
  <div class="calendar-week" :key="week" v-for="week in weeks">
    <calendar-day :key="day" v-for="day in week" :day="day"></calendar-day>
  </div>
</div>
<event-form></event-form>
</div>
</template>

<script>
import CalendarDay from './CalendarDay.vue';
import CurrentMonth from './CurrentMonth.vue';
import EventForm from './EventForm.vue';
export default {
  computed: {
    month() {
      return this.$store.state.currentMonth;
    },
    year() {
      return this.$store.state.currentYear;
    },
    days() {
      // All days in the month
      let days = [];
      let currentDay = this.$moment(`${this.year}-${this.month}-1`, 'YYYY-M-D');

      do {
        days.push(currentDay);
        currentDay = this.$moment(currentDay).add(1, 'days');
      } while (currentDay.month() + 1 === this.month);

      // days before
      currentDay = this.$moment(days[0]);
      while (currentDay.isoWeekday() !== 1) {
        currentDay = this.$moment(currentDay).subtract(1, 'days');
        days.unshift(currentDay);
      }
      // days after
      currentDay = this.$moment(days[days.length - 1]);
      while (currentDay.isoWeekday() !== 7) {
        currentDay = this.$moment(currentDay).add(1, 'days');
        days.push(currentDay);
      }
      return days;
    },
    weeks() {
      let weeks = [];
      let week = [];
      for (const day of this.days) {
        week.push(day);
        if (week.length === 7) {
          weeks.push(week);
          week = [];
        }
      }

      return weeks;
    },
  },
  created() {},
  components: {
    CalendarDay,
    CurrentMonth,
    EventForm,
  },
};
</script>

<style>
</style>
