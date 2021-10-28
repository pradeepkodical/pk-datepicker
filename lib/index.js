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

function CanvasContainer(props) {
    const { drawItems, onClick, onHover, children, minHeight } = props;
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
        var _a, _b;
        const hitItem = drawItems.reduce((p, c) => (!p ? c.getHit(x, y) : p), null);
        if (hitItem instanceof TextDrawItem)
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
            lastHit.current = hitItem;
            if (hitItem) {
                if (onHover && hitItem.data)
                    onHover(hitItem.data, x, y);
            }
        }
        if (hitItem) {
            hitItem.hovering = true;
            hitItem.draw(ctx);
            (_b = hitItem.parent) === null || _b === void 0 ? void 0 : _b.draw(ctx);
        }
    }, [drawItems, lastHit, onHover]);
    const canvasRef = useCanvas(draw, click, hover);
    return (jsxRuntime.jsxs("div", Object.assign({ style: {
            padding: '8px',
            position: 'relative',
            overflow: 'auto',
            minHeight,
        } }, { children: [jsxRuntime.jsx("canvas", { width: width, height: height, ref: canvasRef }, void 0), children] }), void 0));
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
        ctx.fillStyle = this.selected || this.hovering ? this.selBgColor : this.bgColor;
        ctx.fillRect(this.left, this.top, this.getWidth(), this.getHeight());
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
    }
    static create(top, left, size, color, bgColor, selBgColor, borderColor, data, text) {
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
    }
    draw(ctx) {
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(this.left, this.top, this.getWidth(), this.getHeight());
        this.items.forEach((x) => x.draw(ctx));
    }
    getWidth() {
        return this.width !== 0 ? this.width : this.items.reduce((p, c) => Math.max(p, c.left + c.getWidth()), 0);
    }
    getHeight() {
        let h = this.height;
        h = h !== 0 ? h : this.items.reduce((p, c) => Math.max(p, c.top + c.getHeight()), 0);
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
            const item1 = BoxDrawItem.create(top + Math.floor(idx / c) * size1, left + (idx % c) * size1, size1, color, a.bgColor, selBgColor, borderColor, a, ``);
            item1.parent = item;
            item.items.push(item1);
        });
        return item;
    }
}

const CELL_SIZE = 25;
const defaultConfig = {
    selBgColor: '#dcf5ff',
    defaultBgColor: '#fff',
    alternateBgColor: '#fefefe',
    textColor: '#000',
    selTextColor: '#111',
    borderColor: '#efefef',
};
function getLocation(date) {
    const top = date.getDay() * CELL_SIZE;
    let w = dateFns.getWeek(date);
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
        let w = dateFns.getWeek(startDate);
        if (i > 10 && w < 45)
            w = 53;
        arr.push(TextDrawItem.create((1 + w) * CELL_SIZE, 0, CELL_SIZE, config.textColor || '#111', config.defaultBgColor || '#fff', dateFns.format(startDate, 'MMM'), {}));
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
                const item = BoxDrawItem.create(loc.top + CELL_SIZE, loc.left + CELL_SIZE, CELL_SIZE - 2, config.textColor || '#111', bgColor || '#fff', config.selBgColor || '#fff', config.borderColor || '#fff', '', `${startDate.getDate()}`);
                arr.push(item);
            }
            startDate = dateFns.addDays(startDate, 1);
        }
        const c = new ContainerDrawItem();
        c.items = arr;
        c.bgColor = config.defaultBgColor || '#fff';
        c.color = config.textColor || '#111';
        return [c];
    }, [year, items, config]);
    return (jsxRuntime.jsxs("div", Object.assign({ style: {
            display: 'flex',
            padding: '10px',
            justifyContent: 'center',
            backgroundColor: config.defaultBgColor,
            color: config.textColor,
        } }, { children: [jsxRuntime.jsx("div", { children: jsxRuntime.jsx("div", Object.assign({ style: {
                        fontWeight: 'bold',
                        fontSize: 'x-large',
                        transform: 'translateY(80px) rotate(-90deg)',
                    } }, { children: year }), void 0) }, void 0), jsxRuntime.jsx(CanvasContainer, { drawItems: drawItems, onClick: onClick, onHover: (item, x, y) => {
                    if (item) {
                        if (onHover)
                            onHover(item, x, y);
                    }
                } }, void 0)] }), void 0));
}
function YearsCalendar(props) {
    const { items, config, onClick, onHover } = props;
    const groupedItems = react.useMemo(() => groupBy(items, (item) => item.date.getFullYear()), [items]);
    const theConfig = Object.assign(Object.assign({}, defaultConfig), config);
    return (jsxRuntime.jsx("div", { children: Object.keys(groupedItems).map((key, i) => (jsxRuntime.jsx("div", { children: jsxRuntime.jsx(YearBox, { year: key, items: groupedItems[key], config: theConfig, onClick: onClick, onHover: onHover }, void 0) }, i))) }, void 0));
}

exports.YearsCalendar = YearsCalendar;
//# sourceMappingURL=index.js.map
