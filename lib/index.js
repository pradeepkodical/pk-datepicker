'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var dateFns = require('date-fns');

class DrawItem {
    constructor() {
        this.top = 0;
        this.left = 0;
        this.width = 0;
        this.height = 0;
        this.minHeight = 0;
        this.data = null;
        this.hovering = false;
        this.selected = false;
    }
    getWidth() {
        return this.width;
    }
    getHeight() {
        return Math.max(this.height, this.minHeight);
    }
    getHit(x, y) {
        return (this.left <= x && this.left + this.getWidth() >= x && this.top <= y && this.top + this.getHeight() >= y) ? this : null;
    }
    moveBy(x, y) {
        this.left += x;
        this.top += y;
        return this;
    }
    setHeight(h) {
        this.height = h;
        return this;
    }
    getSelectedBg(ctx, defaultColor, selColor) {
        return this.selected || this.hovering ? this.getColor(ctx, selColor) : this.getColor(ctx, defaultColor);
    }
    getColor(ctx, color) {
        if (typeof color === "function") {
            const colors = color();
            const grd = ctx.createLinearGradient(this.left, this.top, this.left + this.getWidth(), this.top + this.getHeight());
            colors.forEach((c, i) => {
                grd.addColorStop(i / (colors.length - 1), c);
            });
            return grd;
        }
        return color;
    }
}

class TextDrawItem extends DrawItem {
    constructor() {
        super(...arguments);
        this.text = '';
        this.color = '#111';
        this.bgColor = '#fff';
    }
    draw(ctx) {
        ctx.font = '12px Verdana';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const size = ctx.measureText(this.text);
        ctx.fillStyle = this.getColor(ctx, this.bgColor);
        ctx.fillRect(this.left, this.top, size.width, this.height);
        ctx.fillStyle = this.getColor(ctx, this.color);
        //ctx.strokeStyle = this.color;
        //ctx.strokeRect(this.left, this.top, size.width, this.height);
        ctx.fillText(this.text, this.left, this.top + this.height / 2);
    }
    static create(left, top, height, color, bgColor, text, data) {
        const item = new TextDrawItem();
        item.left = left;
        item.top = top;
        item.width = 0;
        item.height = height;
        item.color = color;
        item.bgColor = bgColor;
        item.text = text;
        item.data = data;
        return item;
    }
}

function groupBy(list, getKey) {
    return list.reduce((previous, currentItem) => {
        const group = getKey(currentItem);
        if (!previous[group])
            previous[group] = [];
        previous[group].push(currentItem);
        return previous;
    }, {});
}

function getMousePos(ctx, evt) {
    var rect = ctx.canvas.getBoundingClientRect();
    return {
        x: ((evt.clientX - rect.left) / (rect.right - rect.left)) * ctx.canvas.width,
        y: ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * ctx.canvas.height,
    };
}
function useCanvas(draw, click, hover) {
    const canvasRef = react.useRef(null);
    react.useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        draw(context);
    }, [draw]);
    react.useEffect(() => {
        if (click) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            const func = (evt) => {
                click(getMousePos(context, evt), context);
            };
            canvas.addEventListener('click', func);
            return () => {
                canvas.removeEventListener('click', func);
            };
        }
    }, [click]);
    react.useEffect(() => {
        if (hover) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            const func = (evt) => {
                hover(getMousePos(context, evt), context);
            };
            canvas.addEventListener('mousemove', func);
            return () => {
                canvas.removeEventListener('mousemove', func);
            };
        }
    }, [hover]);
    return canvasRef;
}

class BoxDrawItem extends DrawItem {
    constructor() {
        super(...arguments);
        this.bgColor = '#fff';
        this.color = '#111';
        this.borderColor = '#fff';
        this.selBgColor = '#dcf5ff';
        this.textAlign = 'center';
        this.font = '9px Verdana';
    }
    draw(ctx) {
        ctx.fillStyle = this.getSelectedBg(ctx, this.bgColor, this.selBgColor);
        ctx.fillRect(this.left, this.top, this.getWidth(), this.getHeight());
        //console.log(`box ${this.text} ${this.hovering} ${ctx.fillStyle} ${this.left} ${this.top} ${this.getWidth()} ${this.getHeight()}`);
        if (this.borderColor !== this.bgColor) {
            ctx.strokeWidth = 0.5;
            ctx.strokeStyle = this.getColor(ctx, this.borderColor);
            ctx.strokeRect(this.left, this.top, this.getWidth(), this.getHeight());
        }
        if (this.text) {
            ctx.font = this.font;
            ctx.textBaseline = 'middle';
            let x = this.left + 5;
            let y = this.top + this.getHeight() / 2;
            if (this.textAlign === 'center') {
                x = this.left + this.getWidth() / 2;
            }
            else if (this.textAlign === 'right') {
                x = this.left + this.getWidth() - 5;
            }
            ctx.textAlign = this.textAlign;
            ctx.fillStyle = this.getColor(ctx, this.color);
            ctx.fillText(this.text, x, y, this.getWidth());
        }
        if (this.sideKick)
            this.sideKick.draw(ctx);
    }
    setTextAlign(textAlign) {
        this.textAlign = textAlign;
        return this;
    }
    setFont(font) {
        this.font = font;
        return this;
    }
    static create(left, top, size, color, bgColor, selBgColor, borderColor, data, text) {
        const item = new BoxDrawItem();
        item.left = left;
        item.top = top;
        item.width = size;
        item.height = size;
        item.color = color;
        item.bgColor = bgColor;
        item.selBgColor = selBgColor;
        item.borderColor = borderColor;
        item.data = data;
        item.text = text;
        return item;
    }
}

class ContainerDrawItem extends BoxDrawItem {
    constructor() {
        super(...arguments);
        this.items = [];
        this.lines = [];
    }
    draw(ctx) {
        ctx.fillStyle = this.getColor(ctx, this.bgColor);
        ctx.fillRect(this.left, this.top, this.getWidth(), this.getHeight());
        this.lines.forEach((x) => x.draw(ctx));
        this.items.forEach((x) => x.draw(ctx));
    }
    getWidth() {
        return this.width !== 0 ? this.width : this.items.reduce((p, c) => Math.max(p, c.left + c.getWidth()), 0) - this.left;
    }
    getHeight() {
        let h = this.height;
        h = h !== 0 ? h : this.items.reduce((p, c) => Math.max(p, c.top + c.getHeight()), 0) - this.top;
        return Math.max(h, this.minHeight);
    }
    getHit(x, y) {
        const hit = super.getHit(x, y);
        if (hit) {
            for (let i = 0; i < this.items.length; i++) {
                const item = this.items[i].getHit(x, y);
                if (item) {
                    return item;
                }
            }
        }
        return hit;
    }
}

function CanvasContainer(props) {
    const { drawItems, onClick, onHover, minHeight } = props;
    const height = react.useMemo(() => Math.min(20000, drawItems.reduce((p, c) => p + c.getHeight(), 0)), [drawItems]);
    const width = react.useMemo(() => {
        return Math.min(20000, drawItems.reduce((p, c) => Math.max(p, c.getWidth()), 0));
    }, [drawItems]);
    const draw = react.useCallback((ctx) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        drawItems === null || drawItems === void 0 ? void 0 : drawItems.forEach((di) => {
            di.draw(ctx);
        });
    }, [drawItems]);
    const click = react.useCallback(({ x, y }, ctx) => {
        const hitItem = drawItems.reduce((p, c) => (!p ? c.getHit(x, y) : p), null);
        if (hitItem && onClick && hitItem.data) {
            onClick(hitItem.data);
        }
    }, [drawItems, onClick]);
    const lastHit = react.useRef(null);
    const hover = react.useCallback(({ x, y }, ctx) => {
        var _a;
        const hitItem = drawItems.reduce((p, c) => (!p ? c.getHit(x, y) : p), null);
        const resetLastItem = () => {
            var _a;
            if (lastHit.current) {
                const di = lastHit.current;
                if (di) {
                    di.hovering = false;
                    (_a = di.parent) === null || _a === void 0 ? void 0 : _a.draw(ctx);
                    di.draw(ctx);
                }
                lastHit.current = null;
            }
        };
        if (hitItem instanceof TextDrawItem ||
            hitItem instanceof ContainerDrawItem) {
            if (lastHit.current) {
                resetLastItem();
                if (onHover)
                    onHover(null);
            }
            return;
        }
        if (lastHit.current !== hitItem) {
            resetLastItem();
            if (hitItem) {
                if (onHover)
                    onHover(hitItem.data);
            }
        }
        if (hitItem) {
            hitItem.hovering = true;
            (_a = hitItem.parent) === null || _a === void 0 ? void 0 : _a.draw(ctx);
            hitItem.draw(ctx);
        }
        lastHit.current = hitItem;
    }, [drawItems, lastHit, onHover]);
    const canvasRef = useCanvas(draw, click, hover);
    return (jsxRuntime.jsx("div", Object.assign({ style: {
            padding: '8px',
            position: 'relative',
            overflow: 'auto',
            width: '100%',
            minHeight,
        } }, { children: jsxRuntime.jsx("canvas", { width: width, height: height, ref: canvasRef }, void 0) }), void 0));
}

class GridDrawItem extends ContainerDrawItem {
    constructor() {
        super(...arguments);
        this.bgColor = '#fff';
        this.color = '#111';
        this.borderColor = '#fff';
        this.selBgColor = '#dcf5ff';
    }
    draw(ctx) {
        ctx.fillStyle = this.selected || this.hovering ? this.selBgColor : this.bgColor;
        ctx.fillRect(this.left, this.top, this.getWidth(), this.getHeight());
        if (this.borderColor !== this.bgColor) {
            ctx.strokeWidth = 0.5;
            ctx.strokeStyle = this.borderColor;
            ctx.strokeRect(this.left, this.top, this.getWidth(), this.getHeight());
        }
        super.draw(ctx);
        if (this.text) {
            ctx.font = "9px Verdana";
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.fillStyle = this.color;
            ctx.fillText(this.text, this.left + this.getWidth() / 2, this.top + this.getHeight() / 2, this.getWidth());
        }
    }
    static create(top, left, size, color, bgColor, selBgColor, borderColor, data, text) {
        const item = new GridDrawItem();
        item.left = left;
        item.top = top;
        item.width = size;
        item.height = size;
        item.bgColor = bgColor;
        item.selBgColor = selBgColor;
        item.data = data;
        item.text = text;
        item.color = color;
        item.borderColor = borderColor;
        const arr1 = data;
        const c = Math.min(arr1.length, 2);
        const size1 = size / c - 1;
        arr1.forEach((a, idx) => {
            const item1 = BoxDrawItem.create(left + (idx % c) * size1, top + Math.floor(idx / c) * size1, size1, color, a.bgColor, selBgColor, borderColor, a, ``);
            item1.parent = item;
            item.items.push(item1);
        });
        return item;
    }
}

function useDelayResetState(theValue, delay) {
    const [value, setValue] = react.useState(null);
    react.useEffect(() => {
        setValue(theValue);
        const handler = setTimeout(() => {
            setValue(null);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [setValue, theValue, delay]);
    return value;
}

function useFollowMouse() {
    const ref = react.useRef();
    react.useEffect(() => {
        const setFromEvent = (e) => {
            const elm = ref.current;
            if (elm && elm.style) {
                let left = e.clientX + 5;
                let top = e.clientY + 5;
                if (e.clientX + elm.offsetWidth > window.innerWidth) {
                    left = window.innerWidth - elm.offsetWidth - 10;
                }
                if (e.clientY + elm.offsetHeight > window.innerWidth) {
                    top = window.innerHeight - elm.offsetHeight - 10;
                }
                elm.style.left = `${left}px`;
                elm.style.top = `${top}px`;
            }
        };
        window.addEventListener('mousemove', setFromEvent);
        return () => {
            window.removeEventListener('mousemove', setFromEvent);
        };
    }, [ref]);
    return ref;
}

function ChartTooltip(props) {
    const { selected, tooltip } = props;
    const ref = useFollowMouse();
    const value = useDelayResetState(selected, 3000);
    return tooltip && value ? (jsxRuntime.jsx("div", Object.assign({ ref: ref, style: {
            padding: '10px',
            position: 'fixed',
            zIndex: 10000,
        } }, { children: react.createElement(tooltip, { item: value }) }), void 0)) : (jsxRuntime.jsx(jsxRuntime.Fragment, {}, void 0));
}

const DEFAULT_COLORS = {
    selBgColor: '#dcf5ff',
    defaultBgColor: '#fff',
    alternateBgColor: '#fefefe',
    textColor: '#000',
    selTextColor: '#111',
    borderColor: '#efefef',
    background: '#fff',
    color: '#000'
};
function getConfig(config) {
    return Object.assign(Object.assign({}, DEFAULT_COLORS), config);
}

const defaultConfig$4 = {
    cellSize: 25,
};
function getLocation(date, config) {
    const top = date.getDay() * config.cellSize;
    let w = dateFns.getWeek(date);
    if (date.getMonth() > 10 && w < 45)
        w = 53;
    const left = w * config.cellSize;
    return { top, left };
}
function getWeekDayHeader(config) {
    const arr = [];
    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach((x, idx) => {
        arr.push(TextDrawItem.create(config.cellSize, (idx + 1) * config.cellSize, config.cellSize, config.textColor, config.defaultBgColor, x, {}));
    });
    return arr;
}
function getMonthsHeader(year, config) {
    const startDate = new Date(year, 0, 15);
    const arr = [];
    for (var i = 0; i < 12; i++) {
        startDate.setMonth(i);
        let w = dateFns.getWeek(startDate);
        if (i > 10 && w < 45)
            w = 53;
        arr.push(TextDrawItem.create((1 + w) * config.cellSize, 0, config.cellSize, config.textColor || '#111', config.defaultBgColor || '#fff', dateFns.format(startDate, 'MMM'), {}));
    }
    return arr;
}
function YearBox(props) {
    const { year, items, onClick, onHover, config } = props;
    const drawItems = react.useMemo(() => {
        let startDate = new Date(year, 0, 15);
        const arr = [
            ...getWeekDayHeader(config),
            ...getMonthsHeader(year, config),
        ];
        startDate = new Date(year, 0, 1);
        const maxDays = dateFns.getDaysInYear(startDate);
        const allData = {};
        items.forEach((a) => {
            const index = a.date.toDateString();
            if (!allData[index])
                allData[index] = [];
            allData[index].push(a);
        });
        for (let i = 0; i < maxDays; i++) {
            const loc = getLocation(startDate, config);
            let bgColor = startDate.getMonth() % 2 === 0
                ? config.defaultBgColor
                : config.alternateBgColor;
            const index = startDate.toDateString();
            if (allData[index]) {
                const item = GridDrawItem.create(loc.top + config.cellSize, loc.left + config.cellSize, config.cellSize - 2, config.selTextColor, bgColor, config.selBgColor, config.borderColor, allData[index], `${startDate.getDate()}`);
                arr.push(item);
            }
            else {
                const item = BoxDrawItem.create(loc.left + config.cellSize, loc.top + config.cellSize, config.cellSize - 2, config.textColor, bgColor, config.selBgColor, config.borderColor, '', `${startDate.getDate()}`);
                arr.push(item);
            }
            startDate = dateFns.addDays(startDate, 1);
        }
        const c = new ContainerDrawItem();
        c.items = arr;
        c.bgColor = config.defaultBgColor;
        c.color = config.textColor;
        return [c];
    }, [year, items, config]);
    return (jsxRuntime.jsxs("div", Object.assign({ style: {
            display: 'flex',
            padding: '10px',
            justifyContent: 'center',
            backgroundColor: config.background,
            color: config.color,
        } }, { children: [jsxRuntime.jsx("div", { children: jsxRuntime.jsx("div", Object.assign({ style: {
                        fontWeight: 'bold',
                        fontSize: 'x-large',
                        transform: `translateY(${config.cellSize * 4}px) rotate(-90deg)`,
                    } }, { children: year }), void 0) }, void 0), jsxRuntime.jsx(CanvasContainer, { drawItems: drawItems, onClick: onClick, onHover: onHover }, void 0)] }), void 0));
}
function YearsCalendar(props) {
    const { items, config, onClick, onHover, tooltip } = props;
    const [selected, setSelected] = react.useState(null);
    const groupedItems = react.useMemo(() => groupBy(items, (item) => item.date.getFullYear()), [items]);
    const theConfig = react.useMemo(() => (Object.assign(Object.assign({}, defaultConfig$4), getConfig(config))), [config]);
    const handleHover = react.useCallback((item) => {
        setSelected(item);
        if (onHover)
            onHover(item);
    }, [setSelected, onHover]);
    return (jsxRuntime.jsxs("div", Object.assign({ style: {
            padding: '10px',
            backgroundColor: theConfig.background,
            color: theConfig.color,
        } }, { children: [Object.keys(groupedItems).map((key, i) => (jsxRuntime.jsx("div", { children: jsxRuntime.jsx(YearBox, { year: key, items: groupedItems[key], config: theConfig, onClick: onClick, onHover: handleHover }, void 0) }, i))), jsxRuntime.jsx(ChartTooltip, { tooltip: tooltip, selected: selected }, void 0)] }), void 0));
}

function CanvasChart(props) {
    const { drawItems, theConfig, tooltip, onClick } = props;
    const [selected, setSelected] = react.useState();
    const handleOnHover = react.useCallback((item) => {
        setSelected(item);
    }, [setSelected]);
    return (jsxRuntime.jsxs("div", Object.assign({ style: {
            display: 'flex',
            padding: '10px',
            justifyContent: 'stretch',
            backgroundColor: theConfig.background,
            color: theConfig.color,
        } }, { children: [jsxRuntime.jsx(CanvasContainer, { drawItems: drawItems, onClick: onClick, onHover: handleOnHover }, void 0), jsxRuntime.jsx(ChartTooltip, { tooltip: tooltip, selected: selected }, void 0)] }), void 0));
}

const defaultConfig$3 = {
    barSize: 18,
    gutterSize: 5,
    height: 200,
};
function StackedBarChart(props) {
    const { items, config, tooltip, onClick } = props;
    const theConfig = react.useMemo(() => (Object.assign(Object.assign({}, defaultConfig$3), getConfig(config))), [config]);
    const drawItems = react.useMemo(() => {
        const dItems = [];
        const COL_SIZE = theConfig.barSize + theConfig.gutterSize;
        const CELL_HEIGHT = theConfig.barSize;
        let HEIGHT_SCALE = 1.0;
        const maxHeight = CELL_HEIGHT *
            items.reduce((p, c) => Math.max(p, c.items.reduce((p1, c1) => p1 + c1.value, 0), 0), 0);
        if (theConfig.height !== 'auto') {
            HEIGHT_SCALE = theConfig.height / maxHeight;
        }
        items.forEach((item, i) => {
            let top = HEIGHT_SCALE *
                (maxHeight -
                    CELL_HEIGHT *
                        item.items.reduce((p, c) => p + c.value, 0));
            let h = 0;
            item.items.forEach((sItem, j) => {
                const ditem = BoxDrawItem.create(i * COL_SIZE, top, theConfig.barSize, theConfig.textColor, sItem.bgColor, theConfig.selBgColor, theConfig.borderColor, sItem, '');
                h = HEIGHT_SCALE * sItem.value * CELL_HEIGHT;
                ditem.height = h;
                top += h;
                dItems.push(ditem);
            });
        });
        const c = new ContainerDrawItem();
        c.items = dItems;
        c.bgColor = theConfig.defaultBgColor;
        c.color = theConfig.textColor;
        return [c];
    }, [items, theConfig]);
    return (jsxRuntime.jsx(CanvasChart, { drawItems: drawItems, onClick: onClick, theConfig: theConfig, tooltip: tooltip }, void 0));
}

const defaultConfig$2 = {
    rowSize: 25,
    boxSize: 18,
};
function createLineItem(item, top, theConfig, bgColor) {
    var _a, _b;
    const c = new ContainerDrawItem();
    c.items = [];
    c.bgColor = bgColor;
    c.top = top;
    c.left = 0;
    c.data = { item };
    const ROW_HEIGHT = theConfig.rowSize;
    const BOX_SIZE = theConfig.boxSize;
    (_a = item.badges) === null || _a === void 0 ? void 0 : _a.forEach((b, j) => {
        const bd = BoxDrawItem.create(j * BOX_SIZE, top + (ROW_HEIGHT - BOX_SIZE) / 2, BOX_SIZE, theConfig.textColor, b.bgColor, theConfig.selBgColor, theConfig.borderColor, { item, badge: b }, '');
        c.items.push(bd);
    });
    //Create Name
    c.items.push(TextDrawItem.create(5 * BOX_SIZE, top, ROW_HEIGHT, theConfig.textColor, bgColor, item.name, { item }));
    //Create Timelines
    (_b = item.timeline) === null || _b === void 0 ? void 0 : _b.forEach((b, j) => {
        const bd = BoxDrawItem.create(200 + j * BOX_SIZE, top + (ROW_HEIGHT - BOX_SIZE) / 2, BOX_SIZE, theConfig.textColor, b.bgColor, theConfig.selBgColor, theConfig.borderColor, { item, badge: b }, '');
        c.items.push(bd);
        if (b.badgeCount && b.badgeCount > 0) {
            const bg1 = BoxDrawItem.create(200 + j * BOX_SIZE + (BOX_SIZE - 5) / 2, top + (ROW_HEIGHT - BOX_SIZE) / 2 - 5 / 2, 5, theConfig.textColor, 'green', theConfig.selBgColor, theConfig.borderColor, { item, badge: b }, '');
            bd.sideKick = bg1;
            c.items.push(bg1);
        }
    });
    return c;
}
function createDrawItems$2(items, theConfig) {
    const dItems = [];
    const width = items.reduce((p1, c) => Math.max(p1, c.badges.length + c.timeline.length * (theConfig.boxSize || 20) + 200), 0);
    items.forEach((item, index) => {
        const c1 = createLineItem(item, index * (theConfig.rowSize || 25), theConfig, index % 2 === 0 ? theConfig.defaultBgColor : theConfig.alternateBgColor);
        c1.width = width;
        dItems.push(c1);
    });
    return dItems;
}
function AchievementsChart(props) {
    const { items, config, tooltip, onClick } = props;
    const theConfig = react.useMemo(() => (Object.assign(Object.assign({}, defaultConfig$2), getConfig(config))), [config]);
    const drawItems = react.useMemo(() => createDrawItems$2(items, theConfig), [
        items,
        theConfig,
    ]);
    return (jsxRuntime.jsx(CanvasChart, { drawItems: drawItems, onClick: onClick, theConfig: theConfig, tooltip: tooltip }, void 0));
}

class LineDrawItem {
    constructor() {
        this.color = '#fff';
        this.x1 = 0;
        this.y1 = 0;
        this.x2 = 0;
        this.y2 = 0;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }
    moveBy(x, y) {
        this.x1 += x;
        this.y1 += y;
        this.x2 += x;
        this.y2 += y;
        return this;
    }
    static create(x1, y1, x2, y2, color, data) {
        const item = new LineDrawItem();
        item.x1 = x1;
        item.y1 = y1;
        item.x2 = x2;
        item.y2 = y2;
        item.color = color;
        item.data = data;
        return item;
    }
}

class CircleDrawItem extends BoxDrawItem {
    draw(ctx) {
        ctx.fillStyle = this.getSelectedBg(ctx, this.bgColor, this.selBgColor);
        ctx.strokeStyle = this.getColor(ctx, this.borderColor);
        ctx.beginPath();
        ctx.arc(this.left + this.getWidth() / 2, this.top + this.getWidth() / 2, this.getWidth() / 2, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        if (this.text) {
            ctx.font = '9px Verdana';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#000';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.text, this.left + this.getWidth() / 2, this.top + this.getHeight() / 2, this.getWidth());
        }
    }
    static create(left, top, size, bgColor, data, text) {
        const item = new CircleDrawItem();
        item.left = left;
        item.top = top;
        item.width = size;
        item.height = size;
        item.bgColor = bgColor;
        item.data = data;
        item.text = text;
        return item;
    }
}

const defaultConfig$1 = {
    purchaseColor: 'green',
    eventColor: 'blue',
    lineColor: 'pink',
    rowSize: 30,
    colSize: 150,
    circleSize: 25,
};
function getEventPos(eventId, events, theConfig) {
    const i = events.findIndex((x) => x.id === eventId);
    return { top: 0, left: (i + 1) * theConfig.colSize };
}
function getHeat(delta) {
    return `rgb(255, ${(1 - delta) * 255} ,0)`;
}
function createEvents(events, attendees, theConfig) {
    const arr = [];
    const lines = [];
    const c = new ContainerDrawItem();
    c.items = arr;
    c.lines = lines;
    c.top = theConfig.rowSize;
    c.width = theConfig.colSize * (events.length + 1);
    events.forEach((evt, i) => {
        const occurance = attendees.reduce((p, c) => p + (c.events.indexOf(evt.id) >= 0 ? 1 : 0), 0);
        const color = getHeat(occurance / attendees.length);
        const left = (i + 1) * theConfig.colSize;
        const e1 = BoxDrawItem.create(left, theConfig.rowSize, theConfig.colSize, theConfig.textColor, color, theConfig.selBgColor, theConfig.borderColor, evt, evt.name);
        e1.height = theConfig.rowSize;
        arr.push(e1);
    });
    return c;
}
function createAttendeeName(item, top, bgColor, theConfig) {
    var _a;
    const c = new ContainerDrawItem();
    c.items = [];
    c.top = top;
    c.width = theConfig.colSize;
    c.bgColor = bgColor;
    const size = theConfig.circleSize * 2;
    const left = size * 4;
    (_a = item.badges) === null || _a === void 0 ? void 0 : _a.forEach((b, j) => {
        const bd = BoxDrawItem.create(j * size, top, size, theConfig.textColor, b.bgColor, theConfig.selBgColor, theConfig.borderColor, { item, badge: b }, '').moveBy(0, (theConfig.rowSize - size) / 2);
        c.items.push(bd);
    });
    c.items.push(TextDrawItem.create(left, top, theConfig.rowSize, theConfig.textColor, bgColor, item.name, { id: item.id, name: item.name }));
    return c;
}
function createAttendee(item, top, bgColor, events, theConfig) {
    var _a;
    const arr = [];
    const lines = [];
    const radius = theConfig.circleSize;
    const c = new ContainerDrawItem();
    c.items = arr;
    c.lines = lines;
    c.top = top;
    c.width = theConfig.colSize * (events.length + 1);
    c.bgColor = bgColor;
    arr.push(createAttendeeName(item, top, c.bgColor, theConfig));
    lines.push(LineDrawItem.create(0, top, c.width, top, theConfig.lineColor, {}).moveBy(0, theConfig.rowSize / 2));
    events.forEach((e, j) => {
        if (item.events.indexOf(e.id) >= 0) {
            const pos = getEventPos(e.id, events, theConfig);
            arr.push(CircleDrawItem.create(pos.left, top, radius * 2, theConfig.eventColor, {
                event: e,
                attendee: { id: item.id, name: item.name },
            }, ``).moveBy((theConfig.colSize - 2 * radius) / 2, (theConfig.rowSize - 2 * radius) / 2));
        }
    });
    (_a = item.purchases) === null || _a === void 0 ? void 0 : _a.forEach((purchase, j) => {
        const tippingPointEvt = events.reduce((p, c) => purchase.date >= c.date ? c : p, events[0]);
        const pos = getEventPos(tippingPointEvt.id, events, theConfig);
        arr.push(CircleDrawItem.create(pos.left, top, radius * 2, purchase.color || theConfig.purchaseColor, {
            event: tippingPointEvt,
            attendee: { id: item.id, name: item.name },
            purchase: purchase,
        }, ``)
            .moveBy(2 + radius * 2 + (theConfig.colSize - 2 * radius) / 2, (theConfig.rowSize - 2 * radius) / 2)
            .moveBy(j * radius * 2, 0));
    });
    return c;
}
function createDrawItems$1(attendees, events, theConfig) {
    const arr = [];
    const lines = [];
    arr.push(BoxDrawItem.create(0, 0, theConfig.colSize, theConfig.textColor, () => ['yellow', 'red'], () => ['red', 'yellow'], theConfig.borderColor, null, 'Heatmap').setHeight(theConfig.rowSize * 0.8));
    arr.push(createEvents(events, attendees, theConfig));
    attendees.forEach((item, i) => {
        const bgColor = i % 2 === 0 ? theConfig.alternateBgColor : theConfig.defaultBgColor;
        const top = (i + 2) * theConfig.rowSize;
        arr.push(createAttendee(item, top, bgColor, events, theConfig));
    });
    const c = new ContainerDrawItem();
    c.items = arr;
    c.lines = lines;
    c.width = c.getWidth();
    c.height = c.getHeight();
    return [c];
}
function AttendeesChart(props) {
    const { attendees, events, config, tooltip, onClick } = props;
    const theConfig = react.useMemo(() => (Object.assign(Object.assign({}, defaultConfig$1), getConfig(config))), [config]);
    const drawItems = react.useMemo(() => createDrawItems$1(attendees, events, theConfig), [attendees, events, theConfig]);
    return (jsxRuntime.jsx(CanvasChart, { drawItems: drawItems, onClick: onClick, theConfig: theConfig, tooltip: tooltip }, void 0));
}

const defaultConfig = {
    colSize: 60,
    rowSize: 40,
    itemSize: 25,
    fontSize: 12,
    itemColor: 'blue',
};
function createItem(item, top, minStartDate, maxEndDate, nameWidth, cWidth, bgColor, theConfig) {
    const c = new ContainerDrawItem();
    c.top = top;
    c.height = theConfig.rowSize;
    c.bgColor = bgColor;
    c.items = [];
    c.width = cWidth;
    const t = dateFns.differenceInSeconds(minStartDate, maxEndDate);
    const s = dateFns.differenceInSeconds(minStartDate, item.startDate);
    const e = dateFns.differenceInSeconds(minStartDate, item.endDate);
    c.items.push(BoxDrawItem.create(0, top, nameWidth, theConfig.textColor, item.bgColor, theConfig.selBgColor, theConfig.borderColor, item, item.name)
        .setHeight(theConfig.rowSize)
        .setTextAlign('left')
        .setFont(`${theConfig.fontSize}px Verdana`));
    const left = theConfig.colSize * (s / t);
    const width = Math.max(15, theConfig.colSize * (e / t) - left);
    c.items.push(BoxDrawItem.create(left, top, width, theConfig.textColor, theConfig.itemColor, theConfig.selBgColor, theConfig.borderColor, item, '')
        .setHeight(theConfig.itemSize)
        .moveBy(nameWidth, (theConfig.rowSize - theConfig.itemSize) / 2));
    return c;
}
function createDrawItems(items, theConfig) {
    const arr = [];
    const minStartDate = items.reduce((p, c) => (p < c.startDate ? p : c.startDate), new Date());
    const maxStartDate = items.reduce((p, c) => (p > c.startDate ? p : c.startDate), new Date());
    const maxEndDate = items.reduce((p, c) => (p > c.endDate ? p : c.endDate), maxStartDate);
    const nameWidth = items.reduce((p, c) => Math.max(p, c.name.length * theConfig.fontSize), 0);
    items.forEach((item, i) => {
        arr.push(createItem(item, i * theConfig.rowSize, minStartDate, maxEndDate, nameWidth, theConfig.colSize * 10, i % 2 === 0 ? theConfig.alternateBgColor : theConfig.defaultBgColor, theConfig));
    });
    const c = new ContainerDrawItem();
    c.items = arr;
    c.height = c.getHeight();
    c.width = c.getWidth();
    return [c];
}
function BasicGantChart(props) {
    const { items, config, tooltip, onClick } = props;
    const theConfig = react.useMemo(() => (Object.assign(Object.assign({}, defaultConfig), getConfig(config))), [config]);
    const drawItems = react.useMemo(() => createDrawItems(items, theConfig), [
        items,
        theConfig,
    ]);
    return (jsxRuntime.jsx(CanvasChart, { drawItems: drawItems, onClick: onClick, theConfig: theConfig, tooltip: tooltip }, void 0));
}

exports.AchievementsChart = AchievementsChart;
exports.AttendeesChart = AttendeesChart;
exports.BasicGantChart = BasicGantChart;
exports.StackedBarChart = StackedBarChart;
exports.YearsCalendar = YearsCalendar;
//# sourceMappingURL=index.js.map
