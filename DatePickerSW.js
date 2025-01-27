export default class DatePickerSW
{
    MONTHS_STRINGS = ['JAN', 'FEB', 'MAR', 'APR', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT' ,'NOV', 'DEC'];

    constructor ()
    {
        this.templateMonth = document.querySelector('#template-month');
        this.templateDay = document.querySelector('#template-day');
        this.monthContainer = document.querySelector('#month-container');
        const currentYear = new Date().getFullYear();

        for (let year = 2022; year <= currentYear; year++)
        {
            for (let month = 0; month < 12; month++)
            {
                this.createMonth(year, month);
            }
        }
    }

    createMonth(year, month)
    {
        const clone = this.templateMonth.content.cloneNode(true);
        const monthItem = clone.firstElementChild;
        const dayContainer = monthItem.querySelector('.month-content');    
        monthItem.querySelector('.month-header').textContent = this.MONTHS_STRINGS[month] + ' ' + year;

        const numberOfDays = this.getDaysInMonth(year, month);
        for (let i = 0; i < numberOfDays; i++)
        {
            const dayItem = this.templateDay.content.cloneNode(true).firstElementChild;
            dayItem.querySelector('.day-item-inner').textContent = (i + 1);
            dayContainer.appendChild(dayItem);
        }

        this.monthContainer.appendChild(clone);
    }

    getDaysInMonth(year, month) 
    {
        return new Date(year, month + 1, 0).getDate();
    }
}