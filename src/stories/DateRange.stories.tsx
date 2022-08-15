import { useCallback, useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PickerDateRange, StaticDateRangePicker } from '../components';
import { addMonths } from 'date-fns';

const today = new Date();

export default {
  title: 'Components/StaticDateRangePicker',
  component: StaticDateRangePicker,
} as ComponentMeta<typeof StaticDateRangePicker>;

const Template: ComponentStory<typeof StaticDateRangePicker> = (args) => {
  const [range, setRange] = useState<PickerDateRange>({});
  const onChange = (v: PickerDateRange) => {
    setRange(v);
  };

  return (
    <StaticDateRangePicker {...args} dateRange={range} onChange={onChange} />
  );
};

export const Default = Template.bind({});
Default.args = {};

export const NoRanges = Template.bind({});
NoRanges.args = {
  definedRanges: [],
};

const Template1: ComponentStory<typeof StaticDateRangePicker> = (args) => {
  const [minDate, setMinDate] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth() - 3, 1)
  );

  const [maxDate, setMaxDate] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth() + 3, 1)
  );

  const [range, setRange] = useState<PickerDateRange>({});
  const onChange = useCallback((v: PickerDateRange) => {
    setRange(v);
  }, []);

  const onSelected = useCallback((v: PickerDateRange) => {
    if (v.startDate) {
      setMinDate(addMonths(v.startDate, -1));
      setMaxDate(addMonths(v.startDate, 2));
    }
  }, []);

  return (
    <StaticDateRangePicker
      {...args}
      dateRange={range}
      onChange={onChange}
      onSelected={onSelected}
      minDate={minDate}
      maxDate={maxDate}
    />
  );
};

export const MinAndMaxRanges = Template1.bind({});
MinAndMaxRanges.args = {
  definedRanges: [],
};
