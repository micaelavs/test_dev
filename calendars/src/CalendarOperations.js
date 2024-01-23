const moment = require('moment');

class CalendarOperations {

    constructor(calendarData) {
        this.data = calendarData;
    }
    //Gestion y disponibilidad de horarios en un calendario
    //realiza operaciones específicas relacionadas con la disponibilidad de horarios en un calendario
    //que determina y devuelve lugares disponibles para una fecha y duración específica
    //duración específica: período de tiempo durante el cual se busca determinar la disponibilidad de lugares en el calendario
    getAvailableSpots(date, duration) {
        //toma una fecha y una duracion especifica y realiza una serie de pasos para determinar y devolver lugares disponibles para esa fecha y  duracion
        const dateISO = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD');
        const durationBefore = this.data.durationBefore;
        const durationAfter = this.data.durationAfter;

        const daySlots = this.getSlotsForDate(date);

        const realSpots = this.filterAvailableSlots(date, daySlots, duration);

        const arrSlot = this.generateTimeSlots(dateISO, realSpots, durationBefore, duration, durationAfter);

        return arrSlot;
    } 
    //obtiene los espacios disponibles para una fecha dada, utiliza iso de moment
    getSlotsForDate(date) {
        return this.data.slots[date] || [];
    }
    //filtra espacios disponibles para la fecha dada, eliminando aquellas que tienen conflictos con las sesiones existentes.
    filterAvailableSlots(date, daySlots, duration) {
        return daySlots.filter(daySlot => {
        if (this.hasConflicts(date, daySlot)) {
            return false;
        }
        return true;
        });
    }
    //vrifica si un espacio disponible especifico en un día dado tiene conflictos con las sesiones existentes programadas para esa fecha en el calendario
    hasConflicts(date, daySlot) {
        if (this.data.sessions && this.data.sessions[date]) {
            return this.data.sessions[date].some(sessionSlot => {
                const slotStart = moment(date + ' ' + daySlot.start).valueOf();
                const slotEnd = moment(date + ' ' + daySlot.end).valueOf();
                const sessionStart = moment(date + ' ' + sessionSlot.start).valueOf();
                const sessionEnd = moment(date + ' ' + sessionSlot.end).valueOf();

                return (sessionStart < slotEnd && sessionEnd > slotStart);
            });
        }
        return false;
    }
   //genera los espacios de tiempo reales sin conflictos, aplicando los periodos antes y despues de la duracion específica.
    generateTimeSlots(dateISO, realSpots, durationBefore, duration, durationAfter) {
        const arrSlot = [];

        realSpots.forEach(daySlot => {
        const resultSlot = this.getOneMiniSlot(dateISO, daySlot, durationBefore, duration, durationAfter);
        if (resultSlot) {
            arrSlot.push(resultSlot);
        }
        });

        return arrSlot;
    }
    //Dado un espacio específico en un dia, genera un espacio mas chico dentro el
    //aplicando los periodos antes y despues de la duracion especifica. 
    //Utiliza un bucle while para generar múltiples ranuras si es necesario.
    getOneMiniSlot(dateISO, daySlot, durationBefore, duration, durationAfter) {
        let startHour = moment(dateISO + ' ' + daySlot.start).valueOf();
        let endHour = moment(dateISO + ' ' + daySlot.end).valueOf();
        let init = 0;

        const arrSlot = [];

        while (startHour + (durationBefore + duration + durationAfter) * 60000 <= endHour) {
        const clientStartHour = startHour + durationBefore * 60000;
        const clientEndHour = clientStartHour + duration * 60000;
        const slot = {
            startHour: new Date(startHour),
            endHour: new Date(startHour + (durationBefore + duration + durationAfter) * 60000),
            clientStartHour: new Date(clientStartHour),
            clientEndHour: new Date(clientEndHour),
        };

        arrSlot.push(slot);

        startHour = startHour + duration * 60000;
        init += 1;
        }

        return arrSlot;
    }

}

module.exports = CalendarOperations;