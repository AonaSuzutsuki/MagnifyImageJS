# MagnifyImageJS
When an image with a large resolution is reduced to fit the screen size using CSS, the pixels may be collapsed and not visible.  
This library displays the original image in a separate display area without scaling, and changes the display area according to the location of the mouse.  
If the image is not scaled, the expansion process is skipped.  

\* Except for the sample, there are no dependent libraries.

# Sample
[Multiple Images](https://aonsztk.xyz/sample/MagnifyImageJS/)  
[Single Image](https://aonsztk.xyz/sample/MagnifyImageJS/simple.html)  

# How to use (used Vue.js)
1. Define the HTML.  
Specify a thumbnail image in "img.src" and the original image for "img.data-orig".  
Don't have to add the "img.data-orig" option. If you do not specify it, "img.src" is used to zoom in.  

```html
<div id="container">
    <div id="display-image-container">
        <div id="img-zoom-lens" v-bind:class="{
            visible: visibility }"></div>
        <img id="current-src" :src="displaySrc" :data-orig="originalSrc" v-on:mouseover="currentImageMouseOver"
            v-on:mouseleave="currentImageMouseLeave" v-on:mousemove="currentImageMouseMove" />
    </div>

    <div id="current-src-hover" v-bind:class="{
        visible: visibility }">
    </div>
</div>
```

2. Define the CSS.  
Can't use "display: none". Use "visibility: hidden".
```css
.visible {
    visibility: visible !important;
}

#container {
    display: flex;
}

#current-src {
    width: 400px;
}

#display-image-container {
    position: relative;
}

#img-zoom-lens {
    visibility: hidden;
    pointer-events: none;
    position: absolute;
    border: 2px solid #e45b9f;
    box-sizing: border-box;
}

#current-src-hover {
    visibility: hidden;
    width: 400px;
    height: 400px;
    border: 1px solid;
}
```

3. Create MagnifyImageJS instance and init.  
1st arg: ID of the img element.  
2nd arg: ID of the area that displays the original image.  
3rd arg: ID of the element that displays the area on mouseover.  
```javascript
let imageZoom = new MagnifyImageJS("current-src", "current-src-hover", "img-zoom-lens");
```

4. Create Vue instance and define methods, data.  
Call the "MagnifyImageJS#calculateRatios" method If the image size changes during mouseover.
```javascript
new Vue({
    el: "#container",
    methods: {
        currentImageMouseOver: async function () {
            await imageZoom.setHoverImage();
            this.visibility = imageZoom.canZoom();
        },
        currentImageMouseLeave: function () {
            this.visibility = false;
        },
        currentImageMouseMove: function (e) {
            imageZoom.refreshHoverImage(e);
        }
    },
    data: {
        visibility: false,
        displaySrc: "thumbnails/1.jpg",
        originalSrc: "images/1.png"
    }
});
```

# How to Build
## Requirements
Node Package Manager (6.14.8 when it was developed.)

## Build
### Install packages
```bash
$ npm install
```

### Build JavaScript codes and samples
The result is output to "dist" and "min" in repository directory.
```bash
$ npm run build
# or grunt build
```

# Dependency library
Vue.js: Copyright (c) 2013-present, Yuxi (Evan) You  
\* used in samples.

# Special Thanks
[How To Create an Image Zoom w3schools](https://www.w3schools.com/howto/howto_js_image_zoom.asp)  