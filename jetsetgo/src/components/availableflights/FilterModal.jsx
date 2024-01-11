import React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import "./FilterModal.css";

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
};

function FilterModal({
  names,
  tagName,
  handleFilters,
  filteredOpts,
  filtering,
  handleOrder,
  sortorder,
  handleSortBy,
  sortby
}) {
  const handleChange = (event) => {
    if (!filtering) {
      handleSortBy(event.target.value);
      return;
    }
    const {
      target: { value },
    } = event;
    handleFilters(typeof value === "string" ? value.split(",") : value);
  };
  return (
    <div>
      {!filtering && (
        <FormControl>
          <FormLabel id="demo-row-radio-buttons-group-label">
            Order by
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            onChange={(e) => handleOrder(e.target.value)}
            // defaultValue={sortorder}
            value={sortorder}
          >
            <FormControlLabel
              value="low to high"
              control={<Radio />}
              label="Low to High"
            />
            <FormControlLabel
              value="high to low"
              control={<Radio />}
              label="High to Low"
            />
          </RadioGroup>
        </FormControl>
      )}
      <FormControl>
        <InputLabel id="demo-multiple-checkbox-label">{tagName}</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple={filtering}
          value={filtering ? filteredOpts : sortby}
          sx={{ width: 250 }}
          onChange={handleChange}
          input={<OutlinedInput label={tagName} />}
          renderValue={
            filtering ? (selected) => selected.join(", ") : undefined
          }
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name}>
              {filtering ? (
                <>
                  <Checkbox checked={filteredOpts.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </>
              ) : (
                name
              )}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default FilterModal;
