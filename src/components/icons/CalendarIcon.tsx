import { SvgIcon, SvgIconProps } from '@mui/material';

export function CalendarIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} sx={{ fill: 'currentColor' }}>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M7 2h2v1h6V2h2v1h4v16.586a1 1 0 0 1-.293.707l-1.414 1.414a1 1 0 0 1-.707.293H5.414a1 1 0 0 1-.707-.293l-1.414-1.414A1 1 0 0 1 3 19.586V3h4V2zm8 3v1h2V5h2v3H5V5h2v1h2V5h6zM5 20h14V10H5v10z'
      />
      <path d='M7 12h2v2H7zM11 12h2v2h-2zM15 12h2v2h-2zM7 16h2v2H7zM11 16h2v2h-2z' />
    </SvgIcon>
  );
}
