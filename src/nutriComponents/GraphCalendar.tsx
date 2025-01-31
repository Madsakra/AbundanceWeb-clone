import { IconButton } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Dayjs } from 'dayjs'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface GraphCalendarProps {
    handlePrevious:()=>void;
    graphDate:Dayjs|null;
    setGraphDate: React.Dispatch<React.SetStateAction<Dayjs | null>>;
    handleNext:()=>void
}

export default function GraphCalendar({handlePrevious,handleNext,graphDate,setGraphDate}:GraphCalendarProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex items-center justify-center bg-black text-white rounded-md gap-4">
        {/* Left button */}
        <IconButton onClick={handlePrevious} sx={{ color: "white"}}>
          <ChevronLeft />
        </IconButton>

        {/* Custom Date Picker */}
        <DatePicker
          value={graphDate}
          onChange={setGraphDate}
          disableFuture
          format="ddd, DD/MM/YY"
          slotProps={{
            textField: {
              InputProps: {
                sx: {
                  backgroundColor: "black",
                  color:"white",
                  "& .MuiSvgIcon-root": { 
                    color: "white"  // <-- This makes the calendar icon white
                    },
                  borderRadius: "6px",
                  "& input": { textAlign: "center", fontSize: "16px", fontWeight: "bold" },
                },
              },
            },
          }}
          sx={{
            "& .MuiInputBase-root": {
              
              textAlign: "center",
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              fontWeight: "bold",
            },
          }}
        />

        {/* Right button */}
        <IconButton onClick={handleNext} sx={{ color: "white"}}>
          <ChevronRight />
        </IconButton>
      </div>
    </LocalizationProvider>
  )
}
