// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import React, { Children, useMemo, useState } from 'react';
import { I18nManager, StyleSheet, View } from 'react-native';
import { Defs, LinearGradient, Mask, Path, Rect, Stop, Svg } from 'react-native-svg';
import { colord } from 'colord';
import { additional, cornersArray, divDps, generateGradientIdSuffix, objFromKeys, P, R, radialGradient, rtlAbsoluteFillObject, rtlScaleX, scale, sumDps, } from './utils';
import { opacity } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
/** Package Semver. Used on the [Snack](https://snack.expo.dev/@srbrahma/react-native-shadow-2-sandbox). */
export const version = '7.0.7';
// For better memoization and performance.
const emptyObj = {};
const defaultOffset = [0, 0];
export function Shadow(props) {
    return props.disabled ? <DisabledShadow {...props}/> : <ShadowInner {...props}/>;
}
function ShadowInner(props) {
    var _a, _b, _c, _d, _e;
    /** getConstants().isRTL instead of just isRTL due to Web https://github.com/necolas/react-native-web/issues/2350#issuecomment-1193642853 */
    const isRTL = I18nManager.getConstants().isRTL;
    const [childLayout, setChildLayout] = useState();
    const [idSuffix] = useState(generateGradientIdSuffix);
    const { sides, corners, startColor: startColorProp, endColor: endColorProp, distance: distanceProp, style: styleProp, safeRender, stretch, 
    /** Defaults to true if offset is defined, else defaults to false */
    paintInside = props.offset ? true : false, offset = defaultOffset, children, containerStyle, shadowViewProps, childrenViewProps, containerViewProps, } = props;
    /** `s` is a shortcut for `style` I am using in another lib of mine (react-native-gev). While currently no one uses it besides me,
     * I believe it may come to be a popular pattern eventually :) */
    const childProps = Children.count(children) === 1
        ? (_a = Children.only(children).props) !== null && _a !== void 0 ? _a : emptyObj
        : emptyObj;
    const childStyleStr = useMemo(() => (childProps.style ? JSON.stringify(childProps.style) : null), [childProps.style]);
    const childSStr = useMemo(() => (childProps.s ? JSON.stringify(childProps.s) : null), [childProps.s]);
    /** Child's style. */
    const cStyle = useMemo(() => {
        const cStyle = StyleSheet.flatten([
            childStyleStr && JSON.parse(childStyleStr),
            childSStr && JSON.parse(childSStr),
        ]);
        if (typeof cStyle.width === 'number')
            cStyle.width = R(cStyle.width);
        if (typeof cStyle.height === 'number')
            cStyle.height = R(cStyle.height);
        return cStyle;
    }, [childSStr, childStyleStr]);
    /** Child's Radii. */
    const cRadii = useMemo(() => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return {
            topStart: (_b = (_a = cStyle.borderTopStartRadius) !== null && _a !== void 0 ? _a : cStyle.borderTopLeftRadius) !== null && _b !== void 0 ? _b : cStyle.borderRadius,
            topEnd: (_d = (_c = cStyle.borderTopEndRadius) !== null && _c !== void 0 ? _c : cStyle.borderTopRightRadius) !== null && _d !== void 0 ? _d : cStyle.borderRadius,
            bottomStart: (_f = (_e = cStyle.borderBottomStartRadius) !== null && _e !== void 0 ? _e : cStyle.borderBottomLeftRadius) !== null && _f !== void 0 ? _f : cStyle.borderRadius,
            bottomEnd: (_h = (_g = cStyle.borderBottomEndRadius) !== null && _g !== void 0 ? _g : cStyle.borderBottomRightRadius) !== null && _h !== void 0 ? _h : cStyle.borderRadius,
        };
    }, [cStyle]);
    const styleStr = useMemo(() => (styleProp ? JSON.stringify(styleProp) : null), [styleProp]);
    /** Flattened style. */
    const { style, sRadii } = useMemo(() => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const style = styleStr ? StyleSheet.flatten(JSON.parse(styleStr)) : {};
        if (typeof style.width === 'number')
            style.width = R(style.width);
        if (typeof style.height === 'number')
            style.height = R(style.height);
        return {
            style,
            sRadii: {
                topStart: (_b = (_a = style.borderTopStartRadius) !== null && _a !== void 0 ? _a : style.borderTopLeftRadius) !== null && _b !== void 0 ? _b : style.borderRadius,
                topEnd: (_d = (_c = style.borderTopEndRadius) !== null && _c !== void 0 ? _c : style.borderTopRightRadius) !== null && _d !== void 0 ? _d : style.borderRadius,
                bottomStart: (_f = (_e = style.borderBottomStartRadius) !== null && _e !== void 0 ? _e : style.borderBottomLeftRadius) !== null && _f !== void 0 ? _f : style.borderRadius,
                bottomEnd: (_h = (_g = style.borderBottomEndRadius) !== null && _g !== void 0 ? _g : style.borderBottomRightRadius) !== null && _h !== void 0 ? _h : style.borderRadius,
            },
        };
    }, [styleStr]);
    const styleWidth = (_b = style.width) !== null && _b !== void 0 ? _b : cStyle.width;
    const width = (_c = styleWidth !== null && styleWidth !== void 0 ? styleWidth : childLayout === null || childLayout === void 0 ? void 0 : childLayout.width) !== null && _c !== void 0 ? _c : '100%'; // '100%' sometimes will lead to gaps. Child's size don't lie.
    const styleHeight = (_d = style.height) !== null && _d !== void 0 ? _d : cStyle.height;
    const height = (_e = styleHeight !== null && styleHeight !== void 0 ? styleHeight : childLayout === null || childLayout === void 0 ? void 0 : childLayout.height) !== null && _e !== void 0 ? _e : '100%';
    const radii = useMemo(() => {
        var _a, _b, _c, _d;
        return sanitizeRadii({
            width,
            height,
            radii: {
                topStart: (_a = sRadii.topStart) !== null && _a !== void 0 ? _a : cRadii.topStart,
                topEnd: (_b = sRadii.topEnd) !== null && _b !== void 0 ? _b : cRadii.topEnd,
                bottomStart: (_c = sRadii.bottomStart) !== null && _c !== void 0 ? _c : cRadii.bottomStart,
                bottomEnd: (_d = sRadii.bottomEnd) !== null && _d !== void 0 ? _d : cRadii.bottomEnd,
            },
        });
    }, [
        width,
        height,
        sRadii.topStart,
        sRadii.topEnd,
        sRadii.bottomStart,
        sRadii.bottomEnd,
        cRadii.topStart,
        cRadii.topEnd,
        cRadii.bottomStart,
        cRadii.bottomEnd,
    ]);
    const { topStart, topEnd, bottomStart, bottomEnd } = radii;
    const shadow = useMemo(() => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return getShadow({
            props,
            topStart,
            topEnd,
            bottomStart,
            bottomEnd,
            width,
            height,
            isRTL,
            distanceProp,
            startColorProp,
            endColorProp,
            paintInside,
            safeRender,
            activeSides: {
                bottom: (_a = sides === null || sides === void 0 ? void 0 : sides.bottom) !== null && _a !== void 0 ? _a : true,
                top: (_b = sides === null || sides === void 0 ? void 0 : sides.top) !== null && _b !== void 0 ? _b : true,
                start: (_c = sides === null || sides === void 0 ? void 0 : sides.start) !== null && _c !== void 0 ? _c : true,
                end: (_d = sides === null || sides === void 0 ? void 0 : sides.end) !== null && _d !== void 0 ? _d : true,
            },
            activeCorners: {
                topStart: (_e = corners === null || corners === void 0 ? void 0 : corners.topStart) !== null && _e !== void 0 ? _e : true,
                topEnd: (_f = corners === null || corners === void 0 ? void 0 : corners.topEnd) !== null && _f !== void 0 ? _f : true,
                bottomStart: (_g = corners === null || corners === void 0 ? void 0 : corners.bottomStart) !== null && _g !== void 0 ? _g : true,
                bottomEnd: (_h = corners === null || corners === void 0 ? void 0 : corners.bottomEnd) !== null && _h !== void 0 ? _h : true,
            },
            idSuffix,
        });
    }, [
        width,
        height,
        distanceProp,
        startColorProp,
        endColorProp,
        topStart,
        topEnd,
        bottomStart,
        bottomEnd,
        paintInside,
        sides === null || sides === void 0 ? void 0 : sides.bottom,
        sides === null || sides === void 0 ? void 0 : sides.top,
        sides === null || sides === void 0 ? void 0 : sides.start,
        sides === null || sides === void 0 ? void 0 : sides.end,
        corners === null || corners === void 0 ? void 0 : corners.topStart,
        corners === null || corners === void 0 ? void 0 : corners.topEnd,
        corners === null || corners === void 0 ? void 0 : corners.bottomStart,
        corners === null || corners === void 0 ? void 0 : corners.bottomEnd,
        safeRender,
        isRTL,
        idSuffix,
    ]);
    // Not yet sure if we should memo this.
    return getResult({
        shadow,
        children,
        stretch,
        offset,
        radii,
        containerStyle,
        style,
        shadowViewProps,
        childrenViewProps,
        containerViewProps,
        styleWidth,
        styleHeight,
        childLayout,
        setChildLayout,
    });
}
/** We make some effort for this to be likely memoized */
function sanitizeRadii({ width, height, radii, }) {
    /** Round and zero negative radius values */
    let radiiSanitized = objFromKeys(cornersArray, (k) => { var _a; return R(Math.max((_a = radii[k]) !== null && _a !== void 0 ? _a : 0, 0)); });
    if (typeof width === 'number' && typeof height === 'number') {
        // https://css-tricks.com/what-happens-when-border-radii-overlap/
        // Note that the tutorial above doesn't mention the specification of minRatio < 1 but it's required as said on spec and will malfunction without it.
        const minRatio = Math.min(divDps(width, sumDps(radiiSanitized.topStart, radiiSanitized.topEnd)), divDps(height, sumDps(radiiSanitized.topEnd, radiiSanitized.bottomEnd)), divDps(width, sumDps(radiiSanitized.bottomStart, radiiSanitized.bottomEnd)), divDps(height, sumDps(radiiSanitized.topStart, radiiSanitized.bottomStart)));
        if (minRatio < 1)
            // We ensure to use the .floor instead of the R else we could have the following case:
            // A topStart=3, topEnd=3 and width=5. This would cause a pixel overlap between those 2 corners.
            // The .floor ensures that the radii sum will be below the adjacent border length.
            radiiSanitized = objFromKeys(cornersArray, (k) => Math.floor(P(radiiSanitized[k]) * minRatio) / scale);
    }
    return radiiSanitized;
}
/** The SVG parts. */
// We default the props here for a micro improvement in performance. endColorProp default value was the main reason.
function getShadow({ props, safeRender, width, height, isRTL, distanceProp = 10, startColorProp = '#00000020', endColorProp = colord(startColorProp).alpha(0).toHex(), topStart, topEnd, bottomStart, bottomEnd, activeSides, activeCorners, paintInside, idSuffix, }) {
    // Skip if using safeRender and we still don't have the exact sizes, if we are still on the first render using the relative sizes.
    let opacityVal = props.opacity!=undefined ? props.opacity : 0.5;
    if (safeRender && (typeof width === 'string' || typeof height === 'string'))
        return null;
    const distance = R(Math.max(distanceProp, 0)); // Min val as 0
    // Quick return if not going to show up anything
    if (!distance && !paintInside)
        return null;
    const distanceWithAdditional = distance + additional;
    /** Will (+ additional), only if its value isn't '100%'. [*4] */
    const widthWithAdditional = typeof width === 'string' ? width : width + additional;
    /** Will (+ additional), only if its value isn't '100%'. [*4] */
    const heightWithAdditional = typeof height === 'string' ? height : height + additional;
    const startColord = colord(startColorProp);
    const endColord = colord(endColorProp);
    // [*1]: Seems that SVG in web accepts opacity in hex color, but in mobile gradient doesn't.
    // So we remove the opacity from the color, and only apply the opacity in stopOpacity, so in web
    // it isn't applied twice.
    const startColorWoOpacity = startColord.alpha(1).toHex();
    const endColorWoOpacity = endColord.alpha(1).toHex();
    const startColorOpacity = startColord.alpha();
    const endColorOpacity = endColord.alpha();
    // Fragment wasn't working for some reason, so, using array.
    const linearGradient = [
        // [*1] In mobile, it's required for the alpha to be set in opacity prop to work.
        // In web, smaller offsets needs to come before, so offset={0} definition comes first.
        <Stop  style={{opacity:opacityVal}}  offset={0} stopColor={startColorWoOpacity} stopOpacity={startColorOpacity} key='1'/>,
        <Stop  style={{opacity:opacityVal}}  offset={1} stopColor={endColorWoOpacity} stopOpacity={endColorOpacity} key='2'/>,
    ];
    const radialGradient2 = (p) => radialGradient(Object.assign(Object.assign({}, p), { startColorWoOpacity,
        startColorOpacity,
        endColorWoOpacity,
        endColorOpacity,
        paintInside }));
    const cornerShadowRadius = {
        topStartShadow: sumDps(topStart, distance),
        topEndShadow: sumDps(topEnd, distance),
        bottomStartShadow: sumDps(bottomStart, distance),
        bottomEndShadow: sumDps(bottomEnd, distance),
    };
    const { topStartShadow, topEndShadow, bottomStartShadow, bottomEndShadow } = cornerShadowRadius;
    /* Skip sides if we don't have a distance. */
    const sides = distance > 0 && (<>
      {/* Skip side if adjacents corners use its size already */}
      {activeSides.start &&
            (typeof height === 'number' ? height > topStart + bottomStart : true) && (<Svg width={distanceWithAdditional} height={heightWithAdditional} style={{ position: 'absolute', start: -distance, top: topStart }}>
            <Defs>
              <LinearGradient  style={{opacity: opacityVal}}  id={`start.${idSuffix}`} x1={isRTL ? '0' : '1'} y1='0' x2={isRTL ? '1' : '0'} y2='0'>
                {linearGradient}
              </LinearGradient>
            </Defs>
            {/* I was using a Mask here to remove part of each side (same size as now, sum of related corners), but,
              just moving the rectangle outside its viewbox is already a mask!! -> svg overflow is cutten away. <- */}
            <Rect  style={{opacity:opacityVal}}  width={distance} height={height} fill={`url(#start.${idSuffix})`} y={-sumDps(topStart, bottomStart)}/>
          </Svg>)}
      {activeSides.end && (typeof height === 'number' ? height > topEnd + bottomEnd : true) && (<Svg width={distanceWithAdditional} height={heightWithAdditional} style={{ position: 'absolute', start: width, top: topEnd }}>
          <Defs>
            <LinearGradient style={{opacity:opacityVal}} id={`end.${idSuffix}`} x1={isRTL ? '1' : '0'} y1='0' x2={isRTL ? '0' : '1'} y2='0'>
              {linearGradient}
            </LinearGradient>
          </Defs>
          <Rect style={{opacity:opacityVal}}  width={distance} height={height} fill={`url(#end.${idSuffix})`} y={-sumDps(topEnd, bottomEnd)}/>
        </Svg>)}
      {activeSides.top && (typeof width === 'number' ? width > topStart + topEnd : true) && (<Svg width={widthWithAdditional} height={distanceWithAdditional} style={Object.assign({ position: 'absolute', top: -distance, start: topStart }, (isRTL && rtlScaleX))}>
          <Defs>
            <LinearGradient style={{opacity:opacityVal}}  id={`top.${idSuffix}`} x1='0' y1='1' x2='0' y2='0'>
              {linearGradient}
            </LinearGradient>
          </Defs>
          <Rect style={{opacity:opacityVal}}  width={width} height={distance} fill={`url(#top.${idSuffix})`} x={-sumDps(topStart, topEnd)}/>
        </Svg>)}
      {activeSides.bottom &&
            (typeof width === 'number' ? width > bottomStart + bottomEnd : true) && (<Svg width={widthWithAdditional} height={distanceWithAdditional} style={Object.assign({ position: 'absolute', top: height, start: bottomStart }, (isRTL && rtlScaleX))}>
            <Defs>
              <LinearGradient style={{opacity:opacityVal}}  id={`bottom.${idSuffix}`} x1='0' y1='0' x2='0' y2='1'>
                {linearGradient}
              </LinearGradient>
            </Defs>
            <Rect style={{opacity:opacityVal}}  width={width} height={distance} fill={`url(#bottom.${idSuffix})`} x={-sumDps(bottomStart, bottomEnd)}/>
          </Svg>)}
    </>);
    /* The anchor for the svgs path is the top left point in the corner square.
                The starting point is the clockwise external arc init point. */
    /* Checking topLeftShadowEtc > 0 due to https://github.com/SrBrahma/react-native-shadow-2/issues/47. */
    const corners = (<>
      {activeCorners.topStart && topStartShadow > 0 && (<Svg width={topStartShadow + additional} height={topStartShadow + additional} style={{ position: 'absolute', top: -distance, start: -distance }}>
          <Defs>
            {radialGradient2({
                id: `topStart.${idSuffix}`,
                top: true,
                left: !isRTL,
                radius: topStart,
                shadowRadius: topStartShadow,
            })}
          </Defs>
          <Rect style={{opacity:opacityVal}} fill={`url(#topStart.${idSuffix})`} width={topStartShadow} height={topStartShadow}/>
        </Svg>)}
      {activeCorners.topEnd && topEndShadow > 0 && (<Svg width={topEndShadow + additional} height={topEndShadow + additional} style={{
                position: 'absolute',
                top: -distance,
                start: width,
                transform: [{ translateX: isRTL ? topEnd : -topEnd }],
            }}>
          <Defs>
            {radialGradient2({
                id: `topEnd.${idSuffix}`,
                top: true,
                left: isRTL,
                radius: topEnd,
                shadowRadius: topEndShadow,
            })}
          </Defs>
          <Rect style={{opacity:opacityVal}}  fill={`url(#topEnd.${idSuffix})`} width={topEndShadow} height={topEndShadow}/>
        </Svg>)}
      {activeCorners.bottomStart && bottomStartShadow > 0 && (<Svg width={bottomStartShadow + additional} height={bottomStartShadow + additional} style={{
                position: 'absolute',
                top: height,
                start: -distance,
                transform: [{ translateY: -bottomStart }],
            }}>
          <Defs>
            {radialGradient2({
                id: `bottomStart.${idSuffix}`,
                top: false,
                left: !isRTL,
                radius: bottomStart,
                shadowRadius: bottomStartShadow,
            })}
          </Defs>
          <Rect style={{opacity:opacityVal}}  fill={`url(#bottomStart.${idSuffix})`} width={bottomStartShadow} height={bottomStartShadow}/>
        </Svg>)}
      {activeCorners.bottomEnd && bottomEndShadow > 0 && (<Svg width={bottomEndShadow + additional} height={bottomEndShadow + additional} style={{
                position: 'absolute',
                top: height,
                start: width,
                transform: [{ translateX: isRTL ? bottomEnd : -bottomEnd }, { translateY: -bottomEnd }],
            }}>
          <Defs>
            {radialGradient2({
                id: `bottomEnd.${idSuffix}`,
                top: false,
                left: isRTL,
                radius: bottomEnd,
                shadowRadius: bottomEndShadow,
            })}
          </Defs>
          <Rect style={{opacity:opacityVal}}  fill={`url(#bottomEnd.${idSuffix})`} width={bottomEndShadow} height={bottomEndShadow}/>
        </Svg>)}
    </>);
    /**
     * Paint the inner area, so we can offset it.
     * [*2]: I tried redrawing the inner corner arc, but there would always be a small gap between the external shadows
     * and this internal shadow along the curve. So, instead we dont specify the inner arc on the corners when
     * paintBelow, but just use a square inner corner. And here we will just mask those squares in each corner.
     */
    const inner = paintInside && (<Svg width={widthWithAdditional} height={heightWithAdditional} style={Object.assign({ position: 'absolute' }, (isRTL && rtlScaleX))}>
      {typeof width === 'number' && typeof height === 'number' ? (
        // Maybe due to how react-native-svg handles masks in iOS, the paintInside would have gaps: https://github.com/SrBrahma/react-native-shadow-2/issues/36
        // We use Path as workaround to it.
        <Path fill={startColorWoOpacity} fillOpacity={startColorOpacity} d={`M0,${topStart} v${height - bottomStart - topStart} h${bottomStart} v${bottomStart} h${width - bottomStart - bottomEnd} v${-bottomEnd} h${bottomEnd} v${-height + bottomEnd + topEnd} h${-topEnd} v${-topEnd} h${-width + topStart + topEnd} v${topStart} Z`}/>) : (<>
          <Defs>
            <Mask id={`maskInside.${idSuffix}`}>
              {/* Paint all white, then black on border external areas to erase them */}
              <Rect width={width} height={height} fill='#fff'/>
              {/* Remove the corners */}
              <Rect style={{opacity:opacityVal}}  width={topStart} height={topStart} fill='#000'/>
              <Rect style={{opacity:opacityVal}}  width={topEnd} height={topEnd} x={width} transform={`translate(${-topEnd}, 0)`} fill='#000'/>
              <Rect style={{opacity:opacityVal}}  width={bottomStart} height={bottomStart} y={height} transform={`translate(0, ${-bottomStart})`} fill='#000'/>
              <Rect style={{opacity:opacityVal}}  width={bottomEnd} height={bottomEnd} x={width} y={height} transform={`translate(${-bottomEnd}, ${-bottomEnd})`} fill='#000'/>
            </Mask>
          </Defs>
          <Rect style={{opacity:opacityVal}}  width={width} height={height} mask={`url(#maskInside.${idSuffix})`} fill={startColorWoOpacity} fillOpacity={startColorOpacity}/>
        </>)}
    </Svg>);
    return (<>
      {sides}
      {corners}
      {inner}
    </>);
}
function getResult({ shadow, stretch, containerStyle, children, style, radii, offset, containerViewProps, shadowViewProps, childrenViewProps, styleWidth, styleHeight, childLayout, setChildLayout, }) {
    // const isWidthPrecise = styleWidth;
    return (
    // pointerEvents: https://github.com/SrBrahma/react-native-shadow-2/issues/24
    <View style={containerStyle} pointerEvents='box-none' {...containerViewProps}>
      <View pointerEvents='none' {...shadowViewProps} style={[
            rtlAbsoluteFillObject,
            shadowViewProps === null || shadowViewProps === void 0 ? void 0 : shadowViewProps.style,
            { start: offset[0], top: offset[1] },
        ]}>
        {shadow}
      </View>
      <View pointerEvents='box-none' style={[
            {
                // We are defining here the radii so when using radius props it also affects the backgroundColor and Pressable ripples are properly contained.
                // Note that topStart/etc has priority over topLeft/etc. We use topLeft so the user may overwrite it with topLeft or topStart styles.
                borderTopLeftRadius: radii.topStart,
                borderTopRightRadius: radii.topEnd,
                borderBottomLeftRadius: radii.bottomStart,
                borderBottomRightRadius: radii.bottomEnd,
                alignSelf: 'flex-start', // Default to 'flex-start' instead of 'stretch'.
            },
            style,
            Object.assign({}, (stretch && { alignSelf: 'stretch' })),
        ]} onLayout={(e) => {
            // For some reason, conditionally setting the onLayout wasn't working on condition change.
            // [web] [*3]: the width/height we get here is already rounded by RN, even if the real size according to the browser
            // inspector is decimal. It will round up if (>= .5), else, down.
            const eventLayout = e.nativeEvent.layout;
            // Change layout state if the style width/height is undefined or 'x%', or the sizes in pixels are different.
            if ((typeof styleWidth !== 'number' &&
                ((childLayout === null || childLayout === void 0 ? void 0 : childLayout.width) === undefined ||
                    P(eventLayout.width) !== P(childLayout.width))) ||
                (typeof styleHeight !== 'number' &&
                    ((childLayout === null || childLayout === void 0 ? void 0 : childLayout.height) === undefined ||
                        P(eventLayout.height) !== P(childLayout.height))))
                setChildLayout({ width: eventLayout.width, height: eventLayout.height });
        }} {...childrenViewProps}>
        {children}
      </View>
    </View>);
}
function DisabledShadow({ stretch, containerStyle, children, style, childrenViewProps, containerViewProps, }) {
    return (<View style={containerStyle} pointerEvents='box-none' {...containerViewProps}>
      <View pointerEvents='box-none' {...childrenViewProps} style={[style, Object.assign({}, (stretch && { alignSelf: 'stretch' }))]}>
        {children}
      </View>
    </View>);
}
