import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const DropDown = ({
  handleChange,
  options,
  selected,
}: {
  handleChange: (e: SelectChangeEvent) => void;
  options: { value: string; display: string }[];
  selected: unknown;
}) => {
  return (
    <FormControl fullWidth>
      <Select
        id="select-proposal"
        value={`${selected}`}
        onChange={handleChange}
        sx={{
          borderRadius: '4px',
          width: '200px',
          height: '32px',
          boxShadow: '0px 8px 10px rgba(0, 0, 0, 0.14), 0px 3px 14px rgba(0, 0, 0, 0.12), 0px 5px 5px rgba(0, 0, 0, 0.2);',
        }}
      >
        {options.map((option) => (
          <MenuItem key={`${option.value}`} value={`${option.value}`}>
            {option.display}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
export default DropDown;
