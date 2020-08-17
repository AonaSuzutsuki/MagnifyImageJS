/*! 
    MagnifyImageJS    Copyright (C) 2020 AonaSuzutsuki.
    MIT License
*/

function MagnifyImageJS(imgId, resultId, hoverId) {
    const _imgId = imgId;
    const _resultId = resultId;
    const _hoverId = hoverId;

    let _wth = 0; // Width to move the hover element relative to the mouse
    let _hth = 0; // Height to move the hover element relative to the mouse
    let _toWidthRatio = 1; // Width ratio of Reduced Image to Original Image
    let _toHeightRatio = 1; // Height ratio of Reduced Image to Original Image
    let _fromWidthRatio = 1; // Width ratio of original image to reduced image
    let _fromHeightRatio = 1; // Height ratio of original image to reduced image

    let _imageWidth = 0; // Original image width
    let _imageHeight = 0; // Original image height

    let _canZoom = false;

    const load = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = (e) => reject(e);
            img.src = src;
        })
    }

    const canZoom = (img) => _imageWidth > img.width && _imageHeight > img.height;

    const getCursorPos = (e) => {
        let img = document.getElementById(_imgId);
        e = e || window.event;
        /* Get the x and y positions of the image: */
        let a = img.getBoundingClientRect();
        /* Calculate the cursor's x and y coordinates, relative to the image: */
        let x = e.pageX - a.left;
        let y = e.pageY - a.top;
        /* Consider any page scrolling: */
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        return { x: x, y: y };
    }

    //
    // The zoomed image is depicted in the display area and the necessary calculations are performed.
    //
    this.setHoverImage = async () => {
        let img = document.getElementById(_imgId);
        let result = document.getElementById(_resultId);
        let src = img.src;

        let newImg = await load(img.src);
        _imageWidth = newImg.width;
        _imageHeight = newImg.height;
        _canZoom = canZoom(img);
        if (!_canZoom)
            return;

        _wth = result.clientWidth / 2;
        _hth = result.clientHeight / 2;
        _toWidthRatio = newImg.width / img.clientWidth;
        _toHeightRatio = newImg.height / img.clientHeight;
        _fromWidthRatio = img.clientWidth / newImg.width;
        _fromHeightRatio = img.clientHeight / newImg.height;

        result.style.backgroundImage = "url('" + src + "')";
        result.style.backgroundSize = `${newImg.width}px ${newImg.height}px`;

        let lens = document.getElementById(hoverId);
        lens.style.width = `${result.clientWidth * _fromWidthRatio}px`;
        lens.style.height = `${result.clientHeight * _fromHeightRatio}px`;
    }

    //
    // Updates the zoomed image according to the mouse coordinates.
    //
    this.refreshHoverImage = (event) => {
        let img = document.getElementById(_imgId);
        let result = document.getElementById(_resultId);
        let lens = document.getElementById(_hoverId);

        if (!_canZoom)
            return;

        let pos = getCursorPos(event);

        let calcX = pos.x * _toWidthRatio - _wth;
        let calcY = pos.y * _toHeightRatio - _hth;

        let lensX = pos.x - (_wth * _fromWidthRatio);
        let lensY = pos.y - (_hth * _fromHeightRatio);

        if (calcX < 0) {
            calcX = 0;
            lensX = 0;
        }
        if (calcY < 0) {
            calcY = 0;
            lensY = 0;
        }
        if (calcX + result.clientWidth >= _imageWidth) {
            calcX = _imageWidth - result.clientWidth;
            lensX = img.clientWidth - result.clientWidth * _fromWidthRatio;
        }
        if (calcY + result.clientHeight >= _imageHeight) {
            calcY = _imageHeight - result.clientHeight;
            lensY = img.clientHeight - result.clientHeight * _fromHeightRatio;
        }

        result.style.backgroundPosition = `top ${-calcY}px left ${-calcX}px`;
        lens.style.left = `${lensX}px`;
        lens.style.top = `${lensY}px`;
    }

    //
    // Returns whether you can zoom in or out.
    //
    this.canZoom = () => _canZoom;
}