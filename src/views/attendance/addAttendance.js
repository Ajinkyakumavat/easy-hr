import React, { useState, useEffect, useContext } from 'react';
// material ui import
import { Alert, Button, FormControl, InputLabel, MenuItem, Select, Snackbar, Typography } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import BasicSwitch from 'ui-component/switch';
import AttendanceTopbar, { AttendanceTopbar1 } from 'ui-component/attendence-topbar';
import { StyledContainer, StyledMainCard, StyledTable, StyledTableRow, StyledTableCell } from 'ui-component/tables/tablestyle';
import Pagination from '@mui/material/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { myEmployee } from 'store/actions/employeeAction';
import formatDate from 'utils/date-format';
import { clearErrors } from 'store/actions/userActions';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { AuthContextProvider } from 'authContext/AuthContext';
import { updateAllowances } from 'store/actions/attendenceAction';
import { toast } from 'react-toastify';

// ==============================|| ADD ATTENDENCE PAGE ||============================== //

const UploadButton = styled(Button)(({ theme }) => ({
    background: '#009FBE',
    color: 'white',
    borderRadius: '35px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50px',
    width: '220px'
}));

const AddAttendance = () => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [disabled, setDisabled] = useState(false);
    const { error, orders } = useSelector((state) => state.myEmployee);
    const [date, setDate] = useState([new Date(), new Date()]);
    const [csvtype, setcsvtype] = useState(1);
    const [keyword, setKeyword] = React.useState('');
    const [alowances, setAllownces] = React.useState([])
    const { state1 } = useContext(AuthContextProvider)



    const [largestPage, setLargestPage] = useState(0);
    const [selectToday, setSelectToday] = useState(false);
    //console.log(orders);

    const [successes, setsuccess] = useState('success');
    const [text, settext] = useState('Successfully Added!');
    const [state, setState] = React.useState({
        open: false,
        vertical: 'top',
        horizontal: 'center'
    });
    const { vertical, horizontal, open } = state;

    const handleClose = () => {
        setState({ ...state, open: false });
    };

   

    const [selectFile, setselectFile] = useState(null);

    const onFileChange = (event) => {
        // Update the state
        setselectFile(event.target.files[0]);
    };

    const onFileUpload = () => {
        // Create an object of formData
        const csvData = new FormData();
        csvData.append('file', selectFile);
        // Request made to the backend api
        // Send formData object
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                withCredentials: true
            }
        };
        //console.log(selectFile);
        if (csvtype === 1) {
            axios
                .post('http://localhost:4000/api/v1/employee/attendance/csv', csvData, config)
                .then((res) => {
                    //console.log(res);
                    settext('File upload successfully!');
                    setsuccess('success');
                    setState({
                        open: true,
                        ...{
                            vertical: 'top',
                            horizontal: 'right'
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                    settext('Error!');
                    setsuccess('error');
                    setState({
                        open: true,
                        ...{
                            vertical: 'top',
                            horizontal: 'right'
                        }
                    });
                });
        }

        if (csvtype === 2) {
            axios
                .post('http://localhost:4000/api/v1/employee/attendance/csvbulk', csvData, config)
                .then((res) => {
                    console.log("res", res.data);
                    settext('File upload successfully!');
                    setsuccess('success');
                    // setAllownces(res.data.DATA)
                    toast.success('Allowance updated successfully');

                    res.data.DATA.map((i) => (
                        axios.post(` http://localhost:4000/api/v1/employee/extra`,
                            {
                               
                               extraMachineWork:i?.['Extra Machine Work'],
                                overTime:i?.['OT Hours'],
                                totalPresent:i?.['Present days'],
                                UAN: i?.aadhaar.slice(0,9),                                
                                attendanceMonth:i?.month,
                                attendanceYear: i?.year,
                            }).then((res) => {
                                console.log(res.data);
                                // toast.success('Allowance updated successfully');

                            }).catch((error) => {
                                console.log(error);
                                toast.error('Employee Attendance Not Found')
                            })
                    ))
                    setState({
                        open: true,
                        ...{
                            vertical: 'top',
                            horizontal: 'right'
                        }
                    });
                })  
                .catch((err) => {
                    console.log(err);
                    settext('Error!');
                    setsuccess('error');
                    setState({
                        open: true,
                        ...{
                            vertical: 'top',
                            horizontal: 'right'
                        }
                    });
                });
        }

        if (csvtype === 3) {
            axios
                .post('http://localhost:4000/api/v1/employee/attendance/csvbulk', csvData, config)
                .then((res) => {
                    console.log("res", res.data);
                    settext('File upload successfully!');
                    setsuccess('success');
                    // setAllownces(res.data.DATA)
                    toast.success('Allowance updated successfully');

                    res.data.DATA.map((i) => (
                        axios.post(` http://localhost:4000/api/v1/employee/allowances`,
                            {
                                data: [
                                    {
                                        category: "Advance",
                                        type: "recovery",
                                        value: i?.Advance
                                    },
                                    {
                                        category: "Loan",
                                        type: "recovery",
                                        value: i?.Loan
                                    },
                                    {
                                        category: "Canteen",
                                        type: "recovery",
                                        value: i?.Canteen
                                    },   
                                    {
                                        category: "Penalty",
                                        type: "recovery",
                                        value: i?.Penalty
                                    },    
                                    {
                                        category: "Incentive",
                                        type: "allowence",
                                        value: i?.Incentive
                                    },    
                                    {
                                        category: "Adv. Leave",
                                        type: "allowence",
                                        value: i?.Leave
                                    },    
                                    {
                                        category: "Compensation",
                                        type: "allowence",
                                        value: i?.Compensation
                                    },                             
                                   
                                ],                               
                                UAN: i?.aadhaar.slice(0,9),                                
                                attendanceMonth:i?.month,
                                attendanceYear: i?.year,
                            }).then((res) => {
                                console.log(res.data);
                                // toast.success('Allowance updated successfully');

                            }).catch((error) => {
                                console.log(error);
                                toast.error('Employee Attendance Not Found')
                            })
                    ))
                    setState({
                        open: true,
                        ...{
                            vertical: 'top',
                            horizontal: 'right'
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                    settext('Error!');
                    setsuccess('error');
                    setState({
                        open: true,
                        ...{
                            vertical: 'top',
                            horizontal: 'right'
                        }
                    });
                });
        }
    };

    useEffect(() => {
        dispatch(myEmployee(page, 10, keyword));
        if (error) {
            console.log(error);
            dispatch(clearErrors());
        }
    }, [dispatch, page, keyword]);

    const handleChange = (event, value) => {
        if (value > largestPage) {
            setLargestPage(value);
        }
        setPage(value);
    };
    const handleSwitch = (date, x) => {
        setDisabled(false);
        setDate(date);
        setSelectToday(x);
    };

    const handleCsvChange = (event) => {
        setcsvtype(event.target.value);
    };
    return (
        <StyledMainCard>
            {state1 === false ? (
                <AttendanceTopbar1
                    name="Add Attendance"
                    search="true"
                    date="true"
                    filter="true"
                    today="true"
                    isshow={1}
                    parentCallback2={handleSwitch}
                    setKeyword={setKeyword}
                />
            ) : (
                <AttendanceTopbar
                    name="Add Attendance"
                    search="true"
                    date="true"
                    filter="true"
                    today="true"
                    isshow={1}
                    parentCallback2={handleSwitch}
                    setKeyword={setKeyword}
                />
            )}

            <hr color="#fdfdfd" />
            <div style={{ float: 'right', display: 'flex' }}>
                <FormControl fullWidth style={{ marginRight: '30px' }}>
                    <InputLabel id="demo-simple-select-label">CSV type</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={csvtype}
                        label="Csv Type"
                        onChange={handleCsvChange}
                    >
                        <MenuItem value={1}>Regular attendance</MenuItem>
                        <MenuItem value={2}>Bulk attendance</MenuItem>
                        <MenuItem value={3}>Bulk upload Recovery&Allowances</MenuItem>
                    </Select>
                </FormControl>
                <label
                    htmlFor="form_input"
                    className="form_label"
                    style={{
                        border: '2px solid #009FBE',
                        borderRadius: '35px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '50px',
                        width: '400px',
                        marginRight: '10px'
                    }}
                >
                    <input
                        type="file"
                        onChange={onFileChange}
                        id="form_input"
                        className="form_input"
                        style={{ width: '10px', height: '10px', opacity: 0, visibility: 'hidden' }}
                    />

                    <FileUploadIcon className="form_icon" style={{ marginRight: '5px', color: '#000000' }} />
                    <span className="form_text" style={{ fontWeight: 400, fontSize: '18px', color: '#000000' }}>
                        Upload CSV File
                    </span>
                </label>
                <UploadButton onClick={onFileUpload} type="submit">
                    Upload!
                </UploadButton>
            </div>
            <Typography variant="body2">
                <StyledContainer>
                    <StyledTable sx={{ minWidth: 650 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">#</StyledTableCell>
                                <StyledTableCell align="center">UAN</StyledTableCell>
                                <StyledTableCell align="center">Name</StyledTableCell>
                                <StyledTableCell align="center">Joining Date</StyledTableCell>
                                <StyledTableCell align="center">Contact</StyledTableCell>
                                <StyledTableCell align="center">Designation</StyledTableCell>
                                <StyledTableCell align="center">Mode of wages</StyledTableCell>
                                <StyledTableCell align="center">Mark Attendance</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders?.employees?.map((item, index) => (
                                <StyledTableRow
                                    key={(page - 1) * 10 + index + 1}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="center" component="th" scope="row">
                                        {(page - 1) * 10 + index + 1}
                                    </TableCell>
                                    <TableCell align="center">{item?.companyDetails?.UAN}</TableCell>
                                    <TableCell align="center">{item?.personalDetails?.fullName}</TableCell>
                                    <TableCell align="center">{formatDate(item?.companyDetails?.joiningDate)}</TableCell>
                                    <TableCell align="center">{item?.personalDetails?.mobileNo}</TableCell>
                                    <TableCell align="center">{item?.companyDetails?.designation}</TableCell>
                                    <TableCell align="center">{item?.companyDetails?.selectWages}</TableCell>
                                    <TableCell align="center">
                                        <BasicSwitch
                                            disabled={disabled}
                                            data={item}
                                            largest={largestPage}
                                            page={page}
                                            date={date}
                                            index={index}
                                            selectToday={selectToday}
                                        />
                                    </TableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </StyledTable>
                    <Pagination
                        count={Math.floor(orders?.employeeCount / 10) + 1}
                        color="primary"
                        style={{ float: 'right' }}
                        page={page}
                        onChange={handleChange}
                    />
                </StyledContainer>
            </Typography>
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                onClose={handleClose}
                autoHideDuration={3000}
                key={vertical + horizontal}
            >
                <Alert onClose={handleClose} severity={successes} sx={{ width: '100%' }}>
                    {text}
                </Alert>
            </Snackbar>
        </StyledMainCard>
    );
};
export default AddAttendance;
