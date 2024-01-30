import { z } from 'zod';
import { ZHexColor } from '../../interfaces/color.interface';

export const ZStepperTheme = z.object(
    {
        text            : ZHexColor,
        buttonIcon      : ZHexColor,
        buttonBackground: ZHexColor
    }
);

export const ZPartialStepperTheme = ZStepperTheme.partial();

export type StepperTheme = z.infer<typeof ZStepperTheme>;
export type PartialStepperTheme = z.infer<typeof ZPartialStepperTheme>;
