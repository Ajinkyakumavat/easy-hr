import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
    StyledMainCardSalary,
} from "../../ui-component/tables/tablestyle";
import AttendanceTopbar from "../../ui-component/attendence-topbar";
import { Container, MenuItem } from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import { getCompany, updateCompany } from "../../store/actions/companyAction";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { TimePicker } from "@mui/lab";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import moment from 'moment'

const ColorButton = styled(Button)(({ theme }) => ({
    marginTop: '20px',
    color: 'white',
    fontFamily: 'Poppins',
    fontSize: '22px',
    width: '100%',
    backgroundColor: '#009FBE'
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default function VerticalTabs() {
    const [value, setValue] = useState(0);
    const [value1, setValue1] = useState(0);

    const [email, setEmail] = useState('');
    const [bonusPer, setBonusPer] = useState('');

    const [companyName, setCompanyName] = useState('');
    const [companyAdd, setCompanyAdd] = useState('');
    const [designation, setDesignation] = useState('');
    const [bonusMonth, setbonusMonth] = useState(new Date());
    const [companyInTime, setCompanyInTime] = useState(new Date());
    const [companyOutTime, setCompanyOutTime] = useState(new Date());
    const [companyInBufferTime, setCompanyInBufferTime] = useState(new Date());
    const [companyOutBufferTime, setCompanyOutBufferTime] = useState(new Date());
    const [shiftName, setShiftName] = useState("");
    const [wages, setWages] = useState([]);
    const [shift, setShift] = useState([]);
    
    const dispatch = useDispatch();
    const { error, orders } = useSelector((state) => state.myCompany);
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    // const [value, setValue] = React.useState(0);


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChange1 = (event, newValue) => {
        setValue1(newValue);
    };

    useEffect(() => {
        dispatch(getCompany());
    }, [dispatch]);

    useEffect(() => {
        setCompanyName(orders?.user?.companyName);
        setEmail(orders?.user?.wages[orders?.user?.wages?.length - 1]?.minimumWages);
        setBonusPer(orders?.user?.bonusPercentage);
        setbonusMonth(orders?.user?.wages[orders?.user?.wages?.length - 1]?.bonusFrom);
        setDesignation(orders?.user?.wages[orders?.user?.wages?.length - 1]?.designation);
        setWages(orders?.user?.wages);
        setCompanyAdd(orders?.user?.companyAddress);
        setShift(orders?.user?.shift);
    }, [orders]);

    const submitHandler = (e) => {
        e.preventDefault();
        const x = {};


        let y = shift;
        if (value == 1 && value1 == 0) {
            y.push({
                shiftName: shiftName,
                companyInTime: companyInTime,
                companyInBufferTime: companyInBufferTime,
                companyOutTime: companyOutTime,
                companyOutBufferTime: companyOutBufferTime
            })
        }

        let z = wages;


        if (value == 2) {
            z.push({
                minimumWages: email,
                bonusFrom: bonusMonth,
                designation: designation,
            })
        }

        x.companyName = companyName;
        x.minimumWages = email;
        x.bonusPercentage = bonusPer;
        x.bonusFrom = bonusMonth;
        x.companyAddress = companyAdd;
        x.designation = designation;
        x.shift = y;
        x.wages = z;

        //console.log(x);
        dispatch(updateCompany(x));
    };

    return (
        <StyledMainCardSalary>
            <AttendanceTopbar name="Profile Settings" />
            <hr style={{ color: "#f0f0f0" }} />
            <Box
                sx={{ flexGrow: 1, display: 'flex' }}
            >
                <Tabs
                    orientation="vertical"
                    value={value}
                    onChange={handleChange}
                    aria-label="Profile Settings"
                    sx={{ borderRight: 1, borderColor: 'divider', height: '500px' }}
                >
                    <Tab label="Company Setting" {...a11yProps(0)} />
                    <Tab label="Attendance Settings" {...a11yProps(1)} />
                    <Tab label="Bonus Settings" {...a11yProps(2)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <>
                        {user && (
                            <Container>
                                <form onSubmit={submitHandler} encType="multipart/form-data">
                                    <Grid container spacing={4} alignItems="center" justifyContent="center" style={{ marginTop: '5px' }}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                id="companyName"
                                                name="companyName"
                                                fullWidth
                                                variant="outlined"
                                                label="Company Name"
                                                value={companyName}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                id="companyEmail"
                                                name="companyEmail"
                                                fullWidth
                                                variant="outlined"
                                                label="Company Email"
                                                value={companyName}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            id="companyUserName"
                                            name="companyUserName"
                                            fullWidth
                                            variant="outlined"
                                            label="User Name"
                                            value={companyName}
                                        />
                                    </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                id="companyPhoneNo"
                                                name="companyPhoneNo"
                                                fullWidth
                                                variant="outlined"
                                                label="Phone Number"
                                                value={companyName}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <TextField
                                                required
                                                id="companyAdd"
                                                name="companyAdd"
                                                placeholder="Enter Company Address"
                                                fullWidth
                                                multiline
                                                rows={5}
                                                variant="outlined"
                                                label="Enter Company Addres"
                                                value={companyAdd}
                                                onChange={(e) => setCompanyAdd(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={5} sm={12}>
                                            <ColorButton variant="contained" type="submit">
                                                Update Company Profile
                                            </ColorButton>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Container>
                        )}
                    </>
                </TabPanel>

                <TabPanel value={value} index={1}>
                    {user && (
                        <>


                            <Container>

                                {/* <Tabs
                                    value={value1}
                                    onChange={handleChange1}
                                    aria-label="Profile Settings"
                                    sx={{ borderColor: 'divider', width: "100%" }}
                                >
                                    <Tab label="Add Shift" {...a11yProps(0)} sx={{ width: "100%" }} />
                                    <Tab label="Update Shift" {...a11yProps(1)} sx={{ width: "100%" }} />
                                </Tabs> */}
                                {/* <TabPanel value={value1} index={0}> */}

                                <form onSubmit={submitHandler} encType="multipart/form-data">
                                    <Grid container spacing={4} alignItems="center" justifyContent="center">
                                        <Grid item xs={12} sm={12}>
                                            <TextField
                                                id="shiftName"
                                                name="shiftName"
                                                placeholder="Enter Shift Type"
                                                value={shiftName}
                                                label="Enter Shift Type"
                                                variant="outlined"
                                                fullWidth
                                                onChange={(e) => setShiftName(e.target.value)}
                                                type="text"

                                            />

                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <Typography variant="h3" gutterBottom>
                                                Check-In Time
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={6} sm={6}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <TimePicker
                                                    label="Set Check-In Time"
                                                    fullwidth
                                                    value={companyInTime}
                                                    onChange={(newValue) => {
                                                        setCompanyInTime(newValue);
                                                    }}
                                                    renderInput={(params) => <TextField {...params} />}
                                                />
                                            </LocalizationProvider>
                                        </Grid>

                                        <Grid item xs={6} sm={6}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <TimePicker
                                                    label="Set Check-In Buffer Time"
                                                    value={companyInBufferTime}
                                                    fullwidth
                                                    onChange={(newValue) => {
                                                        setCompanyInBufferTime(newValue);
                                                    }}
                                                    renderInput={(params) => <TextField {...params} />}
                                                />
                                            </LocalizationProvider>
                                        </Grid>

                                        <Grid item xs={12} sm={12}>
                                            <Typography variant="h3" gutterBottom>
                                                Check-Out Time
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={6} sm={6}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <TimePicker
                                                    label="Set Check-Out Time"
                                                    value={companyOutTime}
                                                    fullwidth
                                                    onChange={(newValue) => {
                                                        setCompanyOutTime(newValue);
                                                    }}
                                                    renderInput={(params) => <TextField {...params} />}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item xs={6} sm={6}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <TimePicker
                                                    label="Set Check-Out Buffer Time"
                                                    value={companyOutBufferTime}
                                                    fullwidth
                                                    onChange={(newValue) => {
                                                        setCompanyOutBufferTime(newValue);
                                                    }}
                                                    renderInput={(params) => <TextField {...params} />}
                                                />
                                            </LocalizationProvider>
                                        </Grid>

                                        <Grid item xs={5} sm={12}>
                                            <ColorButton variant="contained" type="submit">
                                                Update Attendance Settings
                                            </ColorButton>
                                        </Grid>
                                    </Grid>
                                </form>
                                {/* </TabPanel> */}

                                {/* <TabPanel value={value1} index={1}>

                                    <form onSubmit={submitHandler} encType="multipart/form-data">
                                        <Grid container spacing={4} alignItems="center" justifyContent="center">
                                            <Grid item xs={12} sm={12}>
                                                <TextField
                                                    id="designation"
                                                    name="designation"
                                                    placeholder="Select Shift Type"
                                                    value={selectedShift}
                                                    label="Select Shift Type"
                                                    variant="outlined"
                                                    fullWidth
                                                    select
                                                    onChange={(e) => setSelectedShift(e.target.value)}
                                                >
                                                    {shift?.map((item, index) => {
                                                        return (
                                                            <MenuItem value={index}>{item?.shiftName} ({moment(new Date(item?.companyInTime)).format("HH:mm A")} to {moment(new Date(item?.companyOutTime)).format("HH:mm A")})</MenuItem>

                                                        )
                                                    })}


                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12} sm={12}>
                                                <Typography variant="h3" gutterBottom>
                                                    Check-In Time
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={6} sm={6}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <TimePicker
                                                        label="Set Check-In Time"
                                                        fullwidth
                                                        value={shift && shift[selectedShift] ? shift[selectedShift].companyInTime : new Date()}
                                                        onChange={(newValue) => {
                                                            let x = shift;
                                                            x[selectedShift].companyInTime = newValue;
                                                            setShift(x);
                                                        }}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </LocalizationProvider>
                                            </Grid>

                                            <Grid item xs={6} sm={6}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <TimePicker
                                                        label="Set Check-In Buffer Time"
                                                        fullwidth
                                                        value={shift && shift[selectedShift] ? shift[selectedShift].companyInBufferTime : new Date()}
                                                        onChange={(newValue) => {
                                                            let x = shift;
                                                            x[selectedShift].companyInBufferTime = newValue;
                                                            setShift(x);
                                                        }}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </LocalizationProvider>
                                            </Grid>

                                            <Grid item xs={12} sm={12}>
                                                <Typography variant="h3" gutterBottom>
                                                    Check-Out Time
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={6} sm={6}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <TimePicker
                                                        label="Set Check-Out Time"
                                                        fullwidth
                                                        value={shift && shift[selectedShift] ? shift[selectedShift].companyOutTime : new Date()}
                                                        onChange={(newValue) => {
                                                            let x = shift;
                                                            x[selectedShift].companyOutTime = newValue;
                                                            setShift(x);
                                                        }}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </LocalizationProvider>
                                            </Grid>
                                            <Grid item xs={6} sm={6}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <TimePicker
                                                        label="Set Check-Out Buffer Time"
                                                        value={value}
                                                        fullwidth
                                                        value={shift && shift[selectedShift] ? shift[selectedShift].companyOutBufferTime : new Date()}
                                                        onChange={(newValue) => {
                                                            let x = shift;
                                                            x[selectedShift].companyOutBufferTime = newValue;
                                                            setShift(x);
                                                        }}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </LocalizationProvider>
                                            </Grid>

                                            <Grid item xs={5} sm={12}>
                                                <ColorButton variant="contained" type="submit">
                                                    Update Attendance Settings
                                                </ColorButton>
                                            </Grid>
                                        </Grid>
                                    </form>
                                </TabPanel> */}

                            </Container>
                        </>
                    )}

                </TabPanel>
                <TabPanel value={value} index={2}>

                    {user && (
                        <Container>
                            <form onSubmit={submitHandler} encType="multipart/form-data">
                                <Grid container spacing={4} style={{ marginTop: '5px' }}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            id="bonasPercentage"
                                            type="number"
                                            name="bonusPercentage"
                                            placeholder="Enter Bonus Percentage"
                                            fullWidth
                                            variant="outlined"
                                            label="Enter Bonus Percentage"
                                            value={bonusPer}
                                            onChange={(e) => setBonusPer(e.target.value)}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            id="designation"
                                            name="designation"
                                            placeholder="Designation"
                                            value={designation}
                                            label="Designation"
                                            variant="outlined"
                                            fullWidth
                                            select
                                            onChange={(e) => setDesignation(e.target.value)}
                                        >
                                            <MenuItem value="Skilled">Skilled</MenuItem>
                                            <MenuItem value="Semi Skilled">Semi Skilled</MenuItem>
                                            <MenuItem value="Un Skilled">Un Skilled</MenuItem>
                                            <MenuItem value="Others">Others</MenuItem>
                                        </TextField>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            id="minimum-wages2"
                                            type="text"
                                            name="minimum-wages2"
                                            placeholder="Enter Minimum Wages"
                                            fullWidth
                                            variant="outlined"
                                            label="Enter Minimum Wages"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                label="Select Month"
                                                onChange={(newValue) => {
                                                    setbonusMonth(newValue);
                                                }}
                                                value={bonusMonth}
                                                renderInput={(params) => <TextField {...params} name="date" />}
                                            />
                                        </LocalizationProvider>
                                    </Grid>


                                    <Grid item xs={5} sm={12}>
                                        <ColorButton variant="contained" type="submit">
                                            Update Bonus Settings
                                        </ColorButton>
                                    </Grid>
                                </Grid>
                            </form>
                        </Container>
                    )}
                </TabPanel>

            </Box>
        </StyledMainCardSalary>

    );
}
