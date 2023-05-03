/**
 * Gregorian date calendar
 *
 * @author      Ali Fazelzadeh <afzcode@gmail.com>
 * @copyright   2023 Ali Fazelzadeh
 * @license     http://www.gnu.org/copyleft/lesser.html
 * @package     jsData
 */
function jsDateGregorian(args) {
    this.gdate;
    this.invalid = false;
    let gMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    switch ($.type(args)) {
        case 'number':
            if (isNaN(args)) {
                return new Date(NaN);
            }

            this.gdate = new Date();
            this.gdate.setTime(args*1000);
            break;

        case 'string':
            args = args.split(/\/|\-|\:/);
            args[1]--;
            // without break - goto array

        case 'array':
            if (args.length) {
                this.gdate = new Date(
                    parseInt(args[0]), parseInt(args[1]), parseInt(args[2]),
                    parseInt(args[3]) || 0, parseInt(args[4]) || 0, parseInt(args[5]) || 0
                );
            } else {
                this.gdate = new Date();
            }
            break;

        default:
            this.invalid = true;
    }

    if (this.invalid) {
        this.gYear  = 0;
        this.gMonth = 0;
        this.gDay   = 0;
        this.gWeekDay = 0;
        this.gHour   = 0;
        this.gMinute = 0;
        this.gSecond = 0;
        // check is given date in a leap year
        this.isLeapYear = ((this.gYear%4) == 0 && ((this.gYear%100) != 0 || (this.gYear%400) == 0));
    } else {
        this.gYear  = parseInt(this.gdate.getFullYear());
        this.gMonth = parseInt(this.gdate.getMonth());
        this.gDay   = parseInt(this.gdate.getDate());
        this.gWeekDay = parseInt(this.gdate.getDay());
        this.gHour   = parseInt(this.gdate.getHours());
        this.gMinute = parseInt(this.gdate.getMinutes());
        this.gSecond = parseInt(this.gdate.getSeconds());
        // check is given date in a leap year
        this.isLeapYear = ((this.gYear%4) == 0 && ((this.gYear%100) != 0 || (this.gYear%400) == 0));
    }

    this.getFullYear = function() {
        return this.gYear;
    }

    this.getMonth = function() {
        return this.gMonth;
    }

    this.getDate = function() {
        return this.gDay;
    }

    this.getDay = function() {
        return this.gWeekDay;
    }

    this.getHours = function() {
        return this.gHour;
    }

    this.getMinutes = function() {
        return this.gMinute;
    }

    this.getSeconds = function() {
        return this.gSecond;
    }

    this.getMonthDays = function(month) {
        return (this.isLeapYear && month == 2)? 29 : gMonthDays[month-1];
    }

    this.format = function(format) {
        if (this.invalid) {
            return '';
        }

        let i = 0;
        let result = '';
        format = format? format : 'YYYY-MM-DD';
        while (i < format.length) {
            switch (format.charAt(i)) {
                case 'H':
                    if (format.substr(i, 2) == 'HH') {
                        i++;
                        result += (this.gHour + 1).toString().padStart(2, '0');
                    } else {
                        result += this.gHour + 1;
                    }
                    break;

                case 'm':
                    if (format.substr(i, 2) == 'mm') {
                        i++;
                        result += (this.gMinute + 1).toString().padStart(2, '0');
                    } else {
                        result += this.gMinute + 1;
                    }
                    break;

                case 's':
                    if (format.substr(i, 2) == 'ss') {
                        i++;
                        result += (this.gSecond + 1).toString().padStart(2, '0');
                    } else {
                        result += this.gSecond + 1;
                    }
                    break;

                case 'D':
                    if (format.substr(i, 2) == 'DD') {
                        i++;
                        result += this.gDay.toString().padStart(2, '0');
                    } else {
                        result += this.gDay;
                    }

                    break;

                case 'M':
                    if (format.substr(i, 2) == 'MM') {
                        i++;
                        result += (this.gMonth + 1).toString().padStart(2, '0');
                    } else {
                        result += this.gMonth + 1;
                    }
                    break;

                case 'Y':
                    if (format.substr(i, 4) == 'YYYY') {
                        i+= 3;
                        result += this.gYear.toString().padStart(4, '0');
                    } else if(format.substr(i, 3) == 'YYY') {
                        i+= 2;
                        result += this.gYear.toString().padStart(3, '0');
                    } else if(format.substr(i, 2) == 'YY') {
                        i++;
                        result += this.gYear.toString().padStart(2, '0');
                    } else {
                        result += this.gYear;
                    }
                    break;

                default:
                    result += format.charAt(i);
                    break;
            }

            i++;
        }
        return result;
    }
};