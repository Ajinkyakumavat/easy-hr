import * as React from 'react';
// Material ui import
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import SearchSection from 'layout/MainLayout/Header/SearchSection';
import { StyledContainer, StyledTableCell } from './tables/tablestyle';
import TextField from '@mui/material/TextField';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DateRangePicker } from '@mui/lab';
import {
    AbsenteesFilter,
    DownloadCsv,
    LeaveFormat, LeaveReportFilter,
    SalaryStatement,
    SalaryStatementFormat,
    WagesStatementFormat,
    WeeklyReportFormat
} from './utils/filterbutton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AttendanceTopbar(props) {
    const {
        name,
        date,
        csv,
        salary,
        weeklyOff,
        parentCallback,
        csvpage,
        setKeyword,
        parentCallback2,
        parentCallback3,
        parentCallback4,
        parentCallback5,
        parentCallback6,
        leave,
        isshow,
        today,
        salaryformat,
        search,
        csvdata,
        wagesformat,
        leaveFilter,
        downloadButton,
        absenteesFilter
    } = props;

    const [value, setValue] = React.useState(new Date());
    const [open, setOpen] = React.useState(false);
    const [disabled, setdisabled] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleChange = (newValue) => {
        console.log(newValue);
        setValue(newValue);
        handleClickOpen();
    };

    return (
        <StyledContainer component={Paper} sx={{ marginTop: -4 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="left">
                            <h2 style={{ fontWeight: 600, fontFamily: 'Poppins', fontSize: '22px' }}>{name}</h2>
                        </StyledTableCell>
                        {search === 'true' && (
                            <StyledTableCell align="center">
                                <SearchSection setKeyword={setKeyword} />
                            </StyledTableCell>
                        )}
                        {leaveFilter === 'true' && (
                            <StyledTableCell align="center">
                                <LeaveReportFilter parentCallback={parentCallback} />
                            </StyledTableCell>
                        )}
                        {absenteesFilter === 'true' && (
                            <StyledTableCell align="center">
                                <AbsenteesFilter parentCallback3={parentCallback} />
                            </StyledTableCell>
                        )}

                        {date === 'true' && (
                            <StyledTableCell align="center">
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    {isshow === 1 ? (
                                        <DesktopDatePicker
                                            label="Select Date"
                                            inputFormat="MM/dd/yyyy"
                                            value={value}
                                            disabled={disabled}
                                            onChange={handleChange}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                        // <DateRangePicker
                                        // startText="Start Date"
                                        // endText="End Date"
                                        // value={value}
                                        // disabled={disabled}
                                        // onChange={handleChange}
                                        // renderInput={(startProps, endProps) => (
                                        //     <React.Fragment>
                                        //         <TextField {...startProps} />
                                        //         <TextField {...endProps} />
                                        //     </React.Fragment>
                                        // )}
                                        // />

                                    ) : (
                                        // <DateRangePicker
                                        // startText="Start Date"
                                        // endText="End Date"
                                        // value={value}
                                        // disabled={disabled}
                                        // onChange={handleChange}
                                        // renderInput={(startProps, endProps) => (
                                        //     <React.Fragment>
                                        //         <TextField {...startProps} />
                                        //         <TextField {...endProps} />
                                        //     </React.Fragment>
                                        // )}
                                        // />

                                        <DesktopDatePicker
                                            label="Select Date"
                                            inputFormat="MM/dd/yyyy"
                                            value={value}
                                            onChange={handleChange}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    )}
                                </LocalizationProvider>
                            </StyledTableCell>
                        )}

                        {salaryformat === 'true' && (
                            <StyledTableCell align="center">
                                <SalaryStatementFormat parentCallback3={parentCallback3} />
                            </StyledTableCell>
                        )}
                        {wagesformat === 'true' && (
                            <StyledTableCell align="center">
                                <WagesStatementFormat parentCallback3={parentCallback4} />
                            </StyledTableCell>
                        )}
                        {salary === 'true' && (
                            <StyledTableCell align="center">
                                <SalaryStatement parentCallback={parentCallback} />
                            </StyledTableCell>
                        )}
                        {weeklyOff === 'true' && (
                            <StyledTableCell align="center">
                                <WeeklyReportFormat parentCallback3={parentCallback6} />
                            </StyledTableCell>
                        )}
                        {csv === 'true' && (
                            <StyledTableCell align="center">
                                <DownloadCsv tempdate={value} data={csvdata} page={csvpage} />
                            </StyledTableCell>
                        )}
                        {leave === 'true' && (
                            <StyledTableCell align="center">
                                <LeaveFormat parentCallback3={parentCallback5} name={downloadButton} />
                            </StyledTableCell>
                        )}
                        {today === 'true' && (
                            <StyledTableCell align="center">
                                <button
                                    type="button"
                                    className="gray-button"
                                    onClick={() => {
                                        parentCallback2(value, true);
                                        setdisabled(true);
                                    }}
                                >
                                    Today
                                </button>
                            </StyledTableCell>
                        )}
                    </TableRow>
                </TableHead>
            </Table>
            <Dialog open={open} keepMounted onClose={handleClose} aria-describedby="alert-dialog-slide-description">
                <DialogTitle>Confirm</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Are you confirm that you want to select this date?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            parentCallback2(value, false);
                            handleClose();
                            setdisabled(true);
                        }}
                    >
                        Yes
                    </Button>
                    <Button onClick={handleClose}>No</Button>
                </DialogActions>
            </Dialog>
        </StyledContainer>
    );
}

export  function AttendanceTopbar1(props) {
    const {
        name,
        date,
        csv,
        salary,
        weeklyOff,
        parentCallback,
        csvpage,
        setKeyword,
        parentCallback2,
        parentCallback3,
        parentCallback4,
        parentCallback5,
        parentCallback6,
        leave,
        isshow,
        today,
        salaryformat,
        search,
        csvdata,
        wagesformat,
        leaveFilter,
        downloadButton,
        absenteesFilter
    } = props;

    const [value, setValue] = React.useState([new Date(),new Date()]);
    const [open, setOpen] = React.useState(false);
    const [disabled, setdisabled] = React.useState(false);
    
    
    const handleClickOpen = () => {
        setOpen(true);
    };


    const handleClose = () => {
        setOpen(false);
    };

    const clickOnButton = () => {
        setValue([null, null])
    }

    const handleChange = (newValue) => {
        setValue(newValue);
        if(newValue[1]){
            handleClickOpen();

        }
    };

    return (
        <StyledContainer component={Paper} sx={{ marginTop: -4 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="left">
                            <h2 style={{ fontWeight: 600, fontFamily: 'Poppins', fontSize: '22px' }}>{name}</h2>
                        </StyledTableCell>
                        {search === 'true' && (
                            <StyledTableCell align="center">
                                <SearchSection setKeyword={setKeyword} />
                            </StyledTableCell>
                        )}
                        {leaveFilter === 'true' && (
                            <StyledTableCell align="center">
                                <LeaveReportFilter parentCallback={parentCallback} />
                            </StyledTableCell>
                        )}
                        {absenteesFilter === 'true' && (
                            <StyledTableCell align="center">
                                <AbsenteesFilter parentCallback3={parentCallback} />
                            </StyledTableCell>
                        )}

                        {date === 'true' && (
                            <StyledTableCell align="center">
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    {isshow === 1 ? (
                                        // <DesktopDatePicker
                                        //     label="Select Date"
                                        //     inputFormat="MM/dd/yyyy"
                                        //     value={value}
                                        //     disabled={disabled}
                                        //     onChange={handleChange}
                                        //     renderInput={(params) => <TextField {...params} />}
                                        // />
                                        <DateRangePicker
                                        startText="Start Date"
                                        endText="End Date"
                                        value={value}
                                        disabled={disabled}
                                        onChange={handleChange}
                                        renderInput={(startProps, endProps) => (
                                            <React.Fragment>
                                                <TextField {...startProps}  onClick={clickOnButton}/>
                                                <TextField {...endProps} />
                                            </React.Fragment>
                                        )}
                                        />

                                    ) : (
                                        <DateRangePicker
                                        startText="Start Date"
                                        endText="End Date"
                                        value={value}
                                        disabled={disabled}
                                        autoFocus={true}
                                        onChange={handleChange}
                                        renderInput={(startProps, endProps) => (
                                            <React.Fragment>
                                                <TextField {...startProps} />
                                                <TextField {...endProps} />
                                            </React.Fragment>
                                        )}
                                        />

                                        // <DesktopDatePicker
                                        //     label="Select Date"
                                        //     inputFormat="MM/dd/yyyy"
                                        //     value={value}
                                        //     onChange={handleChange}
                                        //     renderInput={(params) => <TextField {...params} />}
                                        // />
                                    )}
                                </LocalizationProvider>
                            </StyledTableCell>
                        )}

                        {salaryformat === 'true' && (
                            <StyledTableCell align="center">
                                <SalaryStatementFormat parentCallback3={parentCallback3} />
                            </StyledTableCell>
                        )}
                        {wagesformat === 'true' && (
                            <StyledTableCell align="center">
                                <WagesStatementFormat parentCallback3={parentCallback4} />
                            </StyledTableCell>
                        )}
                        {salary === 'true' && (
                            <StyledTableCell align="center">
                                <SalaryStatement parentCallback={parentCallback} />
                            </StyledTableCell>
                        )}
                        {weeklyOff === 'true' && (
                            <StyledTableCell align="center">
                                <WeeklyReportFormat parentCallback3={parentCallback6} />
                            </StyledTableCell>
                        )}
                        {csv === 'true' && (
                            <StyledTableCell align="center">
                                <DownloadCsv tempdate={value} data={csvdata} page={csvpage} />
                            </StyledTableCell>
                        )}
                        {leave === 'true' && (
                            <StyledTableCell align="center">
                                <LeaveFormat parentCallback3={parentCallback5} name={downloadButton} />
                            </StyledTableCell>
                        )}
                        {today === 'true' && (
                            <StyledTableCell align="center">
                                <button
                                    type="button"
                                    className="gray-button"
                                    onClick={() => {
                                        parentCallback2(value, true);
                                        setdisabled(true);
                                    }}
                                >
                                    Today
                                </button>
                            </StyledTableCell>
                        )}
                    </TableRow>
                </TableHead>
            </Table>
            <Dialog open={open} keepMounted onClose={handleClose} aria-describedby="alert-dialog-slide-description">
                <DialogTitle>Confirm</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Are you confirm that you want to select this date?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            parentCallback2(value, false);
                            handleClose();
                            setdisabled(true);
                        }}
                    >
                        Yes
                    </Button>
                    <Button onClick={handleClose}>No</Button>
                </DialogActions>
            </Dialog>
        </StyledContainer>
    );
}

