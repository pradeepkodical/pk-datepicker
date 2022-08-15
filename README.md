# React Date Range Component

ka-daterange is a date-range component using mui 5.^, developed and maintained by Pradeep(kpradeeprao@gmail.com).

## Installation

Use the package manager to install ka-date-range.

```bash
yarn add ka-daterange
```

```bash
npm i ka-daterange
```

## Usage

```tsx
export function() {
  const [range, setRange] = useState<PickerDateRange>({});
  const onChange = useCallback((v: PickerDateRange) => {
    setRange(v);
  }, []);
  return <StaticDateRangePicker dateRange={range} onChange={onChange}/>
}
```

```tsx
export function() {
  const [range, setRange] = useState<PickerDateRange>({});
  const onChange = useCallback((v: PickerDateRange) => {
    setRange(v);
  }, []);
  return <DateRangePickerField dateRange={range} onChange={onChange} />
}
```

## Demo

[Demo](https://codesandbox.io/s/ka-date-range-ztvlio)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
