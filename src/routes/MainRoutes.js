import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Calendar from 'ui-component/attendenceui/attendencecalander/attendencedate';

// Dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// Employee Routing
const AddEmployee = Loadable(lazy(() => import('views/employee/addEmployee')));
const ViewEmployee = Loadable(lazy(() => import('views/employee/viewEmployee')));

// Attendance Routing
const MachineAttendance = Loadable(lazy(() => import('views/attendance/machineAttendance')));
const AddAttendance = Loadable(lazy(() => import('views/attendance/addAttendance')));
const ViewAttendance = Loadable(lazy(() => import('views/attendance/viewAttendance')));
const Overtime = Loadable(lazy(() => import('views/attendance/overtime')));
const LeaveManage = Loadable(lazy(() => import('views/attendance/leaveManage')));

// Rates Routing
const AddPureRate = Loadable(lazy(() => import('views/PcsRate/AddPureRate')));
const ViewPureRate = Loadable(lazy(() => import('views/PcsRate/ViewPureRate')));
const AddMixRate = Loadable(lazy(() => import('views/PcsRate/AddMixRate')));
const ViewMixRate = Loadable(lazy(() => import('views/PcsRate/ViewMixRate')));

// Payments Routing
const RecoveryAllowances = Loadable(lazy(() => import('views/payments/recoveryAllowances')));
const ViewSalary = Loadable(lazy(() => import('views/payments/viewSalary')));
const ViewBonus = Loadable(lazy(() => import('views/payments/viewBonus')));
const ECRChallan = Loadable(lazy(() => import('views/payments/ECRChallan')));

//Pcs Rate Category
const ViewRateCategory = Loadable(lazy(() => import('views/rateCategory/viewRateCategory')));

// User Role Routing
const AddUser = Loadable(lazy(() => import('views/roles/addUser')));
const ManageUser = Loadable(lazy(() => import('views/roles/manageUser')));
const CompanyProfile = Loadable(lazy(() => import('views/companyProfile/company-profile')));
const CompanyProfileNew = Loadable(lazy(() => import('views/companyProfile/companyProfile')));

//Reports Route
const WeeklyOffReport = Loadable(lazy(() => import('views/report/weeklyOff')));
const AttendanceReport = Loadable(lazy(() => import('views/report/attendanceReport')));
const AbsenteesReport = Loadable(lazy(() => import('views/report/absenteesReport')));
const LeaveReport = Loadable(lazy(() => import('views/report/leaveReport')));
const CompensatoryOffReport =  Loadable(lazy(() => import('views/report/compensatoryOff')));

//Shift Routing
const ManageShift = Loadable(lazy(() => import('views/shift/manageShift')));

// ==============================|| MAIN ROUTING ||============================== //



const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: '/dashboard',
            element: <DashboardDefault />
        },
        {
            path: '/employee/add-employee',
            element: <AddEmployee />
        },
        {
            path: '/employee/view-employee',
            element: <ViewEmployee />
        },
        {
            path: '/attendance/machine-attendance',
            element: <MachineAttendance />
        },
        {
            path: '/attendance/add-attendance',
            element: <AddAttendance />
        },
        {
            path: '/attendance/view-attendance',
            element: <ViewAttendance />
        },
        {
            path: '/attendance/overtime',
            element: <Overtime />
        },
        {
            path: '/attendance/leave-manage',
            element: <LeaveManage />
        },
        {
            path: '/piece-rate/add-pure-pcs-rate',
            element: <AddPureRate />
        },
        {
            path: '/piece-rate/view-pure-pcs-rate',
            element: <ViewPureRate />
        },
        {
            path: '/piece-rate/add-mix-pcs-rate',
            element: <AddMixRate />
        },
        {
            path: '/piece-rate/view-mix-pcs-rate',
            element: <ViewMixRate/>
        },
        {
            path: '/payments/recovery-and-allowances',
            element: <RecoveryAllowances />
        },
        {
            path: '/payments/view-salary',
            element: <ViewSalary />
        },
        {
            path: '/payments/ecr-challan',
            element: <ECRChallan />
        },
        {
            path: '/roles/add-user',
            element: <AddUser />
        },
        {
            path: '/roles/manage-user',
            element: <ManageUser />
        },
        {
            path: '/attendance/event/:id',
            element: <Calendar />
        },
        {
            path: '/payments/bonus',
            element: <ViewBonus />
        },
        // {
        //     path: '/company-profile',
        //     element: <CompanyProfile />
        // },
        {
            path: '/company-profile',
            element: <CompanyProfileNew />
        },
        {
            path: '/rate-category/view-rate-category',
            element: <ViewRateCategory />
        },
        {
            path: '/report/weeklyoff-report',
            element: <WeeklyOffReport />
        },
        {
            path: '/report/attendance-report',
            element: <AttendanceReport />
        },
        {
            path: '/report/absentees-report',
            element: <AbsenteesReport />
        },
        {
            path: '/report/leave-report',
            element: <LeaveReport />
        },
        {
            path: '/report/compensatory-off-report',
            element: <CompensatoryOffReport />
        },
        {
            path: '/shift/manage-shift',
            element: <ManageShift />
        }
    ]
};

export default MainRoutes;
