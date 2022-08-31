import { differenceInDays, differenceInHours, differenceInMinutes, differenceInMonths, differenceInWeeks, differenceInYears, getDaysInMonth } from 'date-fns';
import { FeTranslationTimeAgo } from '../interfaces/i18n.interface';

export function FeTimeAgo( date: Date, translation: FeTranslationTimeAgo ): any {

    const minutes = differenceInMinutes( new Date(), date );

    if ( minutes < 60 ) {

        if ( minutes < 5 ) {
            return translation.justNow;
        }

        return translation.multipleMinutesAgo( minutes );
    }

    const hours = differenceInHours( new Date(), date );

    if ( hours < 24 ) {

        if ( hours === 1 ) {
            return translation.singleHourAgo;
        }

        return translation.multipleHoursAgo( hours );
    }

    const days = differenceInDays( new Date(), date );

    if ( days <= getDaysInMonth( new Date() ) ) {

        if ( days === 1 ) {
            return translation.singleDayAgo;
        }

        if ( days < 7 ) {
            return translation.multipleDaysAgo( days );
        }

        const weeks = differenceInWeeks( new Date(), date );

        if ( weeks === 1 ) {
            return translation.singleWeekAgo;
        }

        return translation.multipleWeeksAgo( weeks );
    }

    const months = differenceInMonths( new Date(), date );

    if ( months < 12 ) {

        if ( months === 1 ) {
            return translation.singleMonthAgo;
        }

        return translation.multipleMonthsAgo( months );
    }

    const years = differenceInYears( new Date(), date );

    if ( years === 1 ) {
        return translation.singleYearAgo;
    }

    return translation.multipleYearsAgo( years );
}
