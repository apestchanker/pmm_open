import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { CheckboxOptions } from 'Types';
import { Grid } from '@mui/material';

export default function CheckboxList({
  options,
  checked,
  handleToggle,
}: {
  options: CheckboxOptions[];

  checked: any[];
  /* checked: number[];
  handleToggle: (i: number) => void; */
  handleToggle: (i: any) => void;
}) {
  return (
    <List sx={{ display: 'flex', flexWrap: 'wrap' }}>
      {options.map((val: CheckboxOptions, i: number) => {
        const labelId = `checkbox-list-label-${val.id}`;
        const isChecked = checked.some((checked) => checked === val.id);

        return (
          <Grid item xs={12} md={6} key={i}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleToggle(val.id)} dense>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={isChecked}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                    size="small"
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={val.name || val.type || val.id || ''} />
              </ListItemButton>
            </ListItem>
          </Grid>
        );
      })}
    </List>
  );
}
