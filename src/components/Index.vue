<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-12" align="center">
        <h2>Philippine Travel Map</h2>
        <div id="map"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  #map {
    height: 700px;
  }
</style>

<script lang="ts">
  import { ref, defineComponent } from "vue";
  import { useMeta } from "vue-meta";

  import "leaflet/dist/leaflet.css";
  import leaflet from "leaflet/dist/leaflet.js";

  export default defineComponent({
    name: "Index",
    setup() {
      useMeta({ title: "Philippine Travel Map" });
    },
    components: {},
    data: function () {
      return {
        map: null,
      };
    },
    mounted() {
      window.scrollTo(0, 0);
      this.mapInit();
    },
    updated() {},
    computed: {},
    methods: {
      async mapInit() {
        this.map = leaflet.map("map").setView([12.3, 122.78], 6);
        leaflet
          .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution:
              '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          })
          .addTo(this.map);

        const response = await fetch("/Provinces.geojson");
        const provinces = await response.json();

        leaflet
          .geoJson(provinces, {
            onEachFeature: function (feature, layer) {
              layer.on("click", function (e) {
                // Do whatever you want here, when the polygon is clicked.
                alert("click");
              });
            },
          })
          .addTo(this.map);

        //leaflet.geoJSON(provinces).addTo(this.map);
      },
    },
  });
</script>
