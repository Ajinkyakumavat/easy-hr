import axios from 'axios';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAttendence, myAttendence, myEmployeeAttendence, myEmployeeAttendenceOvertimeStatus } from '../store/actions/attendenceAction';
import './switch.css';

function arrayObjectIndexOf(myArray, searchTerm, property) {
    for (let i = 0, len = myArray.length; i < len; i += 1) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

export default function MachineSwitch(props) {
    const { data, date, page, disabled, index, selecttoday } = props;
    const [state, setState] = React.useState(true);
    const [leave, setleave] = React.useState('');

    const dispatch = useDispatch();

    React.useEffect(() => {
        /* eslint no-underscore-dangle: 0 */
        axios
            .get(`http://localhost:4000/api/v1/employee/attendance/mylist/${date?.getMonth() + 1}/${date?.getFullYear()}/${data?.employee}`, {
                withCredentials: true
            })
            .then((res) => {
                if (res.data.employeesAttendance !== undefined && res.data.employeesAttendance.length > 0) {
                    if (
                        arrayObjectIndexOf(res.data.employeesAttendance[0].employeeAttendance, date?.getDate(), 'date') > -1 &&
                        arrayObjectIndexOf(res.data.employeesAttendance[0].employeeAttendance, true, 'isOvertime') > -1
                    ) {
                        console.log("yes");
                        setState(true);
                    }
                    if (
                        arrayObjectIndexOf(res.data.employeesAttendance[0].employeeAttendance, date?.getDate(), 'date') > -1 &&
                        arrayObjectIndexOf(res.data.employeesAttendance[0].employeeAttendance, false, 'isOvertime') > -1
                    ) {
                        console.log("no");

                        setState(false);
                    }
                }
            });
    }, [date, page, disabled, selecttoday]);

    const x = true;
    const handleSwitchChange = (e) => {
        dispatch(
            myEmployeeAttendenceOvertimeStatus(
                data?.employee,
                date?.getMonth() + 1,
                date?.getFullYear(),
                e.target.checked,
                date?.getDate(),
            )
        );
        setState(e.target.checked);
    };


    return (
        <span>

            <label className="switch" htmlFor={`x${index}`}>
                <input type="checkbox" checked={state} onChange={handleSwitchChange} disabled={disabled} id={`x${index}`} />
                <span className="slider round" />
            </label>
        </span>
    );
}
