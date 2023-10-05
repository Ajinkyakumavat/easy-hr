import { useEffect, useState } from 'react';

// material-ui
import { Button, Grid } from '@mui/material';

// project imports
import TotalClientCard from './TotalClientCard';
import HolidayCard from './HolidayCard';
import AdminTotalEmployeesCard from './AdminTotalEmployeesCard';
import AddClientCard from './AddClientCard';
import ManageClientCard from './ManageClientCard';
import { gridSpacing } from 'store/constant/customizationConstant';
import NewJoiningCard from './NewJoiningCard';
import { useDispatch, useSelector } from 'react-redux';
import LatestClient from './LatestClient';
import ViewPFRemittance from './TodayAbsentees';
import AddPFRemittanceCard from './TodayPresent';
import { Link, useNavigate } from 'react-router-dom';
import { myEmployee } from 'store/actions/employeeAction';
import { allUsers } from 'store/actions/userActions';
import AddRateCard from "./AddRateCategory";
import ViewRateCard from "./ViewRateCategory";
import TodayPresent from "./TodayPresent";
import TodayAbsentees from "./TodayAbsentees";
import EarlyGoers from "./EarlyGoers";
import LateComers from "./LateComers";
import BirthCard from "./BirthCard";
import OverTimeCard from "./OTCard";
import LeaveCard from "./LeaveCard";
import axios from 'axios';
import { getCompany } from 'store/actions/companyAction';
// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const dispatch = useDispatch();

    const [isLoading, setLoading] = useState(true);
    const [employeeAdmin, setEmployeeAdmin] = useState(0);
    const { user } = useSelector((state) => state.auth);
    const { error, orders } = useSelector((state) => state.myEmployee);
    const { users } = useSelector((state) => state.allUsers);
    //console.log('order', orders);

    useEffect(() => {
        dispatch(myEmployee(1, 99999999));
        dispatch(allUsers(1, -1, 99999999));
        dispatch(getCompany());
    }, [dispatch, error]);

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(false);



        //console.log('user====>', user);
        if (!user) {
            navigate('/login');
        }


        axios
            .get(
                `http://52.86.15.74:4000/api/v1/admin/employee/allEmployees?limit=${9999999999}`,
                {
                    withCredentials: true
                }
            )
            .then((data) => {
                setEmployeeAdmin(data?.employees?.length);
            })



        axios
            .get(
                `http://52.86.15.74:4000/api/v1/employee/attendance/mylist/${new Date().getMonth() + 1}/${new Date().getFullYear()}?limit=${9999999999}`,
                {
                    withCredentials: true
                }
            )
            .then((data) => {
                let y = data.data.employeesAttendance;
                let present = 0;
                let absent = 0;
                let todayLateCommer = 0;
                let todayLateGoer = 0;
                let todayweekly = 0;
                let todayleave = 0;

                y.forEach(element => {
                    element?.employeeAttendance?.forEach((item) => {
                        if (new Date().getDate() == item?.date && item?.attendance == true) {
                            present++;
                        }
                        else if (new Date().getDate() == item?.date) {
                            absent++;
                        }

                        if (item?.shift == "WO" && new Date().getDate() == item?.date) {
                            todayweekly++;
                        }
                        if (item?.leave != "" && item?.leave && new Date().getDate() == item?.date) {
                            todayleave++;
                        }


                        if (new Date(companys?.orders?.user?.companyInTime).getHours() > new Date(item?.checkIn).getHours() && new Date(companys?.orders?.user?.companyInTime).getMinutes() > new Date(item?.checkIn).getMinutes() && new Date().getDate() == item?.date) {
                            todayLateCommer++;
                        }

                        if (new Date(companys?.orders?.user?.companyOutTime).getHours() < new Date(item?.checkOut).getHours() && new Date(companys?.orders?.user?.companyOutTime).getMinutes() < new Date(item?.checkOut).getMinutes() && new Date().getDate() == item?.date) {
                            todayLateGoer++;
                        }
                    })
                });

                setTotalPresent(present);
                setTotalAbsent(absent);
                setLateCommers(todayLateCommer);
                setLateGommers(todayLateGoer);
                setTodayWeekly(todayweekly)
                setTodayLeave(todayleave)


            })
            .catch((error) => {
                console.error(error);
            });

    }, []);



    const [totalAbsent, setTotalAbsent] = useState(0);
    const [totalPresent, setTotalPresent] = useState(0);
    const [lateCommers, setLateCommers] = useState(0);
    const [lateGoers, setLateGommers] = useState(0);
    const [todayweekly, setTodayWeekly] = useState(0);
    const [todatLeave, setTodayLeave] = useState(0);

    const companys = useSelector((state) => state.myCompany);




    console.log(orders)








    return (
        <>
            {user && user.role === 'admin' && (
                <Grid container spacing={gridSpacing} style={{ overflow: 'hidden' }}>
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item lg={3} md={12} sm={12} xs={12}>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item sm={6} xs={12} md={6} lg={12}>
                                        <AddClientCard isLoading={isLoading} />
                                    </Grid>
                                    <Grid item sm={6} xs={12} md={6} lg={12}>
                                        <ManageClientCard isLoading={isLoading} />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item lg={3} md={12} sm={12} xs={12}>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item sm={6} xs={12} md={6} lg={12}>
                                        <AddRateCard isLoading={isLoading} />
                                    </Grid>
                                    <Grid item sm={6} xs={12} md={6} lg={12}>
                                        <ViewRateCard isLoading={isLoading} />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item lg={3} md={6} sm={6} xs={12}>
                                <AdminTotalEmployeesCard isLoading={isLoading} totalEmp={orders?.employeeCount} />
                            </Grid>
                            <Grid item lg={3} md={6} sm={6} xs={12}>
                                <TotalClientCard isLoading={isLoading} totalCli={users?.count - 1} />
                            </Grid>

                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} md={4}>
                                <HolidayCard isLoading={isLoading} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <HolidayCard isLoading={isLoading} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <LatestClient isLoading={isLoading} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )}
            {user && user.role === 'user' && (
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item lg={3} md={6} sm={6} xs={12}>
                                <AdminTotalEmployeesCard totalEmp={orders?.count} isLoading={isLoading} />
                            </Grid>

                            <Grid item lg={3} md={12} sm={12} xs={12}>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item sm={6} xs={12} md={6} lg={12}>
                                        <TodayPresent presentData={totalPresent} isLoading={isLoading} />
                                    </Grid>
                                    <Grid item sm={6} xs={12} md={6} lg={12}>
                                        <TodayAbsentees absentData={totalAbsent} isLoading={isLoading} />
                                    </Grid>
                                </Grid>
                            </Grid>



                            <Grid item lg={3} md={12} sm={12} xs={12}>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item sm={6} xs={12} md={6} lg={12}>
                                        <LeaveCard toadyleave={todatLeave} isLoading={isLoading} />
                                    </Grid>
                                    <Grid item sm={6} xs={12} md={6} lg={12}>
                                        <OverTimeCard todayweekly={todayweekly} isLoading={isLoading} />
                                    </Grid>

                                </Grid>
                            </Grid>

                            <Grid item lg={3} md={12} sm={12} xs={12}>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item sm={6} xs={12} md={6} lg={12}>
                                        <LateComers lateComer={lateCommers} isLoading={isLoading} />
                                    </Grid>
                                    <Grid item sm={6} xs={12} md={6} lg={12}>
                                        <EarlyGoers lateGoer={lateGoers} isLoading={isLoading} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} md={4}>
                                <HolidayCard isLoading={isLoading} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <BirthCard isLoading={isLoading} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <LatestClient isLoading={isLoading} role={user} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

            )}
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={12} mt={5}>
                    <Button variant="outlined" style={{ width: "100%" }} onClick={(e) => {
                        e.preventDefault();

                        var urls = [
                            '/template/attendance.csv',
                            '/template/Daywise.csv',
                            '/template/add employee.csv'
                        ]

                        var interval = setInterval(download, 300, urls);

                        function download(urls) {
                            var url = urls.pop();

                            var a = document.createElement("a");
                            a.setAttribute('href', url);
                            a.setAttribute('download', '');
                            a.setAttribute('target', '_blank');
                            a.click();

                            if (urls.length == 0) {
                                clearInterval(interval);
                            }
                        }

                    }}>Download all CSV template</Button>
                </Grid>
            </Grid>
        </>
    );
};
export default Dashboard;
