import { FeTranslationTimeAgo } from '../interfaces/i18n.interface';

/* Bundled translations */

function NumeralSuffixEnglish( number: number ): string {
    
    if ( number > 10 && number <= 20 ) {
        return 'th';
    }
    
    const lastDigit = +( number.toString().split( '' ).pop() || 0 );
    
    switch ( lastDigit ) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
}

function NumeralSuffixGerman( number: number ): string {
    return '.';
}

const TimeAgoEnglish: FeTranslationTimeAgo = {
    
    justNow: 'just now',
    
    singleMinuteAgo   : '1 minute ago',
    multipleMinutesAgo: count => count + ' minutes ago',
    
    singleHourAgo   : '1 hour ago',
    multipleHoursAgo: count => count + ' hours ago',
    
    singleDayAgo   : '1 day ago',
    multipleDaysAgo: count => count + ' days ago',
    
    singleWeekAgo   : '1 week ago',
    multipleWeeksAgo: count => count + ' weeks ago',
    
    singleMonthAgo   : '1 month ago',
    multipleMonthsAgo: count => count + ' months ago',
    
    singleYearAgo   : '1 year ago',
    multipleYearsAgo: count => count + ' years ago'
};

export const TimeAgoAbbreviatedEnglish: FeTranslationTimeAgo = {
    
    justNow: 'now',
    
    singleMinuteAgo   : '1min.',
    multipleMinutesAgo: count => count + 'min.',
    
    singleHourAgo   : '1hr.',
    multipleHoursAgo: count => count + 'hrs.',
    
    singleDayAgo   : '1d.',
    multipleDaysAgo: count => count + 'd.',
    
    singleWeekAgo   : '1wk.',
    multipleWeeksAgo: count => count + 'wk.',
    
    singleMonthAgo   : '1mo.',
    multipleMonthsAgo: count => count + 'mo.',
    
    singleYearAgo   : '1yr.',
    multipleYearsAgo: count => count + 'yrs.'
};

const TimeAgoGerman: FeTranslationTimeAgo = {
    
    justNow: 'gerade eben',
    
    singleMinuteAgo   : 'vor einer Minute',
    multipleMinutesAgo: count => 'vor ' + count + ' Minuten',
    
    singleHourAgo   : 'vor einer Stunde',
    multipleHoursAgo: count => 'vor ' + count + ' Stunden',
    
    singleDayAgo   : 'vor einem Tag',
    multipleDaysAgo: count => 'vor ' + count + ' Tagen',
    
    singleWeekAgo   : 'vor einer Woche',
    multipleWeeksAgo: count => 'vor ' + count + ' Wochen',
    
    singleMonthAgo   : 'vor einem Monat',
    multipleMonthsAgo: count => 'vor ' + count + ' Monaten',
    
    singleYearAgo   : 'vor einem Jahr',
    multipleYearsAgo: count => 'vor ' + count + ' Jahren'
};

export const TimeAgoAbbreviatedGerman: FeTranslationTimeAgo = {
    
    justNow: 'eben',
    
    singleMinuteAgo   : '1 Min.',
    multipleMinutesAgo: count => count + ' Min.',
    
    singleHourAgo   : '1 Std.',
    multipleHoursAgo: count => count + ' Std.',
    
    singleDayAgo   : '1 T.',
    multipleDaysAgo: count => count + ' T.',
    
    singleWeekAgo   : '1 Wo.',
    multipleWeeksAgo: count => count + ' Wo.',
    
    singleMonthAgo   : '1 Mo.',
    multipleMonthsAgo: count => count + ' Mo.',
    
    singleYearAgo   : '1 J.',
    multipleYearsAgo: count => count + ' J.'
};

export const FeBundledTranslations = {
    Numerals: {
        SuffixEnglish: NumeralSuffixEnglish,
        SuffixGerman : NumeralSuffixGerman
    },
    TimeAgo : {
        English           : TimeAgoEnglish,
        AbbreviatedEnglish: TimeAgoAbbreviatedEnglish,
        German            : TimeAgoGerman,
        AbbreviatedGerman : TimeAgoAbbreviatedGerman
    }
};