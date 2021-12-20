export type PlainTranslation = string;
export type CountingTranslation = ( count: number ) => string;

export interface FeTranslationTimeAgo {
    
    justNow: PlainTranslation,
    
    singleMinuteAgo: PlainTranslation,
    multipleMinutesAgo: CountingTranslation,
    
    singleHourAgo: PlainTranslation,
    multipleHoursAgo: CountingTranslation,
    
    singleDayAgo: PlainTranslation,
    multipleDaysAgo: CountingTranslation,
    
    singleWeekAgo: PlainTranslation,
    multipleWeeksAgo: CountingTranslation,
    
    singleMonthAgo: PlainTranslation,
    multipleMonthsAgo: CountingTranslation,
    
    singleYearAgo: PlainTranslation,
    multipleYearsAgo: CountingTranslation,
}