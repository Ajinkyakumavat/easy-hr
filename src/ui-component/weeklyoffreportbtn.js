import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './switch.css';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { addAttendence, myEmployeeAttendenceOvertime } from 'store/actions/attendenceAction';
import { toast } from 'react-toastify';

export default function WeeklyOff(props) {
    const { x, row, date, getAtt } = props;

    const dispatch = useDispatch();
    const [dateComp, setDateComp] = React.useState(new Date());
    const [isDateShow, setIsDateShow] = React.useState(false);



    return (
        <>
            <Box sx={{ minWidth: 120, display: "flex" }}>
                <FormControl fullWidth sx={{ mr: 3 }}>
                    <InputLabel id="demo-simple-select-label">Select Action</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Select Action"
                        onChange={(e) => {
                            if (e.target.value == "CO") {
                                setIsDateShow(true);
                            }
                            else {
                                dispatch(myEmployeeAttendenceOvertime(row?._id, date.getMonth() + 1, date.getFullYear(), new Date(x?.checkOut).getHours() - new Date(x?.checkIn).getHours(), date.getDate()));
                                setIsDateShow(false);

                            }
                        }}
                    >
                        <MenuItem value="OT">OT</MenuItem>
                        <MenuItem value="CO">Compensatory Off</MenuItem>
                    </Select>
                </FormControl>
                {isDateShow &&
                    <>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>

                            <DesktopDatePicker
                                label="Select Date"
                                inputFormat="MM/dd/yyyy"
                                value={dateComp}
                                onChange={(e) => {
                                    setDateComp(e)
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>

                        <Button onClick={() => {


                            if (getAtt(row?._id, dateComp?.getDate())?.attendance == false) {
                                dispatch(
                                    addAttendence({
                                        UAN: row?.companyDetails?.aadhaarNo,
                                        fullName: row?.personalDetails?.fullName,
                                        mobileNo: row?.personalDetails?.mobileNo,
                                        joiningDate: row?.companyDetails?.joiningDate,
                                        designation: row?.companyDetails?.designation,
                                        dailyWages: row?.companyDetails?.dailyWages,
                                        employeeAttendance: { date: dateComp?.getDate(), attendance: true, compansatoryOff: true },
                                        attendanceMonth: dateComp?.getMonth() + 1,
                                        attendanceYear: dateComp?.getFullYear(),
                                        /* eslint no-underscore-dangle: 0 */
                                        employee: row?._id
                                    })
                                );

                                dispatch(
                                    addAttendence({
                                        UAN: row?.companyDetails?.aadhaarNo,
                                        fullName: row?.personalDetails?.fullName,
                                        mobileNo: row?.personalDetails?.mobileNo,
                                        joiningDate: row?.companyDetails?.joiningDate,
                                        designation: row?.companyDetails?.designation,
                                        dailyWages: row?.companyDetails?.dailyWages,
                                        employeeAttendance: { date: date?.getDate(), scheduledTo: dateComp, overtime: 0, isOvertime: false },
                                        attendanceMonth: dateComp?.getMonth() + 1,
                                        attendanceYear: dateComp?.getFullYear(),
                                        /* eslint no-underscore-dangle: 0 */
                                        employee: row?._id
                                    })
                                );



                            }
                            else {
                                toast.warning("Employee is already present on that date")



                            }
                        }}>
                            Upload
                        </Button>
                    </>}



            </Box>
        </>
    );
}
