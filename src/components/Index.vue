<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-12" align="center">
        <button class="btn btn-primary" v-on:click="download">Download</button>
        <div id="my-travel">
          <h2>Philippine Travel Map</h2>
          <p>Score: {{ score }}</p>
          <div id="map"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  #my-travel {
    background-color: white;
  }
  #map {
    height: 700px;
  }
</style>

<script lang="ts">
  import { ref, defineComponent } from "vue";
  import { useMeta } from "vue-meta";
  import $ from "jquery";
  import domtoimage from "dom-to-image-more";

  import "leaflet/dist/leaflet.css";
  import leaflet from "leaflet/dist/leaflet.js";

  import Swal from "sweetalert2";

  export default defineComponent({
    name: "Index",
    setup() {
      useMeta({ title: "Philippine Travel Map" });
    },
    components: {},
    data: function () {
      return {
        map: leaflet,
        score: 0,
      };
    },
    mounted() {
      window.scrollTo(0, 0);
      this.mapInit();
      this.polygonClick();
    },
    updated() {},
    computed: {},
    methods: {
      async mapInit(): Promise<void> {
        var self = this;
        self.map = leaflet.map("map").setView([12.3, 122.78], 6);

        leaflet
          .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution:
              '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          })
          .addTo(self.map);

        const response = await fetch("/Provinces.geojson");
        const provinces = await response.json();

        leaflet.geoJSON(provinces).addTo(self.map);
      },
      polygonClick() {
        var self = this;
        $("#map").on("click", ".leaflet-interactive", function () {
          var poly = this;
          Swal.fire({
            title: "",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "I stayed in there",
            denyButtonText: "I traveled in there",
          }).then((result) => {
            if (result.isConfirmed) {
              $(poly).css("fill", "green");
              $(poly).css("fill-opacity", "1");
              self.score = self.score + 20;
            } else if (result.isDenied) {
              $(poly).css("fill", "yellow");
              $(poly).css("fill-opacity", "1");
              self.score = self.score + 10;
            }
          });
        });
      },
      download(): void {
        var self = this;
        self.map.setView([12.3, 122.78], 6);

        setTimeout(function () {
          domtoimage
            .toJpeg(document.getElementById("my-travel"), { quality: 0.95 })
            .then(function (dataUrl) {
              var link = document.createElement("a");
              link.download = "mytravelmap.jpg";
              link.href = dataUrl;
              link.click();
            });
        }, 2000);
      },
    },
  });
</script>
