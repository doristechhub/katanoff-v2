import { styled } from '@mui/material/styles';
import { TextareaAutosize } from '@mui/material';

import { grey, primary } from 'src/theme/palette';

// ----------------------------------------------------------------------

const StyledTextarea = styled(TextareaAutosize)(
  ({ theme }) => `
    box-sizing: border-box;
    width: 320px;
    font-weight: 400;
    line-height: 1.5;
    background:  #fff;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 0.875rem;
    color: ${grey[900]};
    border: 1px solid ${grey[200]};
    box-shadow: 0px 2px 2px ${grey[50]};
  
    &:hover {
      border-color: ${primary?.main};
    }
  
    &:focus {
      border-color: ${primary?.main};
      box-shadow: 0 0 0 3px ${primary?.light};
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);

export default StyledTextarea;
