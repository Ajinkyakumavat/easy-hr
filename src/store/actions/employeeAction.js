import axios from 'axios';
import {
    MY_EMPLOYEE_FAIL,
    MY_EMPLOYEE_REQUEST,
    MY_EMPLOYEE_SUCCESS,
    ADD_EMPLOYEE_FAIL,
    ADD_EMPLOYEE_REQUEST,
    ADD_EMPLOYEE_SUCCESS,
    ADD_ROLES_FAIL,
    ADD_ROLES_REQUEST,
    ADD_ROLES_SUCCESS,
    ADD_ROLES_RESET,
    CLEAR_ERRORS
} from 'store/constant/employeeConstant';
import { toast } from 'react-toastify';
import { UPDATE_COMPANY_FAIL, UPDATE_COMPANY_REQUEST, UPDATE_COMPANY_SUCCESS } from 'store/constant/companyConstant';

axios.defaults.withCredentials = true;
// Add Employee
export const addEmployee = (userData) => async (dispatch) => {
    try {
        dispatch({ type: ADD_EMPLOYEE_REQUEST });
        const config = {
            headers: {
                'Content-Type': 'application/json',
                withCredentials: true
            }
        };
        const y = {
            personalDetails: {
                fullName: userData.fullName,
                fatherName: userData.fatherName,
                mobileNo: userData.mobileNo,
                gender: userData.gender,
                dob: userData.date,
                currentAddress: userData.currentAddress,
                permanentAddress: userData.permanentAddress
            },
            companyDetails: {
                UAN: userData.uanNumber,
                aadhaarNo: userData.aadhaarNumber,
                panNo: userData.panNumber,
                drivingLicense: userData.drivingLicenses,
                designation: userData.designation,
                joiningDate: userData.joiningDate,
                selectWages: userData.selectWages,
                sickLeave: userData.sickLeave,
                casualLeave: userData.casualLeave
            },
            salaryDetails: {
                dailyWages: userData.dailyWages,
                basicSalary: userData.basicSalary,
                hra: userData.hra,
                con: userData.con,
                medical: userData.medical,
                education: userData.education,
                canteen: userData.canteen,
                incomeTax: userData.incomeTax,
                machineRate:userData.machineRate
            },
            bankDetails: {
                bankName: userData.bankName,
                ifscCode: userData.bankIfsc,
                accountNo: userData.accountNo,
                PFNominee: userData.pfNominee,
                gratuityNominee: userData.gratuityNominee,
                leaveNominee: userData.leaveNominee
            },
            pfDetails: {
                wereMember: userData.wereMember,
                withdrawn: userData.withdrawn,
                aboveBasic: userData.aboveBasic 
            }
        };
        const { data } = await axios.post(' http://localhost:4000/api/v1/employees/new', y, config);
        toast.success('Details Submitted Successfully!');
        dispatch({
            type: ADD_EMPLOYEE_SUCCESS,
            payload: data.user
        });
        dispatch({ type: ADD_EMPLOYEE_REQUEST });
    } catch (error) {
        dispatch({
            type: ADD_EMPLOYEE_FAIL,
            payload: error
        });
    }
};

// Get currently logged in user employee list
export const myEmployee = (page, limit, keyword) => async (dispatch) => {
    try {
        dispatch({ type: MY_EMPLOYEE_REQUEST });

        const { data } = await axios.get(
            `http://localhost:4000/api/v1/employees/mylist?page=${page}${limit && '&limit=' + limit}${
                keyword ? '&keyword=' + keyword : ''
            }&searchBy=${'personalDetails.fullName,companyDetails.aadhaarNo'}`,
            {
                withCredentials: true
            }
        );
        dispatch({
            type: MY_EMPLOYEE_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: MY_EMPLOYEE_FAIL,
            payload: error.response
        });
    }
};

//update employee

export const updateEmployee = (id, data) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_COMPANY_REQUEST });

        const x = await axios.put(`http://localhost:4000/api/v1/employee/${id}`, data, {
            withCredentials: true
        });
        dispatch({
            type: UPDATE_COMPANY_SUCCESS,
            payload: x
        });
    } catch (error) {
        dispatch({
            type: UPDATE_COMPANY_FAIL,
            payload: error.response
        });
    }
};

// Add Roles
export const addRoles = (userData) => async (dispatch) => {
    try {
        dispatch({ type: ADD_ROLES_REQUEST });
        const config = {
            headers: {
                'Content-Type': 'application/json',
                withCredentials: true
            }
        };

        const { data } = await axios.post('http://localhost:4000/api/v1/admin/register', userData, config);
        dispatch({
            type: ADD_ROLES_SUCCESS,
            payload: data
        });
        dispatch({ type: ADD_ROLES_REQUEST });
    } catch (error) {
        dispatch({
            type: ADD_ROLES_FAIL,
            payload: error
        });
    }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    });
};
