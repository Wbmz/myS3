import moment from 'moment';
moment.locale('fr');

const formatString = (string: string) => {
    return string.toLowerCase().trim();
};

const dateUtils = {
    currentDate: (formatedDate: string) => {
        return moment().format(formatedDate);
    },
    formatDate: (date: string, formatedDate: string) => {
        return moment(new Date(date)).format(formatedDate);
    },
};
export { formatString, dateUtils };
