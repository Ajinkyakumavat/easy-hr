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
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import { getCompany } from 'store/actions/companyAction';
import jsPDF from 'jspdf';

// ==============================|| VIEW ATTENDENCE PAGE ||============================== //
function reportDownload() {
    const pdfTable = document.getElementById('capture');
    /* eslint-disable new-cap */
    const pdf = new jsPDF({ unit: 'px', format: 'a4', userUnit: 'px' });
    pdf.html(pdfTable, { html2canvas: { scale: 0.65 } }).then(() => {
        pdf.save('leave_report.pdf');
    });
}

const LeaveReport = () => {
    const [page, setPage] = React.useState(1);
    const [date, setdate] = React.useState(new Date());
    const [employeeAttendance, setemployeeAttendance] = React.useState([]);
    const [pdfData, setpdfData] = React.useState([]);
    const [isFilter, setIsFilter] = React.useState('All');

    const { error, orders } = useSelector((state) => state.myEmployee);
    const companys = useSelector((state) => state.myCompany);

    console.log('companys', companys);
    const [keyword, setKeyword] = React.useState('');

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
        dispatch(myEmployee(page, 10, keyword));
        dispatch(getCompany());

        if (error) {
            console.log(error);
            dispatch(clearErrors());
        }
    }, [dispatch, page, keyword]);

    React.useEffect(() => {
        const func = async () => {
            const { data } = await axios.get(
                `http://52.86.15.74:4000/api/v1/employees/mylist?page=${page}&limit=${99999999}${
                    keyword ? '&keyword=' + keyword : ''
                }&searchBy=${'personalDetails.fullName,companyDetails.aadhaarNo'}`,
                {
                    withCredentials: true
                }
            );
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
        let x =
            employeeAttendance.findIndex((item) => item?.employee == employee) > -1 &&
            employeeAttendance
                ?.filter((item) => item?.employee == employee)[0]
                ?.employeeAttendance?.filter((item) => item.date == date?.getDate()).length > 0
                ? employeeAttendance
                      ?.filter((item) => item?.employee == employee)[0]
                      ?.employeeAttendance?.filter((item) => item.date == date?.getDate())[0]
                : {};
        console.log(x);

        return x;
    };

    return (
        <>
            <StyledMainCardSalary>
                <AttendanceTopbar
                    setKeyword={setKeyword}
                    name="Leave Report"
                    parentCallback={setIsFilter}
                    parentCallback6={reportDownload}
                    parentCallback2={handleDate}
                    search="true"
                    date="true"
                    leaveFilter="true"
                    weeklyOff="true"
                />
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
                                    <StyledTableCell align="center">Leave Type</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isFilter == 'All'
                                    ? pdfData?.employees
                                          ?.filter(
                                              (item) =>
                                                  getAttendence(item?._id)?.attendance == false && getAttendence(item?._id)?.leave != ''
                                          )
                                          ?.filter((item, index) => index >= page * 10 - 10 && index < page * 10)
                                          ?.map((row, index) => {
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
                                                      <TableCell align="center">{x?.leave}</TableCell>
                                                  </StyledTableRow>
                                              );
                                          })
                                    : pdfData?.employees
                                          ?.filter(
                                              (item) =>
                                                  getAttendence(item?._id)?.attendance == false &&
                                                  getAttendence(item?._id)?.leave == isFilter
                                          )
                                          ?.filter((item, index) => index >= page * 10 - 10 && index < page * 10)
                                          ?.map((row, index) => {
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
                                                      <TableCell align="center">{x?.leave}</TableCell>
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
            </StyledMainCardSalary>

            <div style={{ display: 'none' }}>
                <table id="capture" style={{ textAlign: 'center', width: '100%', borderCollapse: 'collapse', margin: '10px' }} width="100%">
                    <thead>
                        <tr>
                            <td
                                style={{ border: '1px solid black', textAlign: 'center', borderCollapse: 'collapse', padding: '5px' }}
                                colSpan="11"
                            >
                                {companys?.orders?.user?.companyName}
                            </td>
                        </tr>
                        <tr>
                            <td
                                style={{ border: '1px solid black', textAlign: 'center', borderCollapse: 'collapse', padding: '5px' }}
                                colSpan="11"
                            >
                                Persons Leave
                            </td>
                        </tr>
                        <tr>
                            <td
                                style={{ border: '1px solid black', textAlign: 'left', borderCollapse: 'collapse', padding: '5px' }}
                                colSpan="11"
                            >
                                Date: {date.getDate() + '/' + parseInt(date.getMonth() + 1) + '/' + date.getFullYear()}
                            </td>
                        </tr>
                        <tr>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>Sr No</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>Employee Id</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>Name</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>Father's Name</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>Department</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>Designation</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>Leave Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isFilter == 'All'
                            ? pdfData?.employees
                                  ?.filter((item) => getAttendence(item?._id)?.attendance == false && getAttendence(item?._id)?.leave != '')
                                  ?.map((row, index) => {
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
                                                  {x.leave}
                                              </td>
                                          </tr>
                                      );
                                  })
                            : pdfData?.employees
                                  ?.filter(
                                      (item) => getAttendence(item?._id)?.attendance == false && getAttendence(item?._id)?.leave == isFilter
                                  )
                                  ?.map((row, index) => {
                                      const x = getAttendence(row?._id);
                                      return (
                                          <tr>
                                              <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>
                                                  {index + 1}
                                              </td>
                                              <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px' }}>
                                                  {row?._id}
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
                                                  {x.leave}
                                              </td>
                                          </tr>
                                      );
                                  })}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default LeaveReport;
