<template>
<div id="event-form" :class="{active:active}" :style="{top:top,left:left}">
  <h4>Add event</h4>
  <p>{{date.format("dddd, D [de] MMMM, YYYY")}}</p>
  <div class="text">
    <input type="text" v-focus v-model="description" @keyup.enter="create">
  </div>
  <div class="buttons">
    <button @click="create">Create</button>
  </div>
  <button id="close-button" @click="close">&#10005;</button>
</div>
</template>

<script>
export default {
  data() {
    return {
      description: '',
    };
  },
  methods: {
    close() {
      this.$store.commit('eventFormActive', false);
    },
    create() {
      if (this.description.trim().length > 0) {
        this.$store.dispatch('addEvent', this.description).then(result => {
          this.description = '';
          this.close();
        });
      }
    },
  },
  computed: {
    date() {
      return this.$store.state.eventFormDate;
    },
    active() {
      return this.$store.state.eventFormActive;
    },
    top() {
      return `${this.$store.state.eventFormPosY}px`;
    },
    left() {
      return `${this.$store.state.eventFormPosX}px`;
    },
  },
  directives: {
    focus: {
      update(el) {
        el.focus();
      },
    },
  },
};
</script>
