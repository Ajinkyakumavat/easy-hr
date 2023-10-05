import { UPDATE_COMPANY_SUCCESS } from 'store/constant/companyConstant';
import {
    MY_EMPLOYEE_FAIL,
    MY_EMPLOYEE_REQUEST,
    MY_EMPLOYEE_SUCCESS,
    ADD_EMPLOYEE_FAIL,
    ADD_EMPLOYEE_REQUEST,
    ADD_EMPLOYEE_SUCCESS,
    ADD_ROLES_REQUEST,
    ADD_ROLES_SUCCESS,
    ADD_ROLES_FAIL,
    ADD_ROLES_RESET,
    CLEAR_ERRORS,
    UPDATE_EMPLOYEE_REQUEST
} from 'store/constant/employeeConstant';

export const addEmployeeReducer = (state = {}, action) => {
    switch (action.type) {
        case ADD_EMPLOYEE_REQUEST:
            return {
                ...state,
                loading: true
            };

        case ADD_EMPLOYEE_SUCCESS:
            return {
                ...state,
                loading: false,
                employee: action.payload
            };

        case ADD_EMPLOYEE_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};
export const addRoleReducer = (state = {}, action) => {
    switch (action.type) {
        case ADD_ROLES_REQUEST:
            return {
                ...state,
                loading: true
            };

        case ADD_ROLES_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload,
                employee: action.payload
            };

        case ADD_ROLES_FAIL:
            return {
                ...state,
                error: action.payload
            };
        case ADD_ROLES_RESET:
            return {
                ...state,
                success: false
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};
export const myEmployeeReducer = (state = { orders: null, isUpdated: false }, action) => {
    switch (action.type) {
        case MY_EMPLOYEE_REQUEST:
            return {
                ...state,
                loading: true
            };
        case MY_EMPLOYEE_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: action.payload
            };
        case MY_EMPLOYEE_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case UPDATE_EMPLOYEE_REQUEST:
            return {
                ...state,
                loading: true
            };
        case UPDATE_COMPANY_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: !state.isUpdated
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };

        default:
            return state;
    }
};
