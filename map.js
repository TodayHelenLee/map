var map;
      var marker;
      var list;
      var newList;

      var XML = new XMLHttpRequest();
      XML.addEventListener("load", show);
      XML.open(
        "GET",
        "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json"
      );
      XML.send(null);
      function show() {
        list = XML.responseText;
        newList = JSON.parse(list);
      }

      function maps() {
        map = L.map("map", { center: [25.0249211, 121.5075035], zoom: 16 });
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
      }

      var redIcon = new L.Icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      var orangeIcon = new L.Icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      var markers = [];
      function mapp(name, coordinatesA, coordinatesB, ad, ch) {
        if (ad && ch) {
          marker = new L.marker([coordinatesA, coordinatesB]);
        } else if (ad === 0 && ch !== 0) {
          marker = new L.marker([coordinatesA, coordinatesB], {
            icon: redIcon,
          });
        } else {
          marker = new L.marker([coordinatesA, coordinatesB], {
            icon: orangeIcon,
          });
        }

        markers.push(marker);
        marker
          .addTo(map)
          .bindPopup(
            `<h2 style="color:green">${name}</h2><p>大人口罩${ad},小孩口罩${ch}</p>`
          );
        marker.openPopup();
      }

      function clear() {
        var myGroup = L.layerGroup(markers);
        map.addLayer(myGroup);
        myGroup.clearLayers();
      }
      maps();

      var today = new Date();

      var rightNow = "";
      var yr = String(today.getFullYear());
      var mh = String(today.getMonth()+1);
      var de = String(today.getDate());
      var hr = String(today.getHours());
      var me = String(today.getMinutes());
      rightNow = yr + "年" + mh + "月" + de + "日" + hr + "點" + me + "分";

      console.log(rightNow)

      
      var newNote = note.features;
      var countys = [];
      for (var i = 0; i < newNote.length; i++) {
        countys.push(newNote[i].properties.county);
      }
      var newCountys = countys.filter(function (ele, index, self) {
        return self.indexOf(ele) === index && ele !== "";
      });

      var vm = new Vue({
        el: "#app",
        data: {
          itemCounty: "",
          tels: "",
          day: rightNow,
          county: newCountys,
          itemCounty: "",
          itemName: "",
          towns: "",
          list: [],
        },

        components: {
          tel: {
            props: ["items"],

            computed: {
              tail: function () {
                return this.items.slice(4);
              },
              head: function () {
                return this.items.slice(2, 3);
              },
              all: function () {
                return "tel:+886-" + this.head + "-" + this.tail;
              },
            },

            template: `<a :href="all"><i class="fas fa-phone-volume"></i></a>`,
          },
        },

        computed: {
          today: function () {
            return today.toLocaleDateString();
          },

          changeStr: function () {
            var itemCArr = [];
            var notes = note.features;
            for (var i = 0; i < notes.length; i++) {
              if (this.itemCounty === notes[i].properties.county) {
                itemCArr.push(notes[i].properties.town);
              }
            }

            var itemCArrs = itemCArr.filter(function (ele, index, self) {
              return self.indexOf(ele) === index && ele !== "";
            });

            return itemCArrs;
          },
        },
        methods: {
          enterName: function () {
            
            var itemCArr = [];
            var notes = newList.features;
            for (var i = 0; i < notes.length; i++) {
              if (
                this.itemName === notes[i].properties.name.replace("藥局", "")
              ) {
                itemCArr.push({
                  address: notes[i].properties.address,
                  name: notes[i].properties.name,
                  phone: notes[i].properties.phone,
                  mask_adult: notes[i].properties.mask_adult,
                  mask_child: notes[i].properties.mask_child,
                });
                mapp(
                  notes[i].properties.name,
                  notes[i].geometry.coordinates[1],
                  notes[i].geometry.coordinates[0],
                  notes[i].properties.mask_adult,
                  notes[i].properties.mask_child
                );
              }
            }
            this.list = itemCArr;
          },
          changeC: function () {
            clear();
            var itemCArr = [];
            var notes = newList.features;
            for (var i = 0; i < notes.length; i++) {
              if (this.itemCounty === notes[i].properties.county) {
                itemCArr.push({
                  address: notes[i].properties.address,
                  name: notes[i].properties.name,
                  phone: notes[i].properties.phone,
                  mask_adult: notes[i].properties.mask_adult,
                  mask_child: notes[i].properties.mask_child,
                });
                mapp(
                  notes[i].properties.name,
                  notes[i].geometry.coordinates[1],
                  notes[i].geometry.coordinates[0],
                  notes[i].properties.mask_adult,
                  notes[i].properties.mask_child
                );
              }
            }

            this.list = itemCArr;
          },
          changeT: function () {
            clear();
            var itemCArr = [];
            var notes = newList.features;
            for (var i = 0; i < notes.length; i++) {
              if (this.towns === notes[i].properties.town) {
                itemCArr.push({
                  address: notes[i].properties.address,
                  name: notes[i].properties.name,
                  phone: notes[i].properties.phone,
                  mask_adult: notes[i].properties.mask_adult,
                  mask_child: notes[i].properties.mask_child,
                });
                mapp(
                  notes[i].properties.name,
                  notes[i].geometry.coordinates[1],
                  notes[i].geometry.coordinates[0],
                  notes[i].properties.mask_adult,
                  notes[i].properties.mask_child
                );
              }
            }

            this.list = itemCArr;
          },
        },
        mounted() {
          show();
        },
      });