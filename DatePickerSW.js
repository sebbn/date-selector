export default class DatePickerSW
{
    MONTHS_STRINGS = ['JAN', 'FEB', 'MAR', 'APR', 'MAJ', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT' ,'NOV', 'DEC'];

    constructor ()
    {
        this.templateMonth = document.querySelector('#template-month');
        this.templateDay = document.querySelector('#template-day');
        this.monthContainer = document.querySelector('#month-container');
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();

        for (let year = 2022; year <= currentYear; year++)
        {
            let maxMonth = year < currentYear ? 12 : currentMonth + 1;
            for (let month = 0; month < maxMonth; month++)
            {
                this.createMonth(year, month);
            }
        }

        this.monthContainer.scrollTop = this.monthContainer.scrollHeight;

        this.monthContainer.addEventListener('click', function(event) {
            if (event.target && event.target.classList.contains('day-item-inner')) 
            {
                console.log(event.target.year, event.target.month, event.target.day);
            }
        });
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
            inner.year = year;
            inner.month = month;
            inner.day = i;
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
}