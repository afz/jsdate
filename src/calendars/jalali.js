/**
 * Jalali date calendar
 *
 * @package    jsData
 */
function jsDateJalali(args) {
    this.invalid = false;
    this.jalaliEpoch = 1948320.5;
    this.gregorianEpoch = 1721425.5;
    var gMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var jMonthDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

    this.leap_persian = function(year) {
        return ((((((year - ((year > 0) ? 474 : 473)) % 2820) + 474) + 38) * 682) % 2816) < 682;
    }

    this.leap_gregorian = function(year) {
        return ((year % 4) == 0) && (((year % 100) != 0) || ((year % 400) == 0));
    }

    this.persian_to_jd = function(year, month, day) {
        var epbase = epyear = exyear = 0;

        exyear = Math.floor((month - 1) / 12);
        year   = year + exyear;
        month  = month - exyear * 12;

        epbase = year - ((year >= 0)? 474 : 473);
        epyear = 474 + (epbase % 2820);

        return day +
            ((month <= 7)? ((month - 1) * 31) : (((month - 1) * 30) + 6)) +
            Math.floor(((epyear * 682) - 110) / 2816) +
            (epyear - 1) * 365 +
            Math.floor(epbase / 2820) * 1029983 +
            (this.jalaliEpoch - 1);
    }

    this.jd_to_persian = function(jd) {
        var year = month = day = wday = depoch = cycle = cyear = ycycle = aux1 = aux2 = yday = 0;

        jd = Math.floor(jd) + 0.5;
        wday = Math.floor((jd + 1.5 + 1)) % 7;

        depoch = jd - this.persian_to_jd(475, 1, 1);
        cycle = Math.floor(depoch / 1029983);
        cyear = depoch % 1029983;
        if (cyear == 1029982) {
            ycycle = 2820;
        } else {
            aux1 = Math.floor(cyear / 366);
            aux2 = cyear % 366;
            ycycle = Math.floor(((2134 * aux1) + (2816 * aux2) + 2815) / 1028522) +
            aux1 + 1;
        }

        year = ycycle + (2820 * cycle) + 474;
        if (year <= 0) {
            year--;
        }
        yday = (jd - this.persian_to_jd(year, 1, 1)) + 1;
        month = (yday <= 186) ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
        day = (jd - this.persian_to_jd(year, month, 1)) + 1;

        return {
            'year'      : year,
            'month'     : month,
            'day'       : day,
            'weekDay'   : wday,
            'monthDays' : jMonthDays[month - 1] + (month == 12? Number(this.leap_persian(year)) : 0),
            'yearDay'   : yday
        };
    }

    this.gregorian_to_jd = function(year, month, day) {
        return (this.gregorianEpoch - 1) +
            (365 * (year - 1)) +
            Math.floor((year - 1) / 4) +
            (-Math.floor((year - 1) / 100)) +
            Math.floor((year - 1) / 400) +
            Math.floor(
                (((367 * month) - 362) / 12) +
                ((month <= 2)? 0 : (this.leap_gregorian(year)? -1 : -2)) +
                day
            );
    }

    var year = month = day = wday = days = hour = minute = second = 0;

    switch ($.type(args)) {
        case 'string':
            args = args.split(/\/|\-|\:/);
            args[1]--;
            // without break - goto array

        case 'array':
            if (args.length) {
                year  = parseInt(args[0]);
                month = parseInt(Number(args[1]) + 1);
                day   = parseInt(args[2]);
                hour    = parseInt(args[3]) || 0;
                minute  = parseInt(args[4]) || 0;
                second  = parseInt(args[5]) || 0;
                days = this.persian_to_jd(year, month, day);
                break;
            }

            args = null;
            // without break - goto number

        case 'number':
            if (isNaN(args)) {
                return new Date(NaN);
            }

            var gdate = new Date();
            if (args != null) {
                gdate.setTime(args*1000);
            }

            year  = parseInt(gdate.getFullYear());
            month = parseInt(Number(gdate.getMonth()) + 1);
            day   = parseInt(gdate.getDate());
            hour   = parseInt(gdate.getHours());
            minute = parseInt(gdate.getMinutes());
            second = parseInt(gdate.getSeconds());
            days = this.gregorian_to_jd(year, month, day);
            break;

        default:
            this.invalid = true;
    }

    if (this.invalid) {
        this.jYear  = 0;
        this.jMonth = 0;
        this.jDay   = 0;
        this.jWeekDay = 0;
        this.jHour   = 0;
        this.jMinute = 0;
        this.jSecond = 0;
        this.isLeapYear = false;
    } else {
        var jdate = this.jd_to_persian(days);

        this.jYear  = jdate.year;
        this.jMonth = jdate.month;
        this.jDay   = jdate.day;
        this.jWeekDay = jdate.weekDay;
        this.jHour   = hour;
        this.jMinute = minute;
        this.jSecond = second;

        // check is given date in a leap year
        this.isLeapYear = this.leap_persian(this.jYear);
    }

    this.getFullYear = function() {
        return this.jYear;
    }

    this.getMonth = function() {
        return this.jMonth - 1;
    }

    this.getDate = function() {
        return this.jDay;
    }

    this.getDay = function() {
        return this.jWeekDay;
    }

    this.getMonthDays = function(month) {
        return (this.isLeapYear && month == 12)? 30 : jMonthDays[month-1];
    }

    this.getHours = function() {
        return this.jHour;
    }

    this.getMinutes = function() {
        return this.jMinute;
    }

    this.getSeconds = function() {
        return this.jSecond;
    }

    this.format = function(format) {
        if (this.invalid) {
            return '';
        }

        var i = 0;
        var result = '';
        format = format? format : 'YYYY-MM-DD';
        while (i < format.length) {
            switch (format.charAt(i)) {
                case 'H':
                    if (format.substr(i, 2) == 'HH') {
                        i++;
                        result += (this.jHour + 1).toString().padStart(2, '0');
                    } else {
                        result += this.jHour + 1;
                    }
                    break;

                case 'm':
                    if (format.substr(i, 2) == 'mm') {
                        i++;
                        result += (this.jMinute + 1).toString().padStart(2, '0');
                    } else {
                        result += this.jMinute + 1;
                    }
                    break;

                case 's':
                    if (format.substr(i, 2) == 'ss') {
                        i++;
                        result += (this.jSecond + 1).toString().padStart(2, '0');
                    } else {
                        result += this.jSecond + 1;
                    }
                    break;

                case 'D':
                    if (format.substr(i, 2) == 'DD') {
                        i++;
                        result += this.jDay.toString().padStart(2, '0');
                    } else {
                        result += this.jDay;
                    }

                    break;

                case 'M':
                    if (format.substr(i, 2) == 'MM') {
                        i++;
                        result += this.jMonth.toString().padStart(2, '0');
                    } else {
                        result += this.jMonth;
                    }
                    break;

                case 'Y':
                    if (format.substr(i, 4) == 'YYYY') {
                        i+= 3;
                        result += this.jYear.toString().padStart(4, '0');
                    } else if(format.substr(i, 3) == 'YYY') {
                        i+= 2;
                        result += this.jYear.toString().padStart(3, '0');
                    } else if(format.substr(i, 2) == 'YY') {
                        i++;
                        result += this.jYear.toString().padStart(2, '0');
                    } else {
                        result += this.jYear;
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

    this.toString = function() {
        return this.jYear + '/' + (this.jMonth) + '/' + this.jDay;
    }
};