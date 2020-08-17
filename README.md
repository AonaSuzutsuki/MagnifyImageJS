# MagnifyImageZoom
When an image with a large resolution is reduced to fit the screen size using CSS, the pixels may be collapsed and not visible.  
This library displays the original image in a separate display area without scaling, and changes the display area according to the location of the mouse.  
If the image is not scaled, the expansion process is skipped.  

\* Except for the sample, there are no dependent libraries.

# How to use (used Vue.js)
1. Define the HTML.
```html
<div id="container">
    <div id="display-image-container">
        <div id="img-zoom-lens" v-bind:class="{
            visible: visibility }"></div>
        <img id="current-src" :src="displaySrc" v-on:mouseover="currentImageMouseOver"
            v-on:mouseleave="currentImageMouseLeave" v-on:mousemove="currentImageMouseMove" />
    </div>

    <div id="current-src-hover" v-bind:class="{
        visible: visibility }">
    </div>
</div>
```

2. Define the CSS.
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

3. Create MagnifyImageZoom instance and init.  
1st arg: ID of the thumbnail image (need the original source in img.src.).  
2nd arg: ID of the area that displays the original image.  
3rd arg: ID of the element that displays the area on mouseover.  
```javascript
let imageZoom = new MagnifyImageZoom("current-src", "current-src-hover", "img-zoom-lens");
```

4. Create Vue instance and define methods, data.
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
        displaySrc: "1.png"
    }
});
```

# Dependency library
Vue.js: Copyright (c) 2013-present, Yuxi (Evan) You  
\* used sample.
