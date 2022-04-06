import { z } from 'zod';
import { ZHEXColor } from '../../interfaces/color.interface';

export const ZStepperTheme = z.object(
    {
        text            : ZHEXColor,
        buttonIcon      : ZHEXColor,
        buttonBackground: ZHEXColor
    }
);

export const ZPartialStepperTheme = ZStepperTheme.partial();

export type StepperTheme = z.infer<typeof ZStepperTheme>;
export type PartialStepperTheme = z.infer<typeof ZPartialStepperTheme>;
