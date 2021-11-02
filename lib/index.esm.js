import { jsx, Fragment, jsxs } from 'react/jsx-runtime';
import { useRef, useEffect, useMemo, useCallback, useState, createElement } from 'react';
import { getDaysInYear, addDays, getWeek, format } from 'date-fns';

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
    getColor(ctx, color) {
        if (typeof color === "function") {
            const colors = color();
            const grd = ctx.createLinearGradient(this.left, this.top, this.left + this.getWidth(), this.top + this.getHeight());
            grd.addColorStop(0, colors[0]);
            grd.addColorStop(1, colors[1]);
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
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(this.left, this.top, size.width, this.height);
        ctx.fillStyle = this.color;
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
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        draw(context);
    }, [draw]);
    useEffect(() => {
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
    useEffect(() => {
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
    }
    draw(ctx) {
        const bg = this.getColor(ctx, this.bgColor);
        const selBg = this.getColor(ctx, this.selBgColor);
        ctx.fillStyle = this.selected || this.hovering ? selBg : bg;
        ctx.fillRect(this.left, this.top, this.getWidth(), this.getHeight());
        //console.log(`box ${this.text} ${this.hovering} ${ctx.fillStyle} ${this.left} ${this.top} ${this.getWidth()} ${this.getHeight()}`);
        if (this.borderColor !== this.bgColor) {
            ctx.strokeWidth = 0.5;
            ctx.strokeStyle = this.borderColor;
            ctx.strokeRect(this.left, this.top, this.getWidth(), this.getHeight());
        }
        if (this.text) {
            ctx.font = "9px Verdana";
            ctx.textBaseline = 'middle';
            ctx.textAlign = "center";
            ctx.fillStyle = this.color;
            ctx.fillText(this.text, this.left + this.getWidth() / 2, this.top + this.getHeight() / 2, this.getWidth());
        }
        if (this.sideKick)
            this.sideKick.draw(ctx);
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
        ctx.fillStyle = this.bgColor;
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
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i].getHit(x, y);
            if (item) {
                return item;
            }
        }
        return super.getHit(x, y);
    }
}

function CanvasContainer(props) {
    const { drawItems, onClick, onHover, minHeight } = props;
    const height = useMemo(() => Math.min(20000, drawItems.reduce((p, c) => p + c.getHeight(), 50)), [drawItems]);
    const width = useMemo(() => {
        return Math.min(20000, drawItems.reduce((p, c) => Math.max(p, c.getWidth()), 0));
    }, [drawItems]);
    const draw = useCallback((ctx) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        drawItems === null || drawItems === void 0 ? void 0 : drawItems.forEach((di) => {
            di.draw(ctx);
        });
    }, [drawItems]);
    const click = useCallback(({ x, y }, ctx) => {
        const hitItem = drawItems.reduce((p, c) => (!p ? c.getHit(x, y) : p), null);
        if (hitItem && onClick && hitItem.data) {
            onClick(hitItem.data);
        }
    }, [drawItems, onClick]);
    const lastHit = useRef(null);
    const hover = useCallback(({ x, y }, ctx) => {
        var _a, _b;
        const hitItem = drawItems.reduce((p, c) => (!p ? c.getHit(x, y) : p), null);
        if (hitItem instanceof TextDrawItem ||
            hitItem instanceof ContainerDrawItem)
            return;
        if (lastHit.current !== hitItem) {
            if (lastHit.current) {
                const di = lastHit.current;
                if (di) {
                    di.hovering = false;
                    (_a = di.parent) === null || _a === void 0 ? void 0 : _a.draw(ctx);
                    di.draw(ctx);
                }
            }
            if (hitItem) {
                if (onHover)
                    onHover(hitItem.data);
            }
        }
        if (hitItem) {
            hitItem.hovering = true;
            (_b = hitItem.parent) === null || _b === void 0 ? void 0 : _b.draw(ctx);
            hitItem.draw(ctx);
        }
        lastHit.current = hitItem;
    }, [drawItems, lastHit, onHover]);
    const canvasRef = useCanvas(draw, click, hover);
    return (jsx("div", Object.assign({ style: {
            padding: '8px',
            position: 'relative',
            overflow: 'auto',
            width: '100%',
            minHeight,
        } }, { children: jsx("canvas", { width: width + 50, height: height, ref: canvasRef }, void 0) }), void 0));
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
    const [value, setValue] = useState(null);
    useEffect(() => {
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
    const ref = useRef();
    useEffect(() => {
        const setFromEvent = (e) => {
            const elm = ref.current;
            if (elm && elm.style) {
                let left = e.clientX;
                let top = e.clientY;
                if (e.clientX + elm.offsetWidth > window.innerWidth) {
                    left = window.innerWidth - elm.offsetWidth;
                }
                if (e.clientY + elm.offsetHeight > window.innerWidth) {
                    top = window.innerHeight - elm.offsetHeight;
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
    return tooltip && value ? (jsx("div", Object.assign({ ref: ref, style: {
            padding: '10px',
            position: 'fixed',
            zIndex: 10000,
        } }, { children: createElement(tooltip, { item: value }) }), void 0)) : (jsx(Fragment, {}, void 0));
}

const CELL_SIZE = 25;
const defaultConfig$3 = {
    selBgColor: '#dcf5ff',
    defaultBgColor: '#fff',
    alternateBgColor: '#fefefe',
    textColor: '#000',
    selTextColor: '#111',
    borderColor: '#efefef',
};
function getLocation(date) {
    const top = date.getDay() * CELL_SIZE;
    let w = getWeek(date);
    if (date.getMonth() > 10 && w < 45)
        w = 53;
    const left = w * CELL_SIZE;
    return { top, left };
}
function getWeekDayHeader(config) {
    const arr = [];
    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach((x, idx) => {
        arr.push(TextDrawItem.create(CELL_SIZE, (idx + 1) * CELL_SIZE, CELL_SIZE, config.textColor || '#111', config.defaultBgColor || '#fff', x, {}));
    });
    return arr;
}
function getMonthsHeader(year, config) {
    const startDate = new Date(year, 0, 15);
    const arr = [];
    for (var i = 0; i < 12; i++) {
        startDate.setMonth(i);
        let w = getWeek(startDate);
        if (i > 10 && w < 45)
            w = 53;
        arr.push(TextDrawItem.create((1 + w) * CELL_SIZE, 0, CELL_SIZE, config.textColor || '#111', config.defaultBgColor || '#fff', format(startDate, 'MMM'), {}));
    }
    return arr;
}
function YearBox(props) {
    const { year, items, onClick, onHover, config } = props;
    const drawItems = useMemo(() => {
        let startDate = new Date(year, 0, 15);
        const arr = [
            ...getWeekDayHeader(config),
            ...getMonthsHeader(year, config),
        ];
        startDate = new Date(year, 0, 1);
        const maxDays = getDaysInYear(startDate);
        const allData = {};
        items.forEach((a) => {
            const index = a.date.toDateString();
            if (!allData[index])
                allData[index] = [];
            allData[index].push(a);
        });
        for (let i = 0; i < maxDays; i++) {
            const loc = getLocation(startDate);
            let bgColor = startDate.getMonth() % 2 === 0
                ? config.defaultBgColor
                : config.alternateBgColor;
            const index = startDate.toDateString();
            if (allData[index]) {
                const item = GridDrawItem.create(loc.top + CELL_SIZE, loc.left + CELL_SIZE, CELL_SIZE - 2, config.selTextColor || 'brown', bgColor || '#fff', config.selBgColor || '#fff', config.borderColor || '#fff', allData[index], `${startDate.getDate()}`);
                arr.push(item);
            }
            else {
                const item = BoxDrawItem.create(loc.left + CELL_SIZE, loc.top + CELL_SIZE, CELL_SIZE - 2, config.textColor || '#111', bgColor || '#fff', config.selBgColor || '#fff', config.borderColor || '#fff', '', `${startDate.getDate()}`);
                arr.push(item);
            }
            startDate = addDays(startDate, 1);
        }
        const c = new ContainerDrawItem();
        c.items = arr;
        c.bgColor = config.defaultBgColor || '#fff';
        c.color = config.textColor || '#111';
        return [c];
    }, [year, items, config]);
    return (jsxs("div", Object.assign({ style: {
            display: 'flex',
            padding: '10px',
            justifyContent: 'center',
            backgroundColor: config.defaultBgColor,
            color: config.textColor,
        } }, { children: [jsx("div", { children: jsx("div", Object.assign({ style: {
                        fontWeight: 'bold',
                        fontSize: 'x-large',
                        transform: 'translateY(80px) rotate(-90deg)',
                    } }, { children: year }), void 0) }, void 0), jsx(CanvasContainer, { drawItems: drawItems, onClick: onClick, onHover: onHover }, void 0)] }), void 0));
}
function YearsCalendar(props) {
    const { items, config, onClick, onHover, tooltip } = props;
    const [selected, setSelected] = useState(null);
    const groupedItems = useMemo(() => groupBy(items, (item) => item.date.getFullYear()), [items]);
    const theConfig = Object.assign(Object.assign({}, defaultConfig$3), config);
    const handleHover = useCallback((item) => {
        setSelected(item);
        if (onHover)
            onHover(item);
    }, [setSelected, onHover]);
    return (jsxs("div", Object.assign({ style: {
            padding: '10px',
            backgroundColor: theConfig.defaultBgColor,
            color: theConfig.textColor,
        } }, { children: [Object.keys(groupedItems).map((key, i) => (jsx("div", { children: jsx(YearBox, { year: key, items: groupedItems[key], config: theConfig, onClick: onClick, onHover: handleHover }, void 0) }, i))), jsx(ChartTooltip, { tooltip: tooltip, selected: selected }, void 0)] }), void 0));
}

const defaultConfig$2 = {
    selBgColor: '#dcf5ff',
    defaultBgColor: '#fff',
    alternateBgColor: '#fefefe',
    textColor: '#000',
    selTextColor: '#111',
    borderColor: '#efefef',
    barSize: 18,
    gutterSize: 5,
};
function StackedBarChart(props) {
    const { items, config, tooltip, onClick } = props;
    const [selected, setSelected] = useState(null);
    const theConfig = useMemo(() => (Object.assign(Object.assign({}, defaultConfig$2), config)), [config]);
    const drawItems = useMemo(() => {
        const dItems = [];
        const COL_SIZE = (theConfig.barSize || 0) + (theConfig.gutterSize || 0);
        const CELL_HEIGHT = theConfig.barSize || 0;
        const maxHeight = CELL_HEIGHT *
            items.reduce((p, c) => Math.max(p, c.items.reduce((p1, c1) => p1 + c1.value, 0), 0), 0);
        items.forEach((item, i) => {
            let top = maxHeight -
                CELL_HEIGHT *
                    item.items.reduce((p, c) => p + c.value, 0);
            let h = 0;
            item.items.forEach((sItem, j) => {
                const ditem = BoxDrawItem.create(i * COL_SIZE, top, theConfig.barSize || 5, theConfig.textColor || '#111', sItem.bgColor || '#fff', theConfig.selBgColor || '#fff', theConfig.borderColor || '#fff', sItem, '');
                h = sItem.value * CELL_HEIGHT;
                ditem.height = h;
                top += h;
                dItems.push(ditem);
            });
        });
        const c = new ContainerDrawItem();
        c.items = dItems;
        c.bgColor = theConfig.defaultBgColor || '#fff';
        c.color = theConfig.textColor || '#111';
        return [c];
    }, [items, theConfig]);
    const handleOnHover = useCallback((item) => {
        setSelected(item);
    }, [setSelected]);
    return (jsxs("div", Object.assign({ style: {
            display: 'flex',
            padding: '10px',
            justifyContent: 'stretch',
            backgroundColor: theConfig.defaultBgColor,
            color: theConfig.textColor,
        } }, { children: [jsx(CanvasContainer, { drawItems: drawItems, onClick: onClick, onHover: handleOnHover }, void 0), jsx(ChartTooltip, { tooltip: tooltip, selected: selected }, void 0)] }), void 0));
}

const defaultConfig$1 = {
    selBgColor: '#dcf5ff',
    defaultBgColor: '#fff',
    alternateBgColor: '#fefefe',
    textColor: '#000',
    selTextColor: '#111',
    borderColor: '#efefef',
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
    const ROW_HEIGHT = theConfig.rowSize || 25;
    const BOX_SIZE = theConfig.boxSize || 18;
    //c.color = theConfig.textColor || '#111';
    //Create Badges
    (_a = item.badges) === null || _a === void 0 ? void 0 : _a.forEach((b, j) => {
        const bd = BoxDrawItem.create(j * BOX_SIZE, top + (ROW_HEIGHT - BOX_SIZE) / 2, BOX_SIZE, theConfig.textColor || '#333', b.bgColor, theConfig.selBgColor || '#fff', theConfig.borderColor || '#666', { item, badge: b }, '');
        c.items.push(bd);
    });
    //Create Name
    c.items.push(TextDrawItem.create(5 * BOX_SIZE, top, ROW_HEIGHT, theConfig.textColor || '#333', bgColor || '#fff', item.name, { item }));
    //Create Timelines
    (_b = item.timeline) === null || _b === void 0 ? void 0 : _b.forEach((b, j) => {
        const bd = BoxDrawItem.create(200 + j * BOX_SIZE, top + (ROW_HEIGHT - BOX_SIZE) / 2, BOX_SIZE, theConfig.textColor || '#333', b.bgColor, theConfig.selBgColor || '#fff', theConfig.borderColor || '#666', { item, badge: b }, '');
        c.items.push(bd);
        if (b.badgeCount && b.badgeCount > 0) {
            const bg1 = BoxDrawItem.create(200 + j * BOX_SIZE + (BOX_SIZE - 5) / 2, top + (ROW_HEIGHT - BOX_SIZE) / 2 - 5 / 2, 5, theConfig.textColor || '#333', 'green', theConfig.selBgColor || '#fff', theConfig.borderColor || '#666', { item, badge: b }, '');
            bd.sideKick = bg1;
            c.items.push(bg1);
        }
    });
    return c;
}
function AchievementsChart(props) {
    const { items, config, tooltip, onClick } = props;
    const [selected, setSelected] = useState(null);
    const theConfig = useMemo(() => (Object.assign(Object.assign({}, defaultConfig$1), config)), [config]);
    const drawItems = useMemo(() => {
        const dItems = [];
        const width = items.reduce((p1, c) => Math.max(p1, c.badges.length + c.timeline.length * (theConfig.boxSize || 20) + 200), 0);
        items.forEach((item, index) => {
            const c1 = createLineItem(item, index * (theConfig.rowSize || 25), theConfig, (index % 2 === 0
                ? theConfig.defaultBgColor
                : theConfig.alternateBgColor) || '#fff');
            c1.width = width;
            dItems.push(c1);
        });
        return dItems;
    }, [items, theConfig]);
    const handleOnHover = useCallback((item) => {
        setSelected(item);
    }, [setSelected]);
    return (jsxs("div", Object.assign({ style: {
            display: 'flex',
            padding: '10px',
            justifyContent: 'stretch',
            backgroundColor: theConfig.defaultBgColor,
            color: theConfig.textColor,
        } }, { children: [jsx(CanvasContainer, { drawItems: drawItems, onClick: onClick, onHover: handleOnHover }, void 0), jsx(ChartTooltip, { tooltip: tooltip, selected: selected }, void 0)] }), void 0));
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

class CircleDrawItem extends DrawItem {
    constructor() {
        super(...arguments);
        this.bgColor = '#fff';
        this.borderColor = '#fff';
        this.selBgColor = '#dcf5ff';
        this.text = '';
    }
    draw(ctx) {
        ctx.fillStyle =
            this.selected || this.hovering ? this.selBgColor : this.bgColor;
        ctx.strokeStyle = this.borderColor;
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

const defaultConfig = {
    selBgColor: '#dcf5ff',
    defaultBgColor: '#fff',
    alternateBgColor: '#fefefe',
    textColor: '#000',
    selTextColor: '#111',
    borderColor: '#efefef',
    purchaseColor: 'green',
    eventColor: 'blue',
    rowSize: 30,
    colSize: 150,
    circleSize: 25,
};
function getEventPos(eventId, events, theConfig) {
    const i = events.findIndex((x) => x.id === eventId);
    return { top: 0, left: (i + 1) * (theConfig.colSize || 0) };
}
function getHeat(delta) {
    return `rgb(255, ${(1 - delta) * 255} ,0)`;
}
function createAttendee(item, i, events, theConfig) {
    var _a;
    const arr = [];
    const lines = [];
    const radius = theConfig.circleSize || 5;
    const c = new ContainerDrawItem();
    c.items = arr;
    c.lines = lines;
    c.top = (i + 2) * (theConfig.rowSize || 0);
    c.width = (theConfig.colSize || 0) * (events.length + 1);
    c.bgColor =
        (i % 2 === 0 ? theConfig.alternateBgColor : theConfig.defaultBgColor) ||
            '#fff';
    let left = 0;
    let top = (i + 2) * (theConfig.rowSize || 0);
    arr.push(BoxDrawItem.create(left, top, theConfig.colSize || 0, theConfig.textColor || '#fff', theConfig.defaultBgColor || '#fff', theConfig.selBgColor || '#fff', theConfig.borderColor || '#fff', { id: item.id, name: item.name }, item.name).setHeight(theConfig.rowSize || 0));
    events.forEach((e) => {
        if (item.events.indexOf(e.id) >= 0) {
            const pos = getEventPos(e.id, events, theConfig);
            lines.push(LineDrawItem.create(left + 1.2 * radius, top, pos.left - 1.2 * radius, top, theConfig.borderColor || '#fff', {}).moveBy((theConfig.colSize || 0) / 2, (theConfig.rowSize || 0) / 2));
            left = pos.left;
            arr.push(CircleDrawItem.create(pos.left, top, radius * 2, theConfig.eventColor || '#fff', {
                event: e,
                attendee: { id: item.id, name: item.name },
            }, '').moveBy(((theConfig.colSize || 0) - 2 * radius) / 2, ((theConfig.rowSize || 0) - 2 * radius) / 2));
        }
    });
    (_a = item.purchases) === null || _a === void 0 ? void 0 : _a.forEach((purchase, j) => {
        const tippingPointEvt = events.reduce((p, c) => purchase.date >= c.date ? c : p, events[0]);
        const pos = getEventPos(tippingPointEvt.id, events, theConfig);
        arr.push(CircleDrawItem.create(pos.left, top, radius * 2, purchase.color || theConfig.purchaseColor || '#fff', {
            event: tippingPointEvt,
            attendee: { id: item.id, name: item.name },
            purchase: purchase,
        }, '')
            .moveBy(2 + radius * 2 + ((theConfig.colSize || 0) - 2 * radius) / 2, ((theConfig.rowSize || 0) - 2 * radius) / 2)
            .moveBy(j * radius * 2, 0));
    });
    return c;
}
function createDrawItems(attendees, events, theConfig) {
    const arr = [];
    arr.push(BoxDrawItem.create(0, 0, theConfig.colSize || 0, theConfig.textColor || '#333', () => ['yellow', 'red'], () => ['red', 'yellow'], theConfig.borderColor || '#eee', null, 'Heatmap').setHeight((theConfig.rowSize || 0) / 2));
    events.forEach((evt, i) => {
        const occurance = attendees.reduce((p, c) => p + (c.events.indexOf(evt.id) >= 0 ? 1 : 0), 0);
        const color = getHeat(occurance / attendees.length);
        const e1 = BoxDrawItem.create((i + 1) * (theConfig.colSize || 0), theConfig.rowSize || 0, theConfig.colSize || 0, theConfig.textColor || '#fff', color, theConfig.selBgColor || '#fff', theConfig.borderColor || '#fff', evt, evt.name);
        e1.height = theConfig.rowSize || 0;
        arr.push(e1);
    });
    attendees.forEach((item, i) => {
        arr.push(createAttendee(item, i, events, theConfig));
    });
    const c = new ContainerDrawItem();
    c.items = arr;
    return [c];
}
function AttendeesChart(props) {
    const { attendees, events, config, tooltip, onClick } = props;
    const theConfig = useMemo(() => (Object.assign(Object.assign({}, defaultConfig), config)), [config]);
    const [selected, setSelected] = useState(null);
    const drawItems = useMemo(() => createDrawItems(attendees, events, theConfig), [attendees, events, theConfig]);
    const handleOnHover = useCallback((item) => {
        setSelected(item);
    }, [setSelected]);
    return (jsxs("div", Object.assign({ style: {
            display: 'flex',
            padding: '10px',
            justifyContent: 'stretch',
            backgroundColor: theConfig.defaultBgColor,
            color: theConfig.textColor,
        } }, { children: [jsx(CanvasContainer, { drawItems: drawItems, onClick: onClick, onHover: handleOnHover }, void 0), jsx(ChartTooltip, { tooltip: tooltip, selected: selected }, void 0)] }), void 0));
}

export { AchievementsChart, AttendeesChart, StackedBarChart, YearsCalendar };
//# sourceMappingURL=index.esm.js.map
