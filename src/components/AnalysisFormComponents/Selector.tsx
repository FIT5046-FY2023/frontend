import { FormControl, InputLabel, Select, Box, Chip, MenuItem, SelectChangeEvent, SelectProps } from "@mui/material";
import { useTheme } from '@mui/material/styles';

interface SelectorProps {
    name: string;
    value: string;
    onChange?: ((event: SelectChangeEvent<any>, child: React.ReactNode) => void);
    options: {
        value: any;
        label: string;
    }[];
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Selector = ({value, onChange, name, label, options} : SelectorProps & SelectProps) => {
    const theme = useTheme();
    console.log(value);
    console.log(!!value ? value : '');

    return (
      <FormControl fullWidth>
        <InputLabel id="task-type-select">{label}</InputLabel>
        <Select
          labelId="task-type-select"
          id="task-type-select"
          value={value}
          label={label}
          onChange={onChange}
          multiple={false}
          size="small"
          name={name}
          MenuProps={MenuProps}
        >
          {!!options && options.map((task) => (
            <MenuItem key={task.value} value={task.label} style={{
                fontWeight:theme.typography.fontWeightRegular}}>
              {task.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };
  
  export default Selector;