import { z } from 'zod';
import { ZHEXColor } from '../../interfaces/color.interface';

export const ZVirtualScrollTheme = z.object(
    {
        scrollbar: z.object(
            {
                static: ZHEXColor,
                hover : ZHEXColor
            }
        )
    }
);

export const ZPartialVirtualScrollTheme = ZVirtualScrollTheme.partial();

export type VirtualScrollTheme = z.infer<typeof ZVirtualScrollTheme>;
export type PartialVirtualScrollTheme = z.infer<typeof ZPartialVirtualScrollTheme>;
