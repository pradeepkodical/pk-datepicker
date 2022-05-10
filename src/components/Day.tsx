import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { alpha, styled } from '@mui/material';

interface DayProps {
  filled?: boolean;
  outlined?: boolean;
  highlighted?: boolean;
  disabled?: boolean;
  startOfRange?: boolean;
  endOfRange?: boolean;
  onClick?: () => void;
  onHover?: () => void;
  value: number | string;
}

const StyledDayBox = styled(Box)<{
  startOfRange?: any;
  endOfRange?: any;
  disabled?: boolean;
  highlighted?: boolean;
  outlined?: boolean;
  filled?: boolean;
}>(
  ({
    theme,
    filled,
    outlined,
    disabled,
    highlighted,
    startOfRange,
    endOfRange,
  }) => {
    const bg =
      !disabled && filled
        ? theme.palette.primary.dark
        : !disabled && highlighted
        ? theme.palette.primary.light
        : 'inherit';

    const color = bg !== 'inherit' ? theme.palette.getContrastText(bg) : '';

    return {
      display: 'flex',
      marginBottom: 2,
      borderTopLeftRadius: startOfRange ? '50%' : 0,
      borderBottomLeftRadius: startOfRange ? '50%' : 0,
      borderTopRightRadius: endOfRange ? '50%' : 0,
      borderBottomRightRadius: endOfRange ? '50%' : 0,
      backgroundColor:
        !disabled && highlighted ? theme.palette.primary.light : 'inherit',
      '& .MuiIconButton-root': {
        height: 36,
        width: 36,
        padding: 0,
        border:
          !disabled && outlined
            ? `1px solid ${theme.palette.primary.dark}`
            : 'inherit',
        backgroundColor: bg,
        //backgroundColor: !disabled && filled ? theme.palette.primary.dark : '',
        '& .MuiTypography-root': {
          color: color,
          /*color:
            !disabled && (filled || highlighted)
              ? theme.palette.getContrastText(theme.palette.primary.dark)
              : '',*/
        },
      },
    };
  }
);

export function Day(props: DayProps) {
  const { onHover, onClick, ...others } = props;
  return (
    <StyledDayBox {...others} className={props.highlighted ? 'selected' : ''}>
      <IconButton
        disabled={props.disabled}
        onClick={onClick}
        onMouseOver={onHover}
        className={`btn-day-${props.value}`}
      >
        <Typography
          color={!props.disabled ? 'initial' : 'textSecondary'}
          variant='body2'
        >
          {props.value}
        </Typography>
      </IconButton>
    </StyledDayBox>
  );
}
