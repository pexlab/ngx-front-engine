import { z } from 'zod';
import { ZHexColor } from '../../interfaces/color.interface';

export const ZNotepaperTheme = z.object(
    {
        divider         : ZHexColor,
        highlight       : ZHexColor,
        button          : ZHexColor,
        backgroundHoles : ZHexColor,
        backgroundTop   : ZHexColor,
        backgroundBottom: ZHexColor
    }
);

export const ZPartialNotepaperTheme = ZNotepaperTheme.partial();

export type NotepaperTheme = z.infer<typeof ZNotepaperTheme>;
export type PartialNotepaperTheme = z.infer<typeof ZPartialNotepaperTheme>;
