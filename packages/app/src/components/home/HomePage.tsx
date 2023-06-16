import React from 'react';
import Grid from '@material-ui/core/Grid';
import { HomePageCompanyLogo } from '@backstage/plugin-home';

export const HomePage = () => {
    /* We will shortly compose a pretty homepage here. */
    return (
        <Grid container spacing={3} justifyContent='center'>
            <Grid item xs={12} md={4}>
                <HomePageCompanyLogo />
            </Grid>
        </Grid>
    )
};