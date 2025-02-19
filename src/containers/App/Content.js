import React from 'react';
import {Switch, Route, Redirect, Router} from 'react-router-dom';
import cn from 'bem-cn-lite';
import {connect} from 'react-redux';

import {ThemeProvider} from '@yandex-cloud/uikit';

import routes, {createHref, CLUSTER_PAGES} from '../../routes';

import Cluster from '../Cluster/Cluster';
import Tenant from '../Tenant/Tenant';
import Node from '../Node/Node';
import Pdisk from '../Pdisk/Pdisk';
import Group from '../Group/Group';
import Pool from '../Pool/Pool';
import Tablet from '../Tablet/Tablet';
import TabletsFilters from '../TabletsFilters/TabletsFilters';
import ReduxTooltip from '../ReduxTooltip/ReduxTooltip';
import Header from '../Header/Header';
import AppIcons from '../AppIcons/AppIcons';

import {getSettingValue} from '../../store/reducers/settings';
import {THEME_KEY} from '../../utils/constants';

import './App.scss';
import PropTypes from 'prop-types';
import HistoryContext from '../../contexts/HistoryContext';
import Authentication from '../Authentication/Authentication';

const b = cn('app');

export function Content(props) {
    const {singleClusterMode} = props;
    const isClustersPage =
        location.pathname.includes('/clusters') ||
        (!singleClusterMode && location.pathname === '/');

    const renderRoute = () => {
        const {children: customRoutes} = props;
        return (
            customRoutes || (
                <Switch>
                    <Route path={routes.cluster} component={Cluster} />
                    <Route path={routes.tenant} component={Tenant} />
                    <Route path={routes.pdisk} component={Pdisk} />
                    <Route path={routes.node} component={Node} />
                    <Route path={routes.group} component={Group} />
                    <Route path={routes.pool} component={Pool} />
                    <Route path={routes.tablet} component={Tablet} />
                    <Route path={routes.tabletsFilters} component={TabletsFilters} />
                    <Redirect
                        to={createHref(routes.cluster, {
                            activeTab: CLUSTER_PAGES.tenants.id,
                        })}
                    />
                </Switch>
            )
        );
    };
    return (
        <React.Fragment>
            {!isClustersPage && <Header />}
            <main className={b('main')}>{renderRoute()}</main>
            <ReduxTooltip />
            <AppIcons />
        </React.Fragment>
    );
}

Content.propTypes = {
    singleClusterMode: PropTypes.bool,
    children: PropTypes.node,
};

function ContentWrapper(props) {
    const {theme, singleClusterMode, isAuthenticated} = props;
    return (
        <HistoryContext.Consumer>
            {(history) => (
                <Router history={history}>
                    <ThemeProvider theme={theme}>
                        <div className={!singleClusterMode ? b() : b({embedded: true})}>
                            {isAuthenticated ? props.children : <Authentication />}
                        </div>
                    </ThemeProvider>
                </Router>
            )}
        </HistoryContext.Consumer>
    );
}

ContentWrapper.propTypes = {
    theme: PropTypes.string,
    singleClusterMode: PropTypes.bool,
    isAuthenticated: PropTypes.bool,
    children: PropTypes.node,
};

function mapStateToProps(state) {
    return {
        theme: getSettingValue(state, THEME_KEY),
        isAuthenticated: state.authentication.isAuthenticated,
        singleClusterMode: state.singleClusterMode,
    };
}

export default connect(mapStateToProps)(ContentWrapper);
