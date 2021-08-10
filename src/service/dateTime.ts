import moment from "moment";

class DateTimeService {
  public static getIsoDateTimeWithDays(days: any) {
    let date = moment().add(days, "d").toISOString();
    return date;
  }

  public static getDurationSecondsWithTwoDates(firstDate: any , secondDate: any) {
    var firstM = firstDate === 'now' ? moment() : moment(firstDate);
    var secondM = moment(secondDate);
    var duration = moment.duration(secondM.diff(firstM));
    var seconds = Math.floor(duration.asSeconds());
    return seconds;
  }
}

export default DateTimeService;
