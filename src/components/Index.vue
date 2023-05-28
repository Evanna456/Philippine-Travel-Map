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
                <h1 class="modal-title fs-5" id="poly-modal"></h1>
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
                  v-on:click="colorPoly('lived')"
                >
                  I lived here
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  v-on:click="colorPoly('traveled')"
                >
                  I traveled here
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  v-on:click="colorPoly('stayed')"
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
    props: {
      Map: leaflet,
      Score: {
        type: Number,
        default: 0,
      },
      My_Modal: bootstrap.modal,
      Poly: Object,
    },
    data: function () {
      return {
        map: this.Map,
        score: this.Score,
        my_modal: this.My_Modal,
        poly: this.Poly,
      };
    },
    mounted() {
      window.scrollTo(0, 0);
      this.mapInit();
      this.polyClick();
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
        self.map.doubleClickZoom.disable();
        var response = await fetch("/Provinces.geojson");
        var provinces = await response.json();
        leaflet.geoJSON(provinces).addTo(self.map);
      },
      polyClick() {
        var self = this;
        $("#map").on("dblclick", ".leaflet-interactive", function () {
          self.poly = this;
          self.my_modal = new bootstrap.Modal("#poly-modal", {
            keyboard: false,
          });
          self.my_modal.show();
        });
      },
      colorPoly(status) {
        var self = this;
        if (status == "lived") {
          $(self.poly).css("fill", "#ff0000");
          $(self.poly).css("fill-opacity", "0.5");
          self.score = self.score + 50;
        } else if (status == "traveled") {
          $(self.poly).css("fill", "#ffff00");
          $(self.poly).css("fill-opacity", "0.5");
          self.score = self.score + 10;
        } else if (status == "stayed") {
          $(self.poly).css("fill", "#0000ff");
          $(self.poly).css("fill-opacity", "0.5");
          self.score = self.score + 30;
        }
        self.my_modal.hide();
      },
      download(): void {
        var self = this;
        self.map.setView([12.3, 122.78], 6);

        setTimeout(function () {
          domtoimage
            .toJpeg(document.getElementById("my-travel"), { quality: 0.9 })
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
