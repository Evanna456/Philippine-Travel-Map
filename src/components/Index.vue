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
    <div class="row">
      <div class="col-lg-12" align="center">
        <div
          class="modal fade"
          id="poly-modal"
          tabindex="-1"
          aria-labelledby="poly-modal"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="poly-modal">Modal title</h1>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <button
                  type="button"
                  class="btn btn-primary"
                  v-on:click="colorPolygon('lived')"
                >
                  I lived here
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  v-on:click="colorPolygon('traveled')"
                >
                  I traveled here
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  v-on:click="colorPolygon('stayed')"
                >
                  I stayed here
                </button>
              </div>
              <div class="modal-footer"></div>
            </div>
          </div>
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
  .btn {
    margin-top: 3px;
    width: 100%;
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
  import bootstrap from "bootstrap/dist/js/bootstrap.js";

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
        my_modal: bootstrap.modal,
        poly: "",
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
          self.poly = this;
          self.my_modal = new bootstrap.Modal("#poly-modal", {
            keyboard: false,
          });
          self.my_modal.show();
        });
      },
      colorPolygon(status) {
        var self = this;
        if (status == "lived") {
          $(self.poly).css("fill", "red");
          $(self.poly).css("fill-opacity", "1");
        } else {
          $(self.poly).css("fill", "yellow");
          $(self.poly).css("fill-opacity", "1");
        }
        self.my_modal.hide();
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
