/**
 * Extend JavaScript Date object to support Jalali calendar
 *
 * @author      Ali Fazelzadeh <afzcode@gmail.com>
 * @copyright   2023 Ali Fazelzadeh
 * @license     http://www.gnu.org/copyleft/lesser.html
 * @package     jsData
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