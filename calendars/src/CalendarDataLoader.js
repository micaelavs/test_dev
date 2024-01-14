const JsonReader = require('./JsonReader');

class CalendarDataLoader {

  constructor(calendarNumber) {
    this.calendarNumber = calendarNumber;
  } //constructor parametrizado, inicializa un numero de calendario

  //carga datos de un archivo JSON relacionado con un calendario específico.
  load() {
    const filePath = `./calendars/data/calendar.${this.calendarNumber}.json`;
    return JsonReader.read(filePath);
  }
}

module.exports = CalendarDataLoader;