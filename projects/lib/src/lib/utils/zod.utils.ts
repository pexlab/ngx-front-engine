import { z } from 'zod';

export const ZodLiteralRecord = <KeyType extends string,
    ZodValueType extends z.ZodTypeAny>(
    keys: KeyType[],
    zodValueType: ZodValueType
) =>
    z.object(
        keys.reduce(
            ( agg, k ) => (
                {
                    ...agg,
                    [ k ]: zodValueType.optional()
                }
            ),
            {} as Record<KeyType, z.ZodUnion<[ ZodValueType, z.ZodUndefined ]>>
        )
    );