import {
    addWeeks,
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    differenceInMonths,
    differenceInWeeks,
    differenceInYears,
    getDaysInMonth,
    intervalToDuration
} from 'date-fns';
import { FeTranslationTimeAgo } from '../interfaces/i18n.interface';

export function FeTimeAgo( date: Date, translation: FeTranslationTimeAgo ): any {
    
    const interval = intervalToDuration( { start: date, end: new Date() } );
    
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
        
        const intervalOverThisWeek = intervalToDuration( {
            start: addWeeks( date, weeks ),
            end: new Date(),
        } );
        
        if(intervalOverThisWeek.days &&
            (
            // 4 days and onwards
            intervalOverThisWeek.days >= 4 ||
            (
                // 3,5 days and onwards
                intervalOverThisWeek.hours &&
                intervalOverThisWeek.days >= 3 && intervalOverThisWeek.hours >= 12)
            )
        ) {
            return translation.multipleWeeksAndHalfAgo( weeks );
        }
        
        if ( weeks === 1 ) {
            return translation.singleWeekAgo;
        }
        
        return translation.multipleWeeksAgo( weeks );
    }
    
    const months = differenceInMonths( new Date(), date );
    
    if ( months < 12 ) {
    
        if(interval.months && interval.days && interval.months >= 1 && interval.days >= 15) {
            return translation.multipleMonthsAndHalfAgo( months );
        }
        
        if ( months === 1 ) {
            return translation.singleMonthAgo;
        }
        
        return translation.multipleMonthsAgo( months );
    }
    
    const years = differenceInYears( new Date(), date );
    
    if(interval.years && interval.months && interval.years >= 1 && interval.months >= 6) {
        return translation.multipleYearsAndHalfAgo( years );
    }
    
    if ( years === 1 ) {
        return translation.singleYearAgo;
    }
    
    return translation.multipleYearsAgo( years );
}
