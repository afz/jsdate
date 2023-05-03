/**
 * Extend JavaScript Date object to support Jalali calendar
 *
 * @package    jsData
 */
function jsDate(calendar, args) {
    calendar = calendar || '';
    switch (calendar.toLowerCase()) {
        case 'jalali':
            return new jsDateJalali(args);
            break;

        default:
            // Gregorian calendar
            return new jsDateGregorian(args);
    }
};