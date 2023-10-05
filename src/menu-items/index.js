import dashboard from './dashboard';
import attendance from './attendance';
import payments from './payments';
import employee from './employee';
import pcsRate from "./rate";
import report from "./report";
import shift from "./shift";

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
    items: [dashboard, employee, attendance, shift, payments,report]
};

export default menuItems;
