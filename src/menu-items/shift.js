// assets
import { IconReport } from '@tabler/icons';

// constant
const icons = {
    IconReport
};

// ==============================|| PAYMENTS MENU ITEMS ||============================== //

const shift = {
    id: 'shift',
    title: 'Shift',
    type: 'group',
    children: [
        {
            id: 'manageShift',
            title: 'Manage Shift',
            type: 'item',
            url: '/shift/manage-shift',
            icon: icons.IconReport,
            breadcrumbs: false
        }
    ]
};

export default shift;
