# React Charts

kpr-charts is a react charts library, developed and maintained by Pradeep(kpradeeprao@gmail.com).

## Installation

Use the package manager to install kpr-charts.

```bash
yarn add kpr-charts
```

```bash
npm -i kpr-charts
```

## Usage

```tsx
<YearsCalendar
  config={{
    alternateBgColor: '#eee',
    borderColor: '#999',
    defaultBgColor: '#fff',
    selBgColor: '#dcf5ff',
    selTextColor: 'pink',
    textColor: '#000',
  }}
  items={[
    {
      bgColor: 'red',
      date: new Date('2021-10-29T00:49:49.911Z'),
      data: {},
    },
    {
      bgColor: 'pink',
      date: new Date('2019-02-01T06:00:00.000Z'),
      data: {},
    },
    {
      bgColor: 'orange',
      date: new Date('2019-02-01T06:00:00.000Z'),
      data: {},
    },
    {
      bgColor: 'purple',
      date: new Date('2021-10-29T00:49:49.911Z'),
      data: {},
    },
  ]}
  onClick={(item: IHaveDate) => {}}
  onHover={(item: IHaveDate, x: number, y: number) => {}}
/>
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
