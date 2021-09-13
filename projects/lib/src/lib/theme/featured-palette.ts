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
            Nature      : '#4FBF26',
            BlueishPine : '#015249',
            Forest      : '#004F2D',
            DarkForest  : '#0C2F22',
            PhthaloGreen: '#14342B'
        },
        
        Cyan: {
            FrozenRiver   : '#B0F6EF',
            Aquamarine    : '#00FFFF',
            Shamrock      : '#28c3a6',
            MintIcepop    : '#3beeb7',
            CaribbeanGreen: '#00C4B1',
            Saltwater     : '#009eb3',
            Ming          : '#1e6b71',
            DeepOcean     : '#004A59',
            Slate         : '#2d3543',
            Tiber         : '#07393c',
            Gunmetal      : '#2C3539'
        },
        
        Blue: {
            PastelBlue   : '#a1c4fd',
            PaleSky      : '#7BDFF2',
            Sky          : '#10d0f9',
            SunnySky     : '#00B2FF',
            NaturalBlue  : '#499DD0',
            River        : '#3498db',
            Azure        : '#0073ff',
            PureBlue     : '#2552FE',
            DarkBlue     : '#004E92',
            VividDarkBlue: '#020887',
            NavyBlue     : '#142954',
            NightSky     : '#001738'
        },
        
        Yellow: {
            MaskingTape: '#FBFAD9',
            Vanilla    : '#fff4ba',
            PostIt     : '#fcfb95',
            VividPostIt: '#fbf963',
            Warmth     : '#FFE36D',
            Honey      : '#FFCC00'
        },
        
        Gold: {
            LightGold   : '#F1E07E',
            Marigold    : '#F7CE3E',
            Gold        : '#d7b45a',
            MetallicGold: '#D4AF37',
            DarkGold    : '#B1892A'
        },
        
        Orange: {
            Papaya      : '#f29e77',
            StrongPapaya: '#f99a4f',
            IndianOrange: '#FF7722',
            Pumpkin     : '#ee7b30',
            VividOrange : '#fd5300',
            Sunset      : '#e6a919'
        },
        
        Brown: {
            RosyBrown   : '#c2948a',
            Leather     : '#AF986E',
            CoffeeLatte : '#d3b284',
            Straw       : '#CEBB7E',
            Wood        : '#D69E63',
            BrownSugar  : '#B57547',
            RustedCopper: '#984B43',
            Coffee      : '#7B5847',
            CoffeeStain : '#8b5227',
            VividBrown  : '#a0430a',
            Chocolate   : '#54210a'
        },
        
        Red: {
            Coral     : '#ff533d',
            SpanishRed: '#E60026',
            Berry     : '#B31942',
            NobleRed  : '#BC2D29',
            Blood     : '#a50104',
            DarkBlood : '#590004'
        },
        
        Pink: {
            IcedPink          : '#FDDAE5',
            CottonCandy       : '#FFD2E7',
            SubtlePink        : '#fad0c4',
            Apricot           : '#ffcab1',
            GrapefruitCocktail: '#f0a390',
            Fluff             : '#F18EAE',
            HubbaBubbba       : '#ff789a',
            VividPink         : '#FD0054',
            Cosmic            : '#7A436A',
            DarkPink          : '#60213E'
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
            Fuchsia     : '#A239CA',
            PurplePowder: '#6B3CAA',
            VividPurple : '#6A0F8E',
            PurpleOrchid: '#541741',
            Grape       : '#3C1642'
        },
        
        Greyscale: {
            SnowWhite     : '#ffffff',
            BrightGrey    : '#EBECF0',
            Titanium      : '#dcdcdc',
            Smoke         : '#c9c9c9',
            CoolGrey      : '#B9BDC1',
            Dust          : '#9c9c9c',
            Asbestos      : '#7f8c8d',
            LightCharcoal : '#646464',
            Charcoal      : '#464646',
            Granite       : '#201F25',
            AlmostMidnight: '#152334',
            Midnight      : '#011627',
            PitchBlack    : '#000000',
            Transparent   : Color.fadeHex( '#ffffff', 0 )
        }
    }
);