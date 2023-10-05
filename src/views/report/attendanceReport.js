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
import axios from 'axios';
import { getCompany } from 'store/actions/companyAction';
import moment from 'moment';
import jsPDF from 'jspdf';

// ==============================|| VIEW ATTENDENCE PAGE ||============================== //


function reportDownload() {
    const pdfTable = document.getElementById('capture');
    /* eslint-disable new-cap */
    const pdf = new jsPDF({ unit: 'px', format: 'a4', userUnit: 'px' });
    pdf.html(pdfTable, { html2canvas: { scale: 0.5 } }).then(() => {
        pdf.save('attandance_report.pdf');
    });
}

const AttendanceReport = () => {
    const [page, setPage] = React.useState(1);
    const [date, setdate] = React.useState(new Date());
    const [employeeAttendance, setemployeeAttendance] = React.useState([]);
    const [pdfData, setpdfData] = React.useState([]);
    const [keyword, setKeyword] = React.useState('');


    const { error, orders } = useSelector((state) => state.myEmployee);
    const companys = useSelector((state) => state.myCompany);

    console.log("companys", companys)



    const dispatch = useDispatch();

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
                console.log(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [date, page]);

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
            const { data } = await axios.get(`http://52.86.15.74:4000/api/v1/employees/mylist?page=${page}&limit=${99999999}`, {
                withCredentials: true
            });
            setpdfData(data);
        };
        func();
    }, []);

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
                <AttendanceTopbar name="Attendance Report" search="true" date="true" weeklyOff="true"
                    parentCallback2={handleDate} parentCallback6={reportDownload}
                    setKeyword={setKeyword}
                />
                <Typography variant="body2">
                    <StyledContainer component={Paper}>
                        <StyledTable sx={{ minWidth: 650 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">#</StyledTableCell>
                                    <StyledTableCell align="center">UAN</StyledTableCell>
                                    <StyledTableCell align="center">Name</StyledTableCell>
                                    <StyledTableCell align="center">Shift</StyledTableCell>
                                    <StyledTableCell align="center">Scheduled Duty From</StyledTableCell>
                                    <StyledTableCell align="center">Scheduled Duty To</StyledTableCell>
                                    <StyledTableCell align="center">Actual Duty From
                                    </StyledTableCell>
                                    <StyledTableCell align="center">Actual Duty To
                                    </StyledTableCell>

                                    <StyledTableCell align="center">Status</StyledTableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders?.employees?.map((row, index) => {
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
                                            <TableCell align="center">{x?.shift}</TableCell>
                                            <TableCell align="center">{x?.checkIn ? moment(new Date(x?.checkIn)).format("HH:mm A") : "-"}</TableCell>
                                            <TableCell align="center">{x?.checkOut ? moment(new Date(x?.checkOut)).format("HH:mm A") : "-"}</TableCell>
                                            <TableCell align="center">{companys?.orders?.user?.shift.filter((items) => items.shiftName == x?.shift)?.length > 0 && moment(new Date(companys?.orders?.user?.shift.filter((items) => items.shiftName == x?.shift)[0].companyInTime)).format("HH:mm A")}</TableCell>
                                            <TableCell align="center">{companys?.orders?.user?.shift.filter((items) => items.shiftName == x?.shift)?.length > 0 && moment(new Date(companys?.orders?.user?.shift.filter((items) => items.shiftName == x?.shift)[0].companyOutTime)).format("HH:mm A")}</TableCell>

                                            <TableCell align="center">{x?.attendance ? "Present" : x?.attendance == false && x?.leave == "" ? "Absent" : x.leave}</TableCell>
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
                            <td style={{ border: '1px solid black', textAlign: 'center', borderCollapse: 'collapse', padding: '5px' }} colSpan="12">
                                {companys?.orders?.user?.companyName}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid black', textAlign: 'center', borderCollapse: 'collapse', padding: '5px' }} colSpan="12">
                                Attendance of the Day
                            </td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid black', textAlign: 'left', borderCollapse: 'collapse', padding: '5px' }} colSpan="12">
                                Date: {date.getDate() + "/" + parseInt(date.getMonth() + 1) + "/" + date.getFullYear()}
                            </td>
                        </tr>
                        <tr>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }} rowSpan="2">Sr No</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }} rowSpan="2">Employee Id</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }} rowSpan="2">Name</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }} rowSpan="2">Father's Name</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }} rowSpan="2">Department</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }} rowSpan="2">Designation</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }} colSpan="2">Scheduled Duty
                            </th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }} colSpan="2">Actual Duty
                            </th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }} rowSpan="2">Status
                            </th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }} rowSpan="2">Remarks
                            </th>
                        </tr>
                        <tr>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>From
                            </th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>To
                            </th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>From
                            </th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>To
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {pdfData?.employees?.map((row, index) => {
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

                                        {/* {x?.shift} */}
                                    </td>
                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>

                                        {row?.companyDetails?.designation}

                                    </td>
                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>

                                        {x?.checkIn ? moment(new Date(x?.checkIn)).format("HH:mm A") : "-"}
                                    </td>
                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>

                                        {x?.checkOut ? moment(new Date(x?.checkOut)).format("HH:mm A") : "-"}
                                    </td>
                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>

                                        {companys?.orders?.user?.shift.filter((items) => items.shiftName == x?.shift)?.length > 0 && moment(new Date(companys?.orders?.user?.shift.filter((items) => items.shiftName == x?.shift)[0].companyInTime)).format("HH:mm A")}
                                    </td>
                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>

                                        {companys?.orders?.user?.shift.filter((items) => items.shiftName == x?.shift)?.length > 0 && moment(new Date(companys?.orders?.user?.shift.filter((items) => items.shiftName == x?.shift)[0].companyOutTime)).format("HH:mm A")}
                                    </td>

                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>

                                        {x?.attendance ? "Present" : x?.attendance == false && x?.leave == "" ? "Absent" : x.leave}

                                    </td>
                                    <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>


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

export default AttendanceReport;
