export type PlainTranslation = string;
export type CountingTranslation = ( count: number ) => string;
export type PreciseTranslation = ( date: Date ) => string;

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
    multipleWeeksAndHalfAgo: CountingTranslation,
    
    singleMonthAgo: PlainTranslation,
    multipleMonthsAgo: CountingTranslation,
    multipleMonthsAndHalfAgo: CountingTranslation,
    
    singleYearAgo: PlainTranslation,
    multipleYearsAgo: CountingTranslation,
    multipleYearsAndHalfAgo: CountingTranslation,
    
    precise: PreciseTranslation,
}