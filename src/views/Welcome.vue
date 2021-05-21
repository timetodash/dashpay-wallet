<template>
  <ion-page>
    <ion-content fullscreen class="ion-padding" scroll-y="false">
      <ion-slides pager="true">
        <ion-slide>
          <div class="slide">
            <img src="/dash-d.png" />
            <h2>Welcome</h2>
            <p>
              An intuitive and familiar experience across all your devices.
            </p>
          </div>
        </ion-slide>

        <ion-slide>
          <img src="/dash-d.png" />
          <h2>Pay with ease</h2>
          <p>
            Pay and get paid instantly with easy to use payment flows.
          </p>
        </ion-slide>

        <ion-slide>
          <img src="/dash-d.png" />
          <h2>More Control</h2>
          <p>
            Have complete control and customize your wallet based on your needs.
          </p>
          <ion-button color="primary" router-link="/createwallet"
            >Sign Up for Dash</ion-button
          ><br /><br />
          <router-link to="/recoverwallet">Import existing Wallet</router-link>
        </ion-slide>
      </ion-slides>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonSlides,
  IonSlide,
  IonPage,
  IonContent,
  IonButton,
} from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: { IonSlides, IonSlide, IonPage, IonContent, IonButton },
  setup() {
    // Optional parameters to pass to the swiper instance. See http://idangero.us/swiper/api/ for valid options.
    const slideOpts = {
      initialSlide: 1,
      speed: 400,
    };
    return { slideOpts };
  },
});
</script>

<style>
ion-slides {
  height: 100%;
}

.swiper-slide {
  display: block;
}

.swiper-slide h2 {
  margin-top: 2.8rem;
}

.swiper-slide img {
  max-height: 50%;
  max-width: 80%;
  margin: 60px 0 40px;
  pointer-events: none;
}

b {
  font-weight: 500;
}

p {
  padding: 0 40px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--ion-color-step-600, #60646b);
}

p b {
  color: var(--ion-text-color, #000000);
}
</style>
