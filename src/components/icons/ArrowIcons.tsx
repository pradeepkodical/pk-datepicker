import { SvgIcon, SvgIconProps } from '@mui/material';

export function ArrowUpIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} sx={{ fill: 'currentColor' }}>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M13.293 7.293A1 1 0 0 0 12.586 7h-1.172a1 1 0 0 0-.707.293L4 14l1.414 1.414L12 8.828l6.586 6.586L20 14l-6.707-6.707z'
      />
    </SvgIcon>
  );
}

export function ArrowDownIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} sx={{ fill: 'currentColor' }}>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M10.707 16.707a1 1 0 0 0 .707.293h1.172a1 1 0 0 0 .707-.293L20 10l-1.414-1.414L12 15.17 5.414 8.587 4 10l6.707 6.707z'
      />
    </SvgIcon>
  );
}

export function ArrowLeftIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} sx={{ fill: 'currentColor' }}>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M7.293 13.293A1 1 0 0 1 7 12.586v-1.172a1 1 0 0 1 .293-.707L14 4l1.414 1.414L8.828 12l6.586 6.586L14 20l-6.707-6.707z'
      />
    </SvgIcon>
  );
}

export function ArrowRightIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} sx={{ fill: 'currentColor' }}>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M16.707 13.293a1 1 0 0 0 .293-.707v-1.172a1 1 0 0 0-.293-.707L10 4 8.586 5.414 15.17 12l-6.585 6.586L10 20l6.707-6.707z'
      />
    </SvgIcon>
  );
}
