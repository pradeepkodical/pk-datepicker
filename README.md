# React Charts

ka-charts is a react charts library, developed and maintained by Pradeep(kpradeeprao@gmail.com).

## Installation

Use the package manager to install ka-charts.

```bash
yarn add ka-charts
```

```bash
npm i ka-charts
```

## Usage

```tsx
<BasicGantChart
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
      startDate: new Date('2021-10-29T00:49:49.911Z'),
      endDate: new Date('2021-10-29T00:49:49.911Z'),
      data: {},
    },
    {
      bgColor: 'pink',
      startDate: new Date('2021-10-29T00:49:49.911Z'),
      endDate: new Date('2021-10-29T00:49:49.911Z'),
      data: {},
    },
  ]}
  onClick={(item) => {}}
/>
```

```tsx
<StackedBarChart
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
      key: '111',
      items: [
        {
          bgColor: 'red',
          key: '1',
          value: 111,
          data: {},
        },
        {
          bgColor: 'green',
          key: '2',
          value: 2111,
          data: {},
        },
      ],
    },
  ]}
  onClick={(item) => {}}
/>
```

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
  onClick={(item) => {}}
/>
```

## Demo

[Demo](https://codesandbox.io/s/ka-charts-bp1jg)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
