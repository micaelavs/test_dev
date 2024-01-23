const CalendarDataLoader = require('./CalendarDataLoader');
const CalendarOperations = require('./CalendarOperationsOld');

class Calendar {
  
    constructor(calendarNumber) { //inicializa un numero de calendario
      this.calendarDataLoader = new CalendarDataLoader(calendarNumber);
      this.calendarOperations = null;
    }
  //carga los datos
    loadData() {
      const calendarData = this.calendarDataLoader.load();
      this.calendarOperations = new CalendarOperations(calendarData);
    }
  //obtener lugares disponibles
    getAvailableSpots(date, duration) {
      if (!this.calendarOperations) {
        this.loadData();
      }
      return this.calendarOperations.getAvailableSpots(date, duration);
    }
  }
  
  module.exports = Calendar;