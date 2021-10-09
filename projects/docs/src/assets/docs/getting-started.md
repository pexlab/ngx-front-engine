# Guide to getting started

#### Installing, customizing and making use of FrontEngine

___

### » Installation

<br>

#### 1. Adding the package

FrontEngine is distributed by the [npm Registry](https://www.npmjs.com/). In order to install the package and
automatically add it to your ```package.json``` run either of the following:

```shell
# if you're using the npm CLI
npm install @pexlab/ngx-front-engine

# if you're using the Yarn CLI
yarn add @pexlab/ngx-front-engine
```

<br>

#### 2. Making the assets available

Go to the root of your project and open the ``angular.json`` file. In there go ahead and find the ``assets`` section and
append the following:

```diff
"assets": [
  "src/favicon.ico",
  "src/assets",
+ {
+   "glob": "**/*",
+   "input": "./node_modules/@pexlab/ngx-front-engine/assets/",
+   "output": "/assets/"
+ }
]
```

<br>

#### 3. Importing the necessary modules

Inside the root module of your project (``app.module.ts``) add the following imports:

```diff
imports: [
    BrowserModule,
+   BrowserAnimationsModule,
+   HttpClientModule,
+   FeModule.forRoot(),
+   FeRootModule
],
```

<br>

#### 4. Placing the root component

In order for the popup feature to work, you'll need to place the root component of FrontEngine in the root of your
template (``app.component.html``) like this:

```html
<fe-root></fe-root>
```

<br>

___

### » Global configuration

The following examples show how to customize the default appearance of the components. Please note that the examples can all be combined with each other and that it is not always necessary to specify all values.

<br>

#### 1. Colors

If you want to change the colors used, you can do that in two ways. The first way is to only change the common theme which every component theme is based on by default. For example if you want to change the accent from the default blue to red for every component at once, you would write the following:

```typescript
constructor( private theme: ThemeService ){
    
    this.theme.applyCommonTheme( {
        palette: {
            accent: {
                primary: FeColorPalette.Red.SpanishRed
            }
        }
    } );
    
    /* Re-apply the component theme because it's based on the common theme */
    this.theme.applyComponentThemes();
}
```

The second way is to change only the appearance of a single component at a time. For this write:

```typescript
constructor( private theme: ThemeService ) {
    
    this.theme.applyComponentThemes( {
         button: {
             background: FeColorPalette.Red.SpanishRed
         }
    } );
}
```

This method will overwrite the common theme with your settings. You can also combine those two methods together. For example if you want to change the accent color for every component but also want to change the button component as a whole.

<br>

#### 2. Typography

The fonts used in the components can be changed in a similar way. For example, the font for the body text can be changed as follows:

```typescript
constructor( private theme: ThemeService ) {
    
    this.theme.applyCommonTheme({
        typography: {
            body: {
                name  : 'Roboto',
                size  : '14px',
                weight: 400
            }
        }
    } )
}
```

<br>

___

### » Fundamentals

When you are ready to incorporate certain components in your app, always keep in mind that each component requires its own module to work. For example, if you want to add a text-field you need to import its module like this:

```diff
imports: [
    CommonModule,
+   FeTextFieldModule
]
```

After this the text-field is made available, and you could use it in your template like this:

```html
<fe-text-field fePlaceholder="Your placeholder">
    <ng-template>
        <span>Your label</span>
    </ng-template>
</fe-text-field>
```

You will probably have noticed that every module, HTML tag and directive has an `fe-` or `Fe` prefix. This is to make it easier to discern things related to FrontEngine. 