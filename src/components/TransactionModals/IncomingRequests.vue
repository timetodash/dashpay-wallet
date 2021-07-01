<template>
  <div class="flex ion-nowrap">
    <ion-chip class="ignore"
      ><span class="text ignore-text"> Ignore</span></ion-chip
    >
    <ion-chip class="accept" @click="$emit('acceptAndSayHi')"
      ><span class="text accept-text"> Accept & say "hi"</span></ion-chip
    >
  </div>
</template>

<script>
import { IonChip } from "@ionic/vue";

export default {
  emits: ["acceptAndSayHi"],
  components: {
    IonChip,
  },
};
</script>


<style scoped>
ion-chip {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 9px 16px;
  border-radius: 10px;
}
.accept {
  width: 206px;
  height: 36px;
  background: #f2f4ff;
}
.accept-text {
  color: #6c69fc;
}
.ignore {
  width: 110px;
  height: 36px;
  background: #fbf1f4;
}
.text {
  /* font-family: Inter; */
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 18px;
}
.ignore-text {
  color: #ff627e;
}
</style>











