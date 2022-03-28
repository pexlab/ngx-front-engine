import { composePalette } from '../interfaces/color.interface';
import { Color } from './color';

/** An elegant theme palette shipped with FrontEngine out of the box */
export const FeColorPalette = composePalette(
    {

        Green: {
            PaleMint    : '#b8ebd0',
            Mint        : '#b2ff9e',
            TeaGreen    : '#c6ebbe',
            SeaGreen    : '#4eee94',
            PaleGreen   : '#57bc90',
            Olive       : '#9dad6f',
            Emerald     : '#2ecc71',
            Lime        : '#46e646',
            Malachite   : '#0bda51',
            Nature      : '#4fbf26',
            Salem       : '#0a7b3e',
            Forest      : '#004f2d',
            BlueishPine : '#015249',
            DarkForest  : '#0c2f22',
            PhthaloGreen: '#14342b'
        },

        Cyan: {
            FrozenRiver   : '#b0f6ef',
            Aquamarine    : '#00ffff',
            AgalAquamarine: '#16f5e3',
            Shamrock      : '#28c3a6',
            MintIcepop    : '#3beeb7',
            CaribbeanGreen: '#00c4b1',
            Saltwater     : '#009eb3',
            Ming          : '#1e6b71',
            DeepOcean     : '#004a59',
            Slate         : '#2d3543',
            Tiber         : '#07393c',
            Gunmetal      : '#2c3539'
        },

        Blue: {
            PastelBlue       : '#a1c4fd',
            PaleSky          : '#7bdff2',
            Sky              : '#10d0f9',
            SunnySky         : '#00b2ff',
            NaturalBlue      : '#499dd0',
            River            : '#3498db',
            Azure            : '#0073ff',
            PureBlue         : '#2552fe',
            DarkBlue         : '#004e92',
            CatalinaBlue     : '#23416a',
            VividCatalinaBlue: '#0d257f',
            VividDarkBlue    : '#020887',
            NavyBlue         : '#142954',
            Eclipse          : '#121e48',
            NightSky         : '#001738'
        },

        Yellow: {
            MaskingTape  : '#fbfad9',
            PancakeDough : '#fff4ba',
            Duckling     : '#fcfb95',
            PostIt       : '#fbf963',
            SliceOfCheese: '#feee69',
            Warmth       : '#ffe36d',
            Mustard      : '#e9d83a',
            Honey        : '#ffcc00'
        },

        Gold: {
            LightGold   : '#f1e07e',
            Marigold    : '#f7ce3e',
            Gold        : '#d7b45a',
            MetallicGold: '#d4af37',
            DarkGold    : '#b1892a'
        },

        Orange: {
            Papaya      : '#f29e77',
            StrongPapaya: '#f99a4f',
            IndianOrange: '#ff7722',
            Pumpkin     : '#ee7b30',
            VividOrange : '#fd5300',
            Sunset      : '#e6a919'
        },

        Brown: {
            RosyBrown   : '#c2948a',
            CoffeeLatte : '#d3b284',
            Straw       : '#cebb7e',
            Leather     : '#cb9274',
            Wood        : '#d69e63',
            BrownSugar  : '#b57547',
            RustedCopper: '#984b43',
            Coffee      : '#7b5847',
            CoffeeStain : '#8b5227',
            VividBrown  : '#a0430a',
            Chocolate   : '#54210a'
        },

        Red: {
            Lips      : '#fc585a',
            Coral     : '#ff533d',
            SpanishRed: '#e60026',
            Berry     : '#b31942',
            NobleRed  : '#bc2d29',
            Blood     : '#a50104',
            DarkBlood : '#590004'
        },

        Pink: {
            IcedPink          : '#fddae5',
            CottonCandy       : '#ffd2e7',
            SubtlePink        : '#fad0c4',
            Apricot           : '#ffcab1',
            GrapefruitCocktail: '#f0a390',
            Fluff             : '#f18eae',
            HubbaBubbba       : '#ff789a',
            VividPink         : '#fd0054',
            Cosmic            : '#7a436a',
            DarkPink          : '#60213e'
        },

        Violet: {
            PaleViolet: '#a18cd1',
            SoftViolet: '#8057e4'
        },

        Purple: {
            LilacPlant  : '#ffd1ff',
            Orchid      : '#ff83fa',
            DarkOrchid  : '#fd6ae0',
            SoftMagenta : '#de5cf1',
            Fuchsia     : '#a239ca',
            PurplePowder: '#6b3caa',
            VividPurple : '#6a0f8e',
            PurpleOrchid: '#541741',
            Grape       : '#3c1642'
        },

        Greyscale: {
            SnowWhite     : '#ffffff',
            BrightGrey    : '#ebecf0',
            MistyMorning  : '#e6e6e6',
            Titanium      : '#dcdcdc',
            Smoke         : '#c9c9c9',
            SubtleGrey    : '#b1b1b1',
            CoolGrey      : '#b9bdc1',
            Dust          : '#9c9c9c',
            Asbestos      : '#7f8c8d',
            LightCharcoal : '#646464',
            Charcoal      : '#464646',
            Granite       : '#201f25',
            AlmostMidnight: '#152334',
            Midnight      : '#011627',
            PitchBlack    : '#000000',
            Transparent   : Color.fadeHex( '#ffffff', 0 )
        }
    }
);
