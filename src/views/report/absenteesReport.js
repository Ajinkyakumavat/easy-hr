import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { myEmployee, clearErrors } from '../../store/actions/employeeAction';

// material ui import
import { Box, Typography } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AttendanceTopbar from 'ui-component/attendence-topbar';
import { StyledContainer, StyledTable, StyledTableRow, StyledTableCell, StyledMainCardSalary } from 'ui-component/tables/tablestyle';
import Pagination from '@mui/material/Pagination';
import EmployeeSidepanel from 'ui-component/payment/employeeSidePanel';
import axios from 'axios';
import { getCompany } from 'store/actions/companyAction';
import jsPDF from 'jspdf';
import { addAttendence } from 'store/actions/attendenceAction';



// ==============================|| VIEW ATTENDENCE PAGE ||============================== //
function reportDownload() {
    const pdfTable = document.getElementById('capture');
    /* eslint-disable new-cap */
    const pdf = new jsPDF({ unit: 'px', format: 'a4', userUnit: 'px' });
    pdf.html(pdfTable, { html2canvas: { scale: 0.65 } }).then(() => {
        pdf.save('absent_report.pdf');
    });
}
const AbsenteesReport = () => {
    const [page, setPage] = React.useState(1);
    const [date, setdate] = React.useState(new Date());
    const [employeeAttendance, setemployeeAttendance] = React.useState([]);
    const [pdfData, setpdfData] = React.useState([]);
    const [isFilter, setIsFilter] = React.useState("All");
    const [isChanged, setIsChanged] = React.useState(false);
    const [keyword, setKeyword] = React.useState('');

    const { error, orders } = useSelector((state) => state.myEmployee);
    const companys = useSelector((state) => state.myCompany);

    console.log("companys", companys)



    const dispatch = useDispatch();

    React.useEffect(() => {
        axios
            .get(
                `http://localhost:4000/api/v1/employee/attendance/mylist/${date.getMonth() + 1}/${date.getFullYear()}?limit=${9999999999}`,
                {
                    withCredentials: true
                }
            )
            .then((data) => {
                setemployeeAttendance(data.data.employeesAttendance);
                console.log(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [date, page, isChanged]);

    React.useEffect(() => {
        dispatch(myEmployee(page,10,keyword));
        dispatch(getCompany());

        if (error) {
            console.log(error);
            dispatch(clearErrors());
        }
    }, [dispatch, page,keyword]);

    React.useEffect(() => {
        const func = async () => {
            const { data } = await axios.get(`http://localhost:4000/api/v1/employees/mylist?page=${page}&limit=${99999999}${
                keyword ? '&keyword=' + keyword : ''
            }&searchBy=${'personalDetails.fullName,companyDetails.aadhaarNo'}`, {
                withCredentials: true
            });
            setpdfData(data);
        };
        func();
    }, [keyword]);

    const handleChange = (event, value) => {
        setPage(value);
    };

    const handleDate = (date) => {
        setdate(date);
    };

    const getAttendence = (employee) => {


        let x = employeeAttendance.findIndex(item => item?.employee == employee) > -1 && employeeAttendance?.filter((item) => item?.employee == employee)[0]?.employeeAttendance?.filter((item) => item.date == date?.getDate()).length > 0 ? employeeAttendance?.filter((item) => item?.employee == employee)[0]?.employeeAttendance?.filter((item) => item.date == date?.getDate())[0] : {};
        console.log(x);

        return x;
    };



    return (
        <>
            <StyledMainCardSalary>
                <AttendanceTopbar setKeyword={setKeyword} name="Absentees Report" parentCallback2={handleDate} search="true" parentCallback={setIsFilter} parentCallback6={reportDownload} date="true" weeklyOff="true" />
                <Typography variant="body2">
                    <StyledContainer component={Paper}>
                        <StyledTable sx={{ minWidth: 650 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">#</StyledTableCell>
                                    <StyledTableCell align="center">UAN</StyledTableCell>
                                    <StyledTableCell align="center">Name</StyledTableCell>
                                    <StyledTableCell align="center">Father's Name</StyledTableCell>
                                    <StyledTableCell align="center">Designation</StyledTableCell>
                                    <StyledTableCell align="center">Shift</StyledTableCell>
                                    <StyledTableCell align="center">Action</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pdfData?.employees?.filter((item) => getAttendence(item?._id)?.attendance == false && (getAttendence(item?._id)?.leave == "Leave without Permission" || getAttendence(item?._id)?.leave == ""))?.filter((item, index) => index >= (page * 10) - 10 && index < (page * 10))?.map((row, index) => {
                                    const x = getAttendence(row?._id);

                                    return (

                                        <StyledTableRow
                                            key={(page - 1) * 10 + index + 1}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="center" component="th" scope="row">
                                                {(page - 1) * 10 + index + 1}
                                            </TableCell>
                                            <TableCell align="center">{row?.companyDetails?.UAN}</TableCell>
                                            <TableCell align="center">{row?.personalDetails?.fullName}</TableCell>
                                            <TableCell align="center">{row?.personalDetails?.fatherName}</TableCell>
                                            <TableCell align="center">{row?.companyDetails?.designation}</TableCell>
                                            <TableCell align="center">{x?.shift}</TableCell>
                                            <TableCell align="center">

                                                <select style={{ padding: '10px 20px', marginRight: '10px', marginBottom: '10px' }} onBlur={(e) => {
                                                    dispatch(
                                                        addAttendence({
                                                            UAN: row?.companyDetails?.aadhaarNo,
                                                            fullName: row?.personalDetails?.fullName,
                                                            mobileNo: row?.personalDetails?.mobileNo,
                                                            joiningDate: row?.companyDetails?.joiningDate,
                                                            designation: row?.companyDetails?.designation,
                                                            dailyWages: row?.companyDetails?.dailyWages,
                                                            employeeAttendance: { date: date?.getDate(), attendance: x.attendance, leave: e.target.value },
                                                            attendanceMonth: date?.getMonth() + 1,
                                                            attendanceYear: date?.getFullYear(),
                                                            /* eslint no-underscore-dangle: 0 */
                                                            employee: row?._id
                                                        })
                                                    );
                                                    setIsChanged(!isChanged);
                                                }}>
                                                    <option value="">Choose Leave</option>
                                                    <option value="Paid Leave">Paid Leave</option>
                                                    <option value="Casual Leave">Casual Leave</option>
                                                    <option value="Sick Leave">Sick Leave</option>
                                                    <option value="Paid Holiday">Paid Holiday</option>
                                                    <option value="Paid Weekly Off">Paid Weekly Off</option>
                                                    <option value="Unpaid Weekly Off">Unpaid Weekly Off</option>
                                                    <option value="Leave with Permission">Leave with Permission</option>
                                                    <option value="Leave without Permission">Leave without Permission</option>
                                                    <option value="Accident Leave">Accident Leave</option>
                                                    <option value="Maternity Leave">Maternity Leave</option>
                                                </select>
                                            </TableCell>
                                        </StyledTableRow>
                                    )


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

            </StyledMainCardSalary>


            <div style={{ display: 'none' }}>
                <table id="capture" style={{ textAlign: 'center', width: '100%', borderCollapse: 'collapse', margin: "10px" }} width="100%">
                    <thead>
                        <tr>
                            <td style={{ border: '1px solid black', textAlign: 'center', borderCollapse: 'collapse', padding: '5px' }} colSpan="11">
                                {companys?.orders?.user?.companyName}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid black', textAlign: 'center', borderCollapse: 'collapse', padding: '5px' }} colSpan="11">
                                Persons Absent
                            </td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid black', textAlign: 'left', borderCollapse: 'collapse', padding: '5px' }} colSpan="11">
                                Date: {date.getDate() + "/" + parseInt(date.getMonth() + 1) + "/" + date.getFullYear()}
                            </td>
                        </tr>
                        <tr>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }} >Sr No</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }} >Employee Id</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }} >Name</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }} >Father's Name</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }} >Department</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }} >Designation</th>

                        </tr>

                    </thead>
                    <tbody>
                        {pdfData?.employees?.filter((item) => getAttendence(item?._id)?.attendance == false && (getAttendence(item?._id)?.leave == "Leave without Permission" || getAttendence(item?._id)?.leave == ""))?.map((row, index) => {
                            const x = getAttendence(row?._id);
                            return (
                                <tr>
                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>

                                        {index + 1}
                                    </td>
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

                                        {/* {row?.companyDetails?.shift} */}
                                    </td>
                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>

                                        {row?.companyDetails?.designation}

                                    </td>


                                </tr>
                            )
                        })
                        }
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default AbsenteesReport;
