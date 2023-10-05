import axios from 'axios';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAttendence, myAttendence, myEmployeeAttendence } from '../store/actions/attendenceAction';
import './switch.css';
import AuthContext, { AuthContextProvider } from 'authContext/AuthContext';

function arrayObjectIndexOf(myArray, searchTerm, property) {
    for (let i = 0, len = myArray.length; i < len; i += 1) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

export default function BasicSwitch(props) {
    const { data, date, page, disabled, largest, index, selecttoday } = props;
    console.log("dates", date);
    const [leave, setleave] = React.useState('');
    const {state1, setState,Leave, setLeave} = React.useContext(AuthContextProvider)

    const dateArray = [];
    const currentDate = new Date(date[0]);

    while (currentDate <= date[1]) {
        dateArray.push(currentDate.getDate());
        currentDate.setDate(currentDate.getDate() + 1);
    }

    React.useEffect(() => {
        setState(true)
    },[])

    const dispatch = useDispatch();

    React.useEffect(() => {
        /* eslint no-underscore-dangle: 0 */
        axios
            .get(`http://52.86.15.74:4000/api/v1/employee/attendance/mylist/${date[0]?.getMonth() + 1}/${date[0]?.getFullYear()}/${data?._id}`, {
                withCredentials: true
            })
            .then((res) => {
                //console.log(res.data.employeesAttendance);
                if (disabled === false && res.data.employeesAttendance !== undefined && res.data.employeesAttendance.length > 0) {
                    if (
                        arrayObjectIndexOf(res.data.employeesAttendance[0].employeeAttendance, date[0]?.getDate(), 'date') > -1 &&
                        arrayObjectIndexOf(res.data.employeesAttendance[0].employeeAttendance, true, 'attendance') > -1
                    ) {
                        setState(true);
                    }
                    if (
                        arrayObjectIndexOf(res.data.employeesAttendance[0].employeeAttendance, date[0]?.getDate(), 'date') > -1 &&
                        arrayObjectIndexOf(res.data.employeesAttendance[0].employeeAttendance, false, 'attendance') > -1
                    ) {
                        setState(false);
                        setleave();
                    } else {
                        dispatch(
                            addAttendence({
                                UAN: data?.companyDetails?.aadhaarNo,
                                fullName: data?.personalDetails?.fullName,
                                mobileNo: data?.personalDetails?.mobileNo,
                                joiningDate: data?.companyDetails?.joiningDate,
                                designation: data?.companyDetails?.designation,
                                dailyWages: data?.companyDetails?.dailyWages,
                                employeeAttendance: { date: date[0]?.getDate(), attendance: true },
                                attendanceMonth: date[0]?.getMonth() + 1,
                                attendanceYear: date[0]?.getFullYear(),
                                /* eslint no-underscore-dangle: 0 */
                                employee: data?._id
                            })
                        );
                    }
                } else if (disabled === false) {
                    dispatch(
                        addAttendence({
                            UAN: data?.companyDetails?.aadhaarNo,
                            fullName: data?.personalDetails?.fullName,
                            mobileNo: data?.personalDetails?.mobileNo,
                            joiningDate: data?.companyDetails?.joiningDate,
                            designation: data?.companyDetails?.designation,
                            dailyWages: data?.companyDetails?.dailyWages,
                            employeeAttendance: { date: date[0]?.getDate(), attendance: true },
                            attendanceMonth: date[0]?.getMonth() + 1,
                            attendanceYear: date[0]?.getFullYear(),
                            /* eslint no-underscore-dangle: 0 */
                            employee: data?._id
                        })
                    );
                }
            });
    }, [date, page, disabled, selecttoday]);

    const x = true;
    const handleSwitchChange = (e) => {
        dispatch(
            addAttendence({
                UAN: data?.companyDetails?.aadhaarNo,
                fullName: data?.personalDetails?.fullName,
                mobileNo: data?.personalDetails?.mobileNo,
                joiningDate: data?.companyDetails?.joiningDate,
                designation: data?.companyDetails?.designation,
                dailyWages: data?.companyDetails?.dailyWages,
                employeeAttendance: { date: date[0]?.getDate(), attendance: e.target.checked },
                attendanceMonth: date[0]?.getMonth() + 1,
                attendanceYear: date[0]?.getFullYear(),
                /* eslint no-underscore-dangle: 0 */
                employee: data?._id
            })
        );
        setState(e.target.checked);
    };

    const ChangeHandler = (e) => {
        console.log("dates", typeof (date[0]?.getDate()));

        {
            dateArray.map((i) => {
                console.log("idata", i);
                dispatch(
                    addAttendence({
                        UAN: data?.companyDetails?.aadhaarNo,
                        fullName: data?.personalDetails?.fullName,
                        mobileNo: data?.personalDetails?.mobileNo,
                        joiningDate: data?.companyDetails?.joiningDate,
                        designation: data?.companyDetails?.designation,
                        dailyWages: data?.companyDetails?.dailyWages,
                        employeeAttendance: { date: i, attendance: state1, leave: e.target.value },
                        attendanceMonth: date[0]?.getMonth() + 1,
                        attendanceYear: date[0]?.getFullYear(),
                        /* eslint no-underscore-dangle: 0 */
                        employee: data?._id
                    })
                );
            })
        }
        setLeave(true)

        setleave(e.target.value);
    };
    //console.log(leave);

    return (
        <span>
            {state1 === false && (
                <select style={{ padding: '10px 20px', marginRight: '10px', marginBottom: '10px' }} onBlur={ChangeHandler}>
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
            )}
            <label className="switch" htmlFor={`x${index}`}>
                <input type="checkbox" checked={state1} onChange={handleSwitchChange} disabled={disabled} id={`x${index}`} />
                <span className="slider round" />
            </label>
        </span>
    );
}
