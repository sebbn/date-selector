export default class DatePickerSW
{
    MONTHS_STRINGS = ['JAN', 'FEB', 'MAR', 'APR', 'MAJ', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT' ,'NOV', 'DEC'];
    MONTHS_STRINGS_NICE = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt' ,'Nov', 'Dec'];

    firstClick = true;

    constructor ()
    {
        this.startDateField = document.querySelector('#start-date-input-field');
        this.endDateField = document.querySelector('#end-date-input-field');
        this.templateMonth = document.querySelector('#template-month');
        this.templateDay = document.querySelector('#template-day');
        this.monthContainer = document.querySelector('#month-container');
        this.presetContainer = document.querySelector('#preset-container').querySelector('#item-container');
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        const currentDay = new Date().getDate() - 1;

        this.startDate = {year: currentYear, month: currentMonth, day: currentDay};
        this.endDate = {year: currentYear, month: currentMonth, day: currentDay};

        this.setInputFields();

        for (let year = 2022; year <= currentYear; year++)
        {
            let maxMonth = year < currentYear ? 12 : currentMonth + 1;
            for (let month = 0; month < maxMonth; month++)
            {
                this.createMonth(year, month);
            }
        }

        this.monthContainer.scrollTop = this.monthContainer.scrollHeight;

        this.monthContainer.addEventListener('click', (event) => {
            if (event.target && event.target.classList.contains('day-item-inner')) 
            {
                const date = event.target.date;
                if (this.firstClick)
                {
                    this.startDate = date;
                    this.firstClick = false;
                    this.clearRange();
                    this.endDate = this.startDate;
                    this.setRange(this.startDate, null);
                }
                else
                {
                    this.endDate = date;
                    this.firstClick = true;

                    if (this.isDateEarlier(this.endDate, this.startDate))
                    {
                        const temp = this.startDate;
                        this.startDate = this.endDate;
                        this.endDate = temp;
                    }
            
                    this.setRange(this.startDate, this.endDate);
                }

                event.target.closest('.day-item').classList.add('pre-selected');
                this.setInputFields();
            }
        });

        this.startDateField.addEventListener('input', () => {
            const date = this.stringToDate(this.startDateField.textContent);
            let valid = false;

            if (this.isDateValid(date))
            {
                this.startDate = date;
                valid = true;
            }

            if (valid)
                this.setRange(this.startDate, this.endDate)
        });

        this.presetContainer.addEventListener('click', (event) => {
            if (event.target && event.target.classList.contains('preset-item')) 
            {
                const value = event.target.id;

                this.setPreset(value);
            }
        });

        if (this.isDateEarlier(this.endDate, this.startDate))
        {
            const temp = this.startDate;
            this.startDate = this.endDate;
            this.endDate = temp;
        }

        this.setRange(this.startDate, this.endDate)
    }

    createMonth(year, month)
    {
        const clone = this.templateMonth.content.cloneNode(true);
        const monthItem = clone.firstElementChild;
        const dayContainer = monthItem.querySelector('.month-content');    
        monthItem.querySelector('.month-header').textContent = this.MONTHS_STRINGS[month] + ' ' + year;

        const startDay = this.getMonthStartDayName(year, month);

        for (let skipDay = 0; skipDay < startDay; skipDay++)
        {
            const dayItem = this.templateDay.content.cloneNode(true).firstElementChild;
            dayItem.querySelector('.day-item-inner').remove();
            dayContainer.appendChild(dayItem);
        }

        const numberOfDays = this.getDaysInMonth(year, month);
        for (let i = 0; i < numberOfDays; i++)
        {
            const dayItem = this.templateDay.content.cloneNode(true).firstElementChild;
            const inner = dayItem.querySelector('.day-item-inner');
            inner.textContent = (i + 1);
            inner.date = {year: year, month: month, day: i};
            dayContainer.appendChild(dayItem);
        }

        this.monthContainer.appendChild(clone);
    }

    getDaysInMonth(year, month) 
    {
        return new Date(year, month + 1, 0).getDate();
    }

    getMonthStartDayName(year, month) 
    {
        const dayNames = [6, 0, 1, 2, 3, 4, 5];
        const firstDay = new Date(year, month, 1).getDay();
        return dayNames[firstDay];
    }

    clearRange()
    {
        const items = document.querySelectorAll('.day-item-inner');

        items.forEach(item => {
            const dayItem = item.closest('.day-item');
            dayItem.classList.remove('selected');
            dayItem.classList.remove('selected-left');
            dayItem.classList.remove('selected-right');
            dayItem.classList.remove('pre-selected');
        });
    }

    setRange(startDate, endDate)
    {
        const items = document.querySelectorAll('.day-item-inner');

        items.forEach(item => {
            const dayItem = item.closest('.day-item');
            dayItem.classList.remove('selected');
            dayItem.classList.remove('selected-left');
            dayItem.classList.remove('selected-right');

            if (endDate && !this.isDateEqual(startDate, endDate))
            {
                dayItem.classList.remove('pre-selected');

                if (this.isDateEqual(startDate, item.date))
                    dayItem.classList.add('selected-left');
                else if (this.isDateEqual(endDate, item.date))
                    dayItem.classList.add('selected-right');
                else if (this.isDateBetween(item.date, startDate, endDate))
                    dayItem.classList.add('selected');
            }
            else if (endDate && this.isDateEqual(startDate, endDate))
            {
                if (this.isDateEqual(startDate, item.date))
                    dayItem.classList.add('pre-selected');
            }
        });
    }

    setInputFields()
    {
        this.startDateField.textContent = this.MONTHS_STRINGS_NICE[this.startDate.month] + ' ' + (this.startDate.day + 1) + ', ' + this.startDate.year;
        this.endDateField.textContent = this.MONTHS_STRINGS_NICE[this.endDate.month] + ' ' + (this.endDate.day + 1) + ', ' + this.endDate.year;
    }

    isDateEqual(a, b)
    {
        return a.year == b.year && a.month == b.month && a.day == b.day;
    }
    
    isDateBetween(date, start, end)
    {
        const dateValue = date.year * 10000 + date.month * 100 + date.day;
        const startValue = start.year * 10000 + start.month * 100 + start.day;
        const endValue = end.year * 10000 + end.month * 100 + end.day;

        return dateValue >= startValue && dateValue <= endValue;
    }

    isDateEarlier(a, b)
    {
        const aValue = a.year * 10000 + a.month * 100 + a.day;
        const bValue = b.year * 10000 + b.month * 100 + b.day;

        return aValue < bValue;
    }

    isDateValid(date)
    {
        if (this.isNumber(date.year) && this.isNumber(date.month) && this.isNumber(date.day))
            return true;

        return false;
    }

    isNumber(value) 
    {
        return typeof value === 'number' && !isNaN(value);
    }

    stringToDate(str)
    {
        const normalizedString = str.replace(/,/g, '').toLowerCase();

        const months = {
            jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
            jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
        };

        const parts = normalizedString.split(/\s+/);

        let year, month, day;

        const isYear = str => /^\d{4}$/.test(str);

        const isMonth = str => months[str] !== undefined;

        parts.forEach(part => {
            if (isYear(part)) {
                year = parseInt(part, 10);
            } else if (isMonth(part)) {
                month = months[part];
            } else if (!isNaN(part)) {
                day = parseInt(part, 10) - 1;
            }
        });

        return { year: year, month: month, day: day };
    }

    setPreset(value)
    {
        switch (value)
        {
            case 'today':
                const currentYear = new Date().getFullYear();
                const currentMonth = new Date().getMonth();
                const currentDay = new Date().getDate() - 1;
                this.startDate = {year: currentYear, month: currentMonth, day: currentDay};
                this.endDate = {year: currentYear, month: currentMonth, day: currentDay};
                break;
            case 'yesterday':
                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                const year = yesterday.getFullYear();
                const month = yesterday.getMonth();
                const day = yesterday.getDate() - 1;
                this.startDate = {year: year, month: month, day: day};
                this.endDate = {year: year, month: month, day: day};
                break;
            case 'this_week':
                const thisWeek = this.getThisWeek();
                this.startDate = thisWeek.start;
                this.endDate = thisWeek.end;
                break;
            case 'last_week':
                const lastWeek = this.getLastWeek();
                this.startDate = lastWeek.start;
                this.endDate = lastWeek.end;
                break;
            case 'this_month':
                const thisMonth = this.getThisMonth();
                this.startDate = thisMonth.start;
                this.endDate = thisMonth.end;
                break;
            case 'last_month':
                const lastMonth = this.getLastMonth();
                this.startDate = lastMonth.start;
                this.endDate = lastMonth.end;
                break;
            case 'last_7':
                const last7 = this.getLast7Days();
                this.startDate = last7.start;
                this.endDate = last7.end;
                break;
            case 'last_30':
                const last30 = this.getLast30Days();
                this.startDate = last30.start;
                this.endDate = last30.end;
                break;
            case 'last_90':
                const last90 = this.getLast90Days();
                this.startDate = last90.start;
                this.endDate = last90.end;
                break;
            case 'last_12':
                const last12 = this.getLast12Months();
                this.startDate = last12.start;
                this.endDate = last12.end;
                break;
            case 'last_year':
                const lastYear = this.getLastYear();
                this.startDate = lastYear.start;
                this.endDate = lastYear.end;
                break;
            case 'this_year':
                const thisYear = this.getThisYear();
                this.startDate = thisYear.start;
                this.endDate = thisYear.end;
                break;
            case 'from_start':
                const fromStart = this.getFromStart();
                this.startDate = fromStart.start;
                this.endDate = fromStart.end;
                break;
            default:
                break;
        }

        this.setInputFields();
        this.clearRange();
        this.setRange(this.startDate, this.endDate);
    }

    getThisWeek()
    {
        const today = new Date(); 
        const dayOfWeek = today.getDay();

        const diffToMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
    
        const monday = new Date(today);
        monday.setDate(today.getDate() - diffToMonday);

        const startOfWeek = { year: monday.getFullYear(), month: monday.getMonth(), day: monday.getDate() - 1};
        const endOfWeek = { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() - 1};

        return { start: startOfWeek, end: endOfWeek };
    }

    getLastWeek()
    {
        const today = new Date();
        const dayOfWeek = today.getDay();
    
        const diffToLastMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + 7;
    
        const lastMonday = new Date(today);
        lastMonday.setDate(today.getDate() - diffToLastMonday);
    
        const lastSunday = new Date(lastMonday);
        lastSunday.setDate(lastMonday.getDate() + 6);

        const startOfWeek = { year: lastMonday.getFullYear(), month: lastMonday.getMonth(), day: lastMonday.getDate() - 1};
        const endOfWeek = { year: lastSunday.getFullYear(), month: lastSunday.getMonth(), day: lastSunday.getDate() - 1};

        return { start: startOfWeek, end: endOfWeek };
    }

    getThisMonth()
    {
        const today = new Date(); 

        const startOfWeek = { year: today.getFullYear(), month: today.getMonth(), day: 0};
        const endOfWeek = { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() - 1};

        return { start: startOfWeek, end: endOfWeek };
    }

    getLastMonth()
    {
        const today = new Date(); 

        const firstDateOfLastMonth = new Date(today);
        firstDateOfLastMonth.setMonth(today.getMonth() - 1);
        firstDateOfLastMonth.setDate(1);
    
        const lastDateOfLastMonth = new Date(today);
        lastDateOfLastMonth.setMonth(today.getMonth());
        lastDateOfLastMonth.setDate(0);

        const startOfWeek = { year: firstDateOfLastMonth.getFullYear(), month: firstDateOfLastMonth.getMonth(), day: 0};
        const endOfWeek = { year: lastDateOfLastMonth.getFullYear(), month: lastDateOfLastMonth.getMonth(), day: lastDateOfLastMonth.getDate() - 1};

        return { start: startOfWeek, end: endOfWeek };
    }

    getLast7Days()
    {
        const today = new Date();

        const firstDate = new Date(today);
        firstDate.setDate(today.getDate() - 6);

        const startOfWeek = { year: firstDate.getFullYear(), month: firstDate.getMonth(), day: firstDate.getDate() - 1};
        const endOfWeek = { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() - 1};

        return { start: startOfWeek, end: endOfWeek };
    }

    getLast30Days()
    {
        const today = new Date();

        const firstDate = new Date(today);
        firstDate.setDate(today.getDate() - 29);

        const startOfWeek = { year: firstDate.getFullYear(), month: firstDate.getMonth(), day: firstDate.getDate() - 1};
        const endOfWeek = { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() - 1};

        return { start: startOfWeek, end: endOfWeek };
    }

    getLast90Days()
    {
        const today = new Date();

        const firstDate = new Date(today);
        firstDate.setDate(today.getDate() - 89);

        const startOfWeek = { year: firstDate.getFullYear(), month: firstDate.getMonth(), day: firstDate.getDate() - 1};
        const endOfWeek = { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() - 1};

        return { start: startOfWeek, end: endOfWeek };
    }

    getLast12Months()
    {
        const today = new Date();

        const startOfWeek = { year: today.getFullYear() - 1, month: today.getMonth(), day: today.getDate() - 1};
        const endOfWeek = { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() - 1};

        return { start: startOfWeek, end: endOfWeek };
    }

    getLastYear()
    {
        const today = new Date();
    
        const startOfLastYear = new Date(today);
        startOfLastYear.setFullYear(today.getFullYear() - 1);
        startOfLastYear.setMonth(0);
        startOfLastYear.setDate(1);
    
        const endOfLastYear = new Date(today);
        endOfLastYear.setFullYear(today.getFullYear() - 1);
        endOfLastYear.setMonth(11);
        endOfLastYear.setDate(31);

        const startOfWeek = { year: startOfLastYear.getFullYear() - 1, month: startOfLastYear.getMonth(), day: startOfLastYear.getDate() - 1};
        const endOfWeek = { year: endOfLastYear.getFullYear(), month: endOfLastYear.getMonth(), day: endOfLastYear.getDate() - 1};

        return { start: startOfWeek, end: endOfWeek };
    }

    getThisYear()
    {
        const today = new Date();

        const startOfThisYear = new Date(today);
        startOfThisYear.setFullYear(today.getFullYear());
        startOfThisYear.setMonth(0);
        startOfThisYear.setDate(1);

        const startOfWeek = { year: startOfThisYear.getFullYear(), month: startOfThisYear.getMonth(), day: startOfThisYear.getDate() - 1};
        const endOfWeek = { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() - 1};

        return { start: startOfWeek, end: endOfWeek };
    }

    getFromStart()
    {
        const today = new Date();

        const startOfWeek = { year: 2023, month: 8, day: 0};
        const endOfWeek = { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() - 1};

        return { start: startOfWeek, end: endOfWeek };
    }
}