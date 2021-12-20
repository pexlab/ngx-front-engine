import * as dayjs from 'dayjs';
import { FeTranslationTimeAgo } from '../interfaces/i18n.interface';

export function FeTimeAgo( date: Date, translation: FeTranslationTimeAgo ): any {
    
    const minutes = dayjs().diff( date, 'minutes' );
    
    if ( minutes < 60 ) {
        
        if ( minutes < 5 ) {
            return translation.justNow;
        }
        
        return translation.multipleMinutesAgo( minutes );
    }
    
    const hours = dayjs().diff( date, 'hours' );
    
    if ( hours < 24 ) {
        
        if ( hours === 1 ) {
            return translation.singleHourAgo;
        }
        
        return translation.multipleHoursAgo( hours );
    }
    
    const days = dayjs().diff( date, 'days' );
    
    if ( days <= dayjs().daysInMonth() ) {
        
        if ( days === 1 ) {
            return translation.singleDayAgo;
        }
        
        if ( days < 7 ) {
            return translation.multipleDaysAgo( days );
        }
        
        const weeks = dayjs().diff( date, 'weeks' );
        
        if ( weeks === 1 ) {
            return translation.singleWeekAgo;
        }
        
        return translation.multipleWeeksAgo( weeks );
    }
    
    const months = dayjs().diff( date, 'months' );
    
    if ( months < 12 ) {
        
        if ( months === 1 ) {
            return translation.singleMonthAgo;
        }
        
        return translation.multipleMonthsAgo( months );
    }
    
    const years = dayjs().diff( date, 'years' );
    
    if ( years === 1 ) {
        return translation.singleYearAgo;
    }
    
    return translation.multipleYearsAgo( years );
}