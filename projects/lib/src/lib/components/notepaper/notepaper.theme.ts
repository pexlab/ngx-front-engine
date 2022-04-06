import { z } from 'zod';
import { ZHEXColor } from '../../interfaces/color.interface';

export const ZNotepaperTheme = z.object(
    {
        divider         : ZHEXColor,
        highlight       : ZHEXColor,
        button          : ZHEXColor,
        backgroundHoles : ZHEXColor,
        backgroundTop   : ZHEXColor,
        backgroundBottom: ZHEXColor
    }
);

export const ZPartialNotepaperTheme = ZNotepaperTheme.partial();

export type NotepaperTheme = z.infer<typeof ZNotepaperTheme>;
export type PartialNotepaperTheme = z.infer<typeof ZPartialNotepaperTheme>;
