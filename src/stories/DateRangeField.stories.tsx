import { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PickerDateRange, DateRangePickerField } from '../components';
import { addMonths } from 'date-fns';

export default {
  title: 'Components/DateRangePickerField',
  component: DateRangePickerField,
} as ComponentMeta<typeof DateRangePickerField>;

const Template: ComponentStory<typeof DateRangePickerField> = (args) => {
  const [range, setRange] = useState<PickerDateRange>({
    startDate: new Date(2022, 0, 1),
    endDate: new Date(2022, 3, 1),
  });

  return (
    <div style={{ maxWidth: 300 }}>
      <DateRangePickerField {...args} dateRange={range} onChange={setRange} />
      <hr />
      <DateRangePickerField
        {...args}
        dateRange={range}
        onChange={setRange}
        definedRanges={[]}
      />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = { label: 'Monitoring Period', definedRanges: [] };

export const NoRanges = Template.bind({});
NoRanges.args = { label: 'Monitoring Period', definedRanges: [] };

const Template1: ComponentStory<typeof DateRangePickerField> = (args) => {
  const [range, setRange] = useState<PickerDateRange>({});

  const [minDate, setMinDate] = useState<Date | undefined>(undefined);

  const [maxDate, setMaxDate] = useState<Date | undefined>(undefined);

  const onSelected = (v: PickerDateRange) => {
    console.log(v);
    if (v.startDate) {
      setMinDate(addMonths(v.startDate, -1));
      setMaxDate(addMonths(v.startDate, 24));
    } else if (v.endDate) {
      setMinDate(addMonths(v.endDate, -24));
      setMaxDate(addMonths(v.endDate, 1));
    }
  };

  return (
    <div style={{ maxWidth: 300 }}>
      <DateRangePickerField
        {...args}
        minDate={minDate}
        maxDate={maxDate}
        dateRange={range}
        onChange={setRange}
        definedRanges={[]}
        onSelected={onSelected}
      />
    </div>
  );
};

export const MinAndMaxRanges = Template1.bind({});
MinAndMaxRanges.args = {
  label: 'Monitoring Period',
  okLabel: 'Idu Ok!',
  cancelLabel: 'Idu Yaake?',
};
