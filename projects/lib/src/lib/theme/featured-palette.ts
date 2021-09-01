import { Color } from './color';
import { ColorPalette, composePalette } from '../interfaces/color.interface';

/** An elegant theme palette shipped with FrontEngine out of the box */
export const FeColorPalette = composePalette(
    {
        
        Green: {
            PaleMint    : '#b8ebd0',
            Mint        : '#b2ff9e',
            TeaGreen    : '#C6EBBE',
            SeaGreen    : '#4EEE94',
            PaleGreen   : '#57bc90',
            Olive       : '#9dad6f',
            Emerald     : '#2ecc71',
            Lime        : '#46E646',
            AppleGreen  : '#56B705',
            BlueishPine : '#015249',
            Forest      : '#004F2D',
            DarkForest  : '#0C2F22',
            PhthaloGreen: '#14342B'
        },
        
        Cyan: {
            Aquamarine    : '#00FFFF',
            Shamrock      : '#28c3a6',
            MintIcepop    : '#3beeb7',
            CaribbeanGreen: '#00C4B1',
            DarkCyan      : '#1194AA',
            Ming          : '#1e6b71',
            DeepOcean     : '#004A59',
            Slate         : '#2d3543',
            Tiber         : '#07393c',
            Gunmetal      : '#2C3539'
        },
        
        Blue: {
            SubtleBlue    : '#B0F6EF',
            PastelBlue    : '#a1c4fd',
            Sky           : '#7BDFF2',
            LightBlue     : '#10d0f9',
            VividLightBlue: '#00B2FF',
            Saltwater     : '#009eb3',
            River         : '#3498db',
            VividSky      : '#0073ff',
            Blue          : '#2552FE',
            VividBlue     : '#0136fe',
            VividDarkBlue : '#020887',
            DarkBlue      : '#004E92',
            NavyBlue      : '#142954'
        },
        
        Yellow: {
            Vanilla     : '#fff4ba',
            PastelYellow: '#fcfb95',
            WarmLight   : '#fbf963',
            VividYellow : '#f7cb1b'
        },
        
        Gold: {
            Gold     : '#d7b45a',
            Luxury   : '#AF986E',
            Marigold : '#F7CE3E',
            LightGold: '#F1E07E',
            DarkGold : '#B1892A'
        },
        
        Orange: {
            StrongPapaya: '#f99a4f',
            Pumpkin     : '#ee7b30',
            VividOrange : '#fd5300',
            Sunset      : '#e6a919'
        },
        
        Brown: {
            Leather    : '#ab987a',
            CoffeeLatte: '#d3b284',
            Wood       : '#D69E63',
            Coffee     : '#7B5847',
            CoffeeStain: '#8b5227',
            VividBrown : '#a0430a',
            Chocolate  : '#54210a'
        },
        
        Red: {
            Apricot       : '#ffcab1',
            Papaya        : '#f29e77',
            RustedCopper  : '#984B43',
            Coral         : '#ff533d',
            ToastedLobster: '#b31500',
            NobleDarkRed  : '#a50104',
            Netflix       : '#e50914',
            Blood         : '#590004'
        },
        
        Pink: {
            SubtlePink        : '#fad0c4',
            GrapefruitCocktail: '#f0a390',
            PalePink          : '#ff789a',
            OrientalPink      : '#c2948a',
            VividPink         : '#FD0054',
            Cosmic            : '#7A436A',
            DarkPink          : '#60213E'
        },
        
        Violet: {
            PaleViolet: '#a18cd1',
            SoftViolet: '#8057e4',
            Jewel     : '#4717f6'
        },
        
        Purple: {
            LilacPlant  : '#ffd1ff',
            Orchid      : '#ff83fa',
            DarkOrchid  : '#fd6ae0',
            SoftMagenta : '#de5cf1',
            Fuchsia     : '#A239CA',
            RoyalPurple : '#6B3CAA',
            Purple      : '#5434b7',
            PurpleOrchid: '#541741',
            Grape       : '#3C1642'
        },
        
        Greyscale: {
            Transparent  : Color.fadeHex( '#ffffff', 0 ),
            White        : '#ffffff',
            Smoke        : '#c9c9c9',
            SubtleGrey   : '#dcdcdc',
            Dust         : '#9c9c9c',
            LightCharcoal: '#646464',
            Charcoal     : '#464646',
            Asbestos     : '#7f8c8d',
            Granite      : '#201F25',
            PitchBlack   : '#000000'
        },
        
        Ink: {
            AlmostMidnight: '#152334',
            BlackOrchid   : '#151316',
            Midnight      : '#011627',
            DarkSlate     : '#191927',
            NightSky      : '#001738',
            DarkNavyBlue  : '#0f1626'
        }
    }
);