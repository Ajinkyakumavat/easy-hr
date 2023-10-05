// assets
import { IconAlarm, IconEyeglass, IconCalendarTime, IconCalendarOff, IconReport } from '@tabler/icons';
// constant
const icons = {
    IconAlarm,
    IconEyeglass,
    IconCalendarTime,
    IconCalendarOff,
    IconReport
};

// ==============================|| ATTENDANCE MENU ITEMS ||============================== //

const report = {
    id: 'report',
    title: 'Report',
    type: 'group',
    children: [
        {
            id: 'attendanceReport',
            title: 'Attendance Report',
            type: 'item',
            url: '/report/attendance-report',
            icon: icons.IconReport,
            breadcrumbs: false
        },
        {
            id: 'absentReport',
            title: 'Absentees Report',
            type: 'item',
            url: '/report/absentees-report',
            icon: icons.IconReport,
            breadcrumbs: false
        },
        {
            id: 'leaveReport',
            title: 'Leave Report',
            type: 'item',
            url: '/report/leave-report',
            icon: icons.IconReport,
            breadcrumbs: false
        },
        {
            id: 'WeeklyOffReport',
            title: 'Weekly Off Report',
            type: 'item',
            url: '/report/weeklyoff-report',
            icon: icons.IconReport,
            breadcrumbs: false
        },
        {
            id: 'compensatoryOffReport',
            title: 'Compensatory Off Report',
            type: 'item',
            url: '/report/compensatory-off-report',
            icon: icons.IconReport,
            breadcrumbs: false
        }
    ]
};

export default report;
