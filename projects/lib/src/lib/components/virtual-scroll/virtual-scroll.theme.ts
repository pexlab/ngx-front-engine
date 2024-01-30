import { z } from 'zod';
import { ZHexColor } from '../../interfaces/color.interface';

export const ZVirtualScrollTheme = z.object(
    {
        scrollbar: z.object(
            {
                static: ZHexColor,
                hover : ZHexColor
            }
        )
    }
);

export const ZPartialVirtualScrollTheme = ZVirtualScrollTheme.partial();

export type VirtualScrollTheme = z.infer<typeof ZVirtualScrollTheme>;
export type PartialVirtualScrollTheme = z.infer<typeof ZPartialVirtualScrollTheme>;
