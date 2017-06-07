(function() {
  'use strict';

  angular.module('app.components')
    .factory('sensorUtils', sensorUtils);

    sensorUtils.$inject = ['timeUtils'];
    function sensorUtils(timeUtils) {
      var service = {
        getRollup: getRollup,
        getSensorName: getSensorName,
        getSensorUnit: getSensorUnit,
        getSensorValue: getSensorValue,
        getSensorPrevValue: getSensorPrevValue,
        getSensorIcon: getSensorIcon,
        getSensorArrow: getSensorArrow,
        getSensorColor: getSensorColor,
        getSensorDescription: getSensorDescription
      };
      return service;

      ///////////////

      function getRollup(dateFrom, dateTo) {
        var rangeDays = timeUtils.getCurrentRange(dateFrom, dateTo, {format: 'd'});
        
        var rollup;
        if(rangeDays <= 1) {
          rollup = '10m';
        } else if(rangeDays <= 7) {
          rollup = '1h';//rollup = '15m';
        } else if(rangeDays > 7) {
          rollup = '1d';
        }
        return rollup;
      }

      function getSensorName(sensor) {
        var nameParts = sensor.split(':');
        var mainName = nameParts.length > 0 ? nameParts[0] : sensor.name;

        var sensorName = (mainName.toUpperCase() === mainName) ? mainName : mainName.replace(/([A-Z])/g, ' $1').toUpperCase();

        if (nameParts.length > 1) {
          nameParts.shift();
          var sensorExtra = nameParts.join(' ');
          sensorExtra = (sensorExtra.toUpperCase() === sensorExtra) ? sensorExtra : sensorExtra.replace(/([A-Z])/g, ' $1').toUpperCase();
          sensorName += (' (' + sensorExtra + ')');
        }
        return sensorName;
      }

      function getSensorUnit(sensor, sensorData) {
        if(sensorData.unit) {
          return sensor.unit.replace(/([A-Z])/g, ' $1').toLowerCase();
        } else if(sensorData.type) {
          var nameParts = sensor.split(':');
          if (nameParts.length > 1) {
            var sensorExtra = nameParts[nameParts.length-1];
            sensorExtra = (sensorExtra.toUpperCase() === sensorExtra) ? sensorExtra : sensorExtra.replace(/([A-Z])/g, ' $1').toUpperCase();
            return sensorExtra;
          }
        } else {
          return 'No name';
        }
      }

      function getSensorValue(sensor) {
        var value = sensor.value;
        if(isNaN(parseInt(value))) {
          value =  'N/A';
        }
        else if(sensor.type === 'coords') {
          value = sensor.value;
        } else {
          value = value.toString();
          if(value.indexOf('.') !== -1) {
            value = value.slice(0, value.indexOf('.') + 3);
          }
        }
        return value;
      }


      function getSensorPrevValue(sensor) {
        /*jshint camelcase: false */
        var prevValue = sensor.prev_value;
        return (prevValue && prevValue.toString() ) || 0;
      }

      function getSensorIcon(sensorName) {

        switch(sensorName) {
          case 'TEMPERATURE':
            return './assets/images/temperature_icon.svg';
          case 'TEMPERATURE (AMBIENT)':
            return './assets/images/temperature_icon.svg';
          case 'HUMIDITY':
            return './assets/images/humidity_icon.svg';

          case 'LIGHT':
            return './assets/images/light_icon.svg';

          case 'SOUND':
            return './assets/images/sound_icon.svg';

          case 'CO':
            return './assets/images/co_icon.svg';

          case 'NO2':
            return './assets/images/no2_icon.svg';

          case 'NETWORKS':
            return './assets/images/networks_icon.svg';

          case 'BATTERY LEVEL':
            return './assets/images/battery_icon.svg';

          case 'BATTERY':
            return './assets/images/battery_icon.svg';

          case 'SOLAR PANEL':
            return './assets/images/solar_panel_icon.svg';

          default:
            return './assets/images/avatar.svg';
        }
      }

      function getSensorArrow(currentValue, prevValue) {
        currentValue = parseInt(currentValue) || 0;

        if (!parseInt(prevValue)) {
          return null;
        }

        if(currentValue > prevValue) {
          return './assets/images/arrow_up_icon.svg';
        } else if(currentValue < prevValue) {
          return './assets/images/arrow_down_icon.svg';
        } else {
          return './assets/images/equal_icon.svg';
        }
      }

      function getSensorColor(sensor, collectionID) {
        var colors = ['#00FFA8','#4fc3f7','#ffee58','#f06292','#ef4070', '#ffc107','#8bc34a','#9575cd','#fff9c4'];
        if(collectionID > colors.length) {
          collectionID = 0;
        }
        return colors[collectionID];
      }

      function getSensorDescription(sensorID, sensorTypes) {
        return _(sensorTypes)
          .chain()
          .find(function(sensorType) {
            return sensorType.id === sensorID;
          })
          .value()
          .description;
      }
    }
})();
