import PropTypes from 'prop-types';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';

// assets

import TimerOffIcon from '@mui/icons-material/TimerOff';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: 'white',
    color: 'black',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        borderRadius: '50%',
        top: -30,
        right: -180
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        borderRadius: '50%',
        top: -160,
        right: -130
    }
}));

// ==============================|| DASHBOARD - ACTIVE EMPLOYEE CARD ||============================== //

const LateComers = ({ isLoading,lateComer  }) => {
    const theme = useTheme();

    return (
        <>
            {isLoading ? (
                <TotalIncomeCard />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2 }}>
                        <List sx={{ py: 0 }}>
                            <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                                <ListItemAvatar>
                                    <Avatar
                                        variant="rounded"
                                        sx={{
                                            ...theme.typography.commonAvatar,
                                            ...theme.typography.largeAvatar,
                                            backgroundColor: theme.palette.primary[800],
                                            color: '#fff'
                                        }}
                                    >
                                        <TimerOffIcon fontSize="inherit" />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    sx={{
                                        py: 0,
                                        mt: 0.45,
                                        mb: 0.45
                                    }}
                                    primary={<Typography variant="h4">{lateComer }</Typography>}
                                    secondary={
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                color: theme.palette.grey[500],
                                                mt: 0.5
                                            }}
                                        >
                                            Late Comers
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        </List>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

LateComers.propTypes = {
    isLoading: PropTypes.bool
};

export default LateComers;
