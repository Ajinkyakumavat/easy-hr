import React, { useState, useEffect } from 'react';
// material ui import
import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, Snackbar, Typography } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import BasicSwitch from 'ui-component/switch';
import AttendanceTopbar from 'ui-component/attendence-topbar';
import { StyledContainer, StyledMainCard, StyledTable, StyledTableRow, StyledTableCell } from 'ui-component/tables/tablestyle';
import Pagination from '@mui/material/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { myEmployee, updateEmployee } from 'store/actions/employeeAction';
import formatDate from 'utils/date-format';
import { clearErrors } from 'store/actions/userActions';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { getCompany } from 'store/actions/companyAction';
import moment from 'moment';
import { addAttendence } from 'store/actions/attendenceAction';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';

// ==============================|| VIEW ATTENDENCE PAGE ||============================== //
function reportDownload() {
    const pdfTable = document.getElementById('capture');
    /* eslint-disable new-cap */
    const pdf = new jsPDF({ unit: 'px', format: 'a4', userUnit: 'px' });
    pdf.html(pdfTable, { html2canvas: { scale: 0.54 } }).then(() => {
        pdf.save('shift_report.pdf');
    });
}
// ==============================|| ADD ATTENDANCE PAGE ||============================== //

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

const ManageShift = () => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [disabled, setDisabled] = useState(true);
    const { error, orders, isUpdated } = useSelector((state) => state.myEmployee);
    const [employeeAttendance, setemployeeAttendance] = React.useState([]);
    const [date, setDate] = useState(new Date());
    const [isChanged, setIsChanged] = useState(false);
    const [largestPage, setLargestPage] = useState(0);
    const [selectToday, setSelectToday] = useState(false);
    //console.log(orders);
    const [keyword, setKeyword] = React.useState('');

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
    const [pdfData, setpdfData] = React.useState([]);

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
        axios
            .post('http://52.86.15.74:4000/api/v1/employee/shift/csv', csvData, config)
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
    };

    const companys = useSelector((state) => state.myCompany);
    //console.log(companys)

    useEffect(() => {
        dispatch(myEmployee(page,10,keyword));
        dispatch(getCompany());

        if (error) {
            console.log(error);
            dispatch(clearErrors());
        }
    }, [dispatch, page, isUpdated,keyword]);

    const handleChange = (event, value) => {
        if (value > largestPage) {
            setLargestPage(value);
        }
        setPage(value);
    };
    const handleSwitch = (date) => {
        setDate(date);
    };

    React.useEffect(() => {
        axios
            .get(
                `http://52.86.15.74:4000/api/v1/employee/attendance/mylist/${date.getMonth() + 1}/${date.getFullYear()}?limit=${9999999999}`,
                {
                    withCredentials: true
                }
            )
            .then((data) => {
                setemployeeAttendance(data.data.employeesAttendance);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [date, page, isChanged]);

    React.useEffect(() => {
        const func = async () => {
            const { data } = await axios.get(`http://52.86.15.74:4000/api/v1/employees/mylist?page=${page}&limit=${99999999}`, {
                withCredentials: true
            });
            setpdfData(data);
        };
        func();
    }, []);

    const getAttendence = (employee) => {
        let x =
            employeeAttendance.findIndex((item) => item?.employee == employee) > -1 &&
            employeeAttendance
                ?.filter((item) => item?.employee == employee)[0]
                ?.employeeAttendance?.filter((item) => item.date == date?.getDate()).length > 0
                ? employeeAttendance
                      ?.filter((item) => item?.employee == employee)[0]
                      ?.employeeAttendance?.filter((item) => item.date == date?.getDate())[0]
                : {};

        return x;
    };

    return (
        <>
            <StyledMainCard>
                <AttendanceTopbar
                    name="Manage Shift"
                    search="true"
                    date="true"
                    weeklyOff="true"
                    parentCallback2={handleSwitch}
                    parentCallback6={reportDownload}
                    setKeyword={setKeyword}
                />
                <hr color="#fdfdfd" />
                <div style={{ float: 'right', display: 'flex' }}>
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
                            Upload Monthly Shift File
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
                                    <StyledTableCell align="center">Contact</StyledTableCell>
                                    <StyledTableCell align="center">Designation</StyledTableCell>
                                    <StyledTableCell align="center">Mode of wages</StyledTableCell>
                                    <StyledTableCell align="center">Current Shift</StyledTableCell>
                                    <StyledTableCell align="center">Action</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders?.employees?.map((item, index) => {
                                    const x = getAttendence(item?._id);
                                    return (
                                        <StyledTableRow
                                            key={(page - 1) * 10 + index + 1}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="center" component="th" scope="row">
                                                {(page - 1) * 10 + index + 1}
                                            </TableCell>
                                            <TableCell align="center">{item?.companyDetails?.UAN}</TableCell>
                                            <TableCell align="center">{item?.personalDetails?.fullName}</TableCell>
                                            <TableCell align="center">{item?.personalDetails?.mobileNo}</TableCell>
                                            <TableCell align="center">{item?.companyDetails?.designation}</TableCell>
                                            <TableCell align="center">{item?.companyDetails?.selectWages}</TableCell>
                                            <TableCell align="center">{x?.shift}</TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ minWidth: 120 }}>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="demo-simple-select-label">Select Action</InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            label="Select Action"
                                                            onChange={(e) => {
                                                                if (x.attendance != undefined || x.attendance != null) {
                                                                    dispatch(
                                                                        addAttendence({
                                                                            UAN: item?.companyDetails?.aadhaarNo,
                                                                            fullName: item?.personalDetails?.fullName,
                                                                            mobileNo: item?.personalDetails?.mobileNo,
                                                                            joiningDate: item?.companyDetails?.joiningDate,
                                                                            designation: item?.companyDetails?.designation,
                                                                            dailyWages: item?.companyDetails?.dailyWages,
                                                                            employeeAttendance: {
                                                                                date: date?.getDate(),
                                                                                attendance: x.attendance,
                                                                                shift: e.target.value
                                                                            },
                                                                            attendanceMonth: date?.getMonth() + 1,
                                                                            attendanceYear: date?.getFullYear(),
                                                                            /* eslint no-underscore-dangle: 0 */
                                                                            employee: item?._id
                                                                        })
                                                                    );
                                                                    setIsChanged(!isChanged);
                                                                } else {
                                                                    toast.error('No Shift present to update');
                                                                }
                                                            }}
                                                        >
                                                            {companys &&
                                                                companys?.orders &&
                                                                companys?.orders?.user?.shift?.map((items, index) => {
                                                                    return (
                                                                        <MenuItem value={items?.shiftName}>
                                                                            {items?.shiftName} (
                                                                            {moment(new Date(items?.companyInTime)).format('HH:mm A')} to{' '}
                                                                            {moment(new Date(items?.companyOutTime)).format('HH:mm A')})
                                                                        </MenuItem>
                                                                    );
                                                                })}
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                            </TableCell>
                                        </StyledTableRow>
                                    );
                                })}
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

            <div style={{ display: 'none' }}>
                <table id="capture" style={{ textAlign: 'center', width: '100%', borderCollapse: 'collapse', margin: '10px' }} width="100%">
                    <thead>
                        <tr>
                            <td
                                style={{ border: '1px solid black', textAlign: 'center', borderCollapse: 'collapse', padding: '5px' }}
                                colSpan="12"
                            >
                                {companys?.orders?.user?.companyName}
                            </td>
                        </tr>
                        <tr>
                            <td
                                style={{ border: '1px solid black', textAlign: 'center', borderCollapse: 'collapse', padding: '5px' }}
                                colSpan="12"
                            >
                                Attendance of the Day
                            </td>
                        </tr>
                        <tr>
                            <td
                                style={{ border: '1px solid black', textAlign: 'left', borderCollapse: 'collapse', padding: '5px' }}
                                colSpan="12"
                            >
                                Date: {date.getDate() + '/' + parseInt(date.getMonth() + 1) + '/' + date.getFullYear()}
                            </td>
                        </tr>
                        <tr>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }} rowSpan="2">
                                Sr No
                            </th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }} rowSpan="2">
                                Employee Id
                            </th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }} rowSpan="2">
                                Name
                            </th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }} rowSpan="2">
                                Father's Name
                            </th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }} rowSpan="2">
                                Department
                            </th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }} rowSpan="2">
                                Designation
                            </th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }} colSpan="2">
                                Scheduled Duty
                            </th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }} colSpan="2">
                                Actual Duty
                            </th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }} rowSpan="2">
                                Remarks
                            </th>
                        </tr>
                        <tr>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>From</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>To</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>From</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>To</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pdfData?.employees?.map((row, index) => {
                            const x = getAttendence(row?._id);
                            return (
                                <tr>
                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>{index + 1}</td>
                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>
                                        {row?.companyDetails?.aadhaarNo}
                                    </td>
                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>
                                        {row?.personalDetails?.fullName}
                                    </td>
                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>
                                        {row?.personalDetails?.fatherName}
                                    </td>
                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>
                                        {/* {x?.shift} */}
                                    </td>
                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>
                                        {row?.companyDetails?.designation}
                                    </td>
                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>
                                        {x?.checkIn ? moment(new Date(x?.checkIn)).format('HH:mm A') : '-'}
                                    </td>
                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>
                                        {x?.checkOut ? moment(new Date(x?.checkOut)).format('HH:mm A') : '-'}
                                    </td>
                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>
                                        {companys?.orders?.user?.shift.filter((items) => items.shiftName == x?.shift)?.length > 0 &&
                                            moment(
                                                new Date(
                                                    companys?.orders?.user?.shift.filter(
                                                        (items) => items.shiftName == x?.shift
                                                    )[0].companyInTime
                                                )
                                            ).format('HH:mm A')}
                                    </td>
                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>
                                        {companys?.orders?.user?.shift.filter((items) => items.shiftName == x?.shift)?.length > 0 &&
                                            moment(
                                                new Date(
                                                    companys?.orders?.user?.shift.filter(
                                                        (items) => items.shiftName == x?.shift
                                                    )[0].companyOutTime
                                                )
                                            ).format('HH:mm A')}
                                    </td>

                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
};
export default ManageShift;
