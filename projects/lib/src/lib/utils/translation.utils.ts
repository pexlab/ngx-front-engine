import { format } from 'date-fns';
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

const TimeAgoEnglish: ( allowHalf: boolean ) => FeTranslationTimeAgo = ( allowHalf ) => ( {
    
    justNow: 'just now',
    
    singleMinuteAgo   : '1 minute ago',
    multipleMinutesAgo: count => count + ' minutes ago',
    
    singleHourAgo   : '1 hour ago',
    multipleHoursAgo: count => count + ' hours ago',
    
    singleDayAgo   : '1 day ago',
    multipleDaysAgo: count => count + ' days ago',
    
    singleWeekAgo          : '1 week ago',
    multipleWeeksAgo       : count => count + ' weeks ago',
    multipleWeeksAndHalfAgo: !allowHalf ?
                             count => count + ' weeks ago' :
                             floor => floor + '.5 weeks ago',
    
    singleMonthAgo          : '1 month ago',
    multipleMonthsAgo       : count => count + ' months ago',
    multipleMonthsAndHalfAgo: !allowHalf ?
                              count => count + ' months ago' :
                              floor => floor + '.5 months ago',
    
    singleYearAgo          : 'over 1 year ago',
    multipleYearsAgo       : count => 'over ' + count + ' years ago',
    multipleYearsAndHalfAgo: !allowHalf ?
                             count => 'over ' + count + ' years ago' :
                             floor => 'over ' + floor + '.5 years ago',
    
    precise: date => format( date, "MM/dd/yyyy 'at' h:mm a" )
} );

export const TimeAgoAbbreviatedEnglish: ( allowHalf: boolean ) => FeTranslationTimeAgo = ( allowHalf ) => ( {
    
    justNow: 'now',
    
    singleMinuteAgo   : '1min.',
    multipleMinutesAgo: count => count + 'min.',
    
    singleHourAgo   : '1hr.',
    multipleHoursAgo: count => count + 'hrs.',
    
    singleDayAgo   : '1d.',
    multipleDaysAgo: count => count + 'd.',
    
    singleWeekAgo          : '1wk.',
    multipleWeeksAgo       : count => count + 'wk.',
    multipleWeeksAndHalfAgo: !allowHalf ?
                             count => count + 'wk.' :
                             floor => floor + '.5wk.',
    
    singleMonthAgo          : '1mo.',
    multipleMonthsAgo       : count => count + 'mo.',
    multipleMonthsAndHalfAgo: !allowHalf ?
                              count => count + 'mo.' :
                              floor => floor + '.5mo.',
    
    singleYearAgo          : '1yr.',
    multipleYearsAgo       : count => count + 'yrs.',
    multipleYearsAndHalfAgo: !allowHalf ?
                             count => count + 'yrs.' :
                             floor => floor + '.5yrs.',
    
    precise: date => format( date, 'M/d/yy' )
} );

const TimeAgoGerman: ( allowHalf: boolean ) => FeTranslationTimeAgo = ( allowHalf ) => ( {
    
    justNow: 'gerade eben',
    
    singleMinuteAgo   : 'vor einer Minute',
    multipleMinutesAgo: count => 'vor ' + count + ' Minuten',
    
    singleHourAgo   : 'vor einer Stunde',
    multipleHoursAgo: count => 'vor ' + count + ' Stunden',
    
    singleDayAgo   : 'vor einem Tag',
    multipleDaysAgo: count => 'vor ' + count + ' Tagen',
    
    singleWeekAgo          : 'vor einer Woche',
    multipleWeeksAgo       : count => 'vor ' + count + ' Wochen',
    multipleWeeksAndHalfAgo: !allowHalf ?
                             count => 'vor ' + count + ' Wochen' :
                             floor => 'vor ' + floor + ',5 Wochen',
    
    singleMonthAgo          : 'vor einem Monat',
    multipleMonthsAgo       : count => 'vor ' + count + ' Monaten',
    multipleMonthsAndHalfAgo: !allowHalf ?
                              count => 'vor ' + count + ' Monaten' :
                              floor => 'vor ' + floor + ',5 Monaten',
    
    singleYearAgo          : 'vor über einem Jahr',
    multipleYearsAgo       : count => 'vor über ' + count + ' Jahren',
    multipleYearsAndHalfAgo: !allowHalf ?
                             count => 'vor über ' + count + ' Jahren' :
                             floor => 'vor über ' + floor + ',5 Jahren',
    
    precise: ( date ) => format( date, "dd.MM.yyyy 'um' HH:mm 'Uhr'" )
} );

export const TimeAgoAbbreviatedGerman: ( allowHalf: boolean ) => FeTranslationTimeAgo = ( allowHalf ) => ( {
    
    justNow: 'eben',
    
    singleMinuteAgo   : '1 Min.',
    multipleMinutesAgo: count => count + ' Min.',
    
    singleHourAgo   : '1 Std.',
    multipleHoursAgo: count => count + ' Std.',
    
    singleDayAgo   : '1 T.',
    multipleDaysAgo: count => count + ' T.',
    
    singleWeekAgo          : '1 Wo.',
    multipleWeeksAgo       : count => count + ' Wo.',
    multipleWeeksAndHalfAgo: !allowHalf ?
                             count => count + ' Wo.' :
                             floor => floor + ',5 Wo.',
    
    singleMonthAgo          : '1 Mo.',
    multipleMonthsAgo       : count => count + ' Mo.',
    multipleMonthsAndHalfAgo: !allowHalf ?
                              count => count + ' Mo.' :
                              floor => floor + ',5 Mo.',
    
    singleYearAgo          : '1 J.',
    multipleYearsAgo       : count => count + ' J.',
    multipleYearsAndHalfAgo: !allowHalf ?
                             count => count + ' J.' :
                             floor => floor + ',5 J.',
    
    precise: ( date ) => format( date, 'd.M.yy' )
} );

export const FeBundledTranslations = {
    Numerals: {
        SuffixEnglish: NumeralSuffixEnglish,
        SuffixGerman : NumeralSuffixGerman
    },
    TimeAgo : {
        English                    : TimeAgoEnglish( true ),
        EnglishOnlyWhole           : TimeAgoEnglish( false ),
        AbbreviatedEnglish         : TimeAgoAbbreviatedEnglish( true ),
        AbbreviatedEnglishOnlyWhole: TimeAgoAbbreviatedEnglish( false ),
        German                     : TimeAgoGerman( true ),
        GermanOnlyWhole            : TimeAgoGerman( false ),
        AbbreviatedGerman          : TimeAgoAbbreviatedGerman( true ),
        AbbreviatedGermanOnlyWhole : TimeAgoAbbreviatedGerman( false )
    }
};