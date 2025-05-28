import { StyledSwitch } from './styles';

// ----------------------------------------------------------------------

const Switch = ({ sx, ...other }) => {
  return <StyledSwitch sx={sx} {...other} />;
};

export default Switch;
