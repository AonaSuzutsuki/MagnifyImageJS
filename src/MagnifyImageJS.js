/*@license 
    MagnifyImageJS    Copyright (C) 2020 AonaSuzutsuki.
    v1.0

    MIT License
*/

function MagnifyImageJS(imgId, resultId, hoverId) {
    const _imgId = imgId;
    const _resultId = resultId;
    const _hoverId = hoverId;

    let _wth = 0; // Width to move the hover element relative to the mouse
    let _hth = 0; // Height to move the hover element relative to the mouse
    let _toRatio = { widthRatio: 1, heightRatio: 1 }; // Ratio of Reduced Image to Original Image
    let _fromRatio = { widthRatio: 1, heightRatio: 1 }; // Ratio of original image to reduced image

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

    const refreshPositions = (pos, result, lens) => {
        result.style.backgroundPosition = `top ${-pos.y}px left ${-pos.x}px`;
        lens.style.left = `${pos.lensX}px`;
        lens.style.top = `${pos.lensY}px`;
    }

    const calculatePotisions = (pos, toRatio, fromRatio, result, img) => {
        let calcX = pos.x * toRatio.widthRatio - _wth;
        let calcY = pos.y * toRatio.heightRatio - _hth;

        let lensX = pos.x - (_wth * fromRatio.widthRatio);
        let lensY = pos.y - (_hth * fromRatio.heightRatio);

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
            lensX = img.clientWidth - result.clientWidth * fromRatio.widthRatio;
        }
        if (calcY + result.clientHeight >= _imageHeight) {
            calcY = _imageHeight - result.clientHeight;
            lensY = img.clientHeight - result.clientHeight * fromRatio.heightRatio;
        }

        return { x: calcX, y: calcY, lensX: lensX, lensY: lensY };
    }

    const refreshHoverImage = (event, toRatio, fromRatio) => {
        let img = document.getElementById(_imgId);
        let result = document.getElementById(_resultId);
        let lens = document.getElementById(_hoverId);

        if (!_canZoom)
            return;

        let pos = getCursorPos(event);
        let calcPos = calculatePotisions(pos, toRatio, fromRatio, result, img);
        refreshPositions(calcPos, result, lens);
    }

    const calculateRatios = (newImg, img) => {
        let toRatio = {};
        let fromRatio = {};
        toRatio.widthRatio = newImg.width / img.clientWidth;
        toRatio.heightRatio = newImg.height / img.clientHeight;
        fromRatio.widthRatio = img.clientWidth / newImg.width;
        fromRatio.heightRatio = img.clientHeight / newImg.height;

        return { toRatio: toRatio, fromRatio: fromRatio };
    }

    //
    // Updates the zoomed image according to the mouse coordinates.
    //
    this.refreshHoverImage = (event) => {
        refreshHoverImage(event, _toRatio, _fromRatio);
    }

    //
    // Updates the ratio used in the depiction calculation.
    //
    this.calculateRatios = () => {
        let img = document.getElementById(_imgId);
        let ratios = calculateRatios({ width: _imageWidth, height: _imageHeight }, img);
        _toRatio = ratios.toRatio;
        _fromRatio = ratios.fromRatio;
    }

    //
    // The zoomed image is depicted in the display area and the necessary calculations are performed.
    //
    this.setHoverImage = async () => {
        let img = document.getElementById(_imgId);
        let result = document.getElementById(_resultId);
        let src = img.src;
        if (img.dataset.orig)
            src = img.dataset.orig;

        let newImg = await load(src);
        _imageWidth = newImg.width;
        _imageHeight = newImg.height;
        _canZoom = canZoom(img);
        if (!_canZoom)
            return;

        _wth = result.clientWidth / 2;
        _hth = result.clientHeight / 2;

        let ratios = calculateRatios(newImg, img);
        _toRatio = ratios.toRatio;
        _fromRatio = ratios.fromRatio;

        result.style.backgroundImage = "url('" + src + "')";
        result.style.backgroundSize = `${newImg.width}px ${newImg.height}px`;

        let lens = document.getElementById(_hoverId);
        lens.style.width = `${result.clientWidth * _fromRatio.widthRatio}px`;
        lens.style.height = `${result.clientHeight * _fromRatio.heightRatio}px`;
    }

    //
    // Returns whether you can zoom in or out.
    //
    this.canZoom = () => _canZoom;
}